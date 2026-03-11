// app.js

// Variables de estado
const driverData = new Map();
const telemetryData = new Map();
let playerCarIdx = -1;
const pitTimers = new Map();

// Rastro global de vueltas combinadas oficiales para no actualizar innesesariamente
let totalLapsCache = -1;

document.addEventListener("DOMContentLoaded", () => {
  initIRacing();
});

function initIRacing() {
  if (typeof IRacing === "undefined") {
    setTimeout(initIRacing, 100);
    return;
  }

  // --- CONFIGURACIÓN DE VARIABLES ---
  const varsDinamicas = [
    "SessionNum", // Para saber en qué sesión estamos cambiando
    "CarIdxPosition",
    "CarIdxClassPosition",
    "CarIdxF2Time",
    "CarIdxEstTime",
    "CarIdxTireCompound",
    "CarIdxOnPitRoad",
    "PlayerCarInPitStall",
    "PlayerTireCompound",
    "SessionInfo",
  ];

  const varsEstaticas = ["DriverInfo"];

  // IMPORTANTE: Pasamos los parámetros DIRECTO al constructor
  // new IRacing(dinamicas, estaticas, fps)
  const iracing = new IRacing(varsDinamicas, varsEstaticas, 10); // 10 FPS para fluidez en pits y gaps

  iracing.onConnect = () => console.log("Conectado a Kapps");

  iracing.onUpdate = function () {
    // En ir.coffee, 'this' dentro de onUpdate es la instancia de IRacing
    // y los datos están en this.data
    processUpdate(this.data);
  };
}

function processUpdate(data) {
  if (data.SessionNum !== undefined) {
    if (window.currentSessionNum !== data.SessionNum) {
      window.currentSessionNum = data.SessionNum;
      totalLapsCache = -1; // Resetear caché al cambiar de sesión
    }
  }

  // 1. PROCESAR DATOS ESTÁTICOS Y RESULTADOS (Nombres, Tipo de Sesión, Tiempos Oficiales)
  if (data.SessionInfo) {
    const sessionInfoRaw =
      typeof data.SessionInfo === "string"
        ? JSON.parse(data.SessionInfo)
        : data.SessionInfo;

    if (sessionInfoRaw && sessionInfoRaw.Sessions) {
      window.sessionsList = sessionInfoRaw.Sessions;
      const currentNum = window.currentSessionNum || 0;
      const currentSession = window.sessionsList[currentNum];

      if (currentSession) {
        window.sessionType = currentSession.SessionType;

        // Extraer datos oficiales del Standing (Resultados de la sesión)
        if (currentSession.ResultsPositions) {
          let sumOfLaps = 0;

          currentSession.ResultsPositions.forEach((res) => {
            const carIdx = res.CarIdx;

            // Sumar vueltas completadas oficiales por toda la grilla.
            // Si la suma global asciende, alguien cruzó la meta.
            sumOfLaps += res.LapsComplete || 0;

            // Si el piloto no existe en telemetría lo inicializamos
            if (carIdx >= 0 && !telemetryData.has(carIdx)) {
              telemetryData.set(carIdx, {
                position: 0,
                classPosition: 0,
                gap: 0,
                interval: 0,
                lastLapRaw: -1,
                lastLapHistory: [],
                onPitRoad: false,
                bestLapRaw: -1,
                lapsCompleted: 0,
              });
            }

            if (carIdx >= 0) {
              const state = telemetryData.get(carIdx);

              const didCrossFinishLine = res.LapsComplete > state.lapsCompleted;

              // Actualizamos posiciones oficiales desde SessionInfo como respaldo
              // Pero confiaremos más en CarIdxClassPosition dinámico.
              state.position = res.Position;

              if (res.LapsComplete) state.lapsCompleted = res.LapsComplete;

              // Extraer la Mejor Vuelta Oficial
              const bestTime = res.FastestTime > 0 ? res.FastestTime : res.Time;
              if (bestTime > 0) state.bestLapRaw = bestTime;

              // Extraer la Última Vuelta Oficial (LastTime)
              const lastTime = res.LastTime > 0 ? res.LastTime : -1;
              if (
                lastTime > 0 &&
                Math.abs(lastTime - state.lastLapRaw) > 0.001
              ) {
                state.lastLapHistory.push(lastTime);
                if (state.lastLapHistory.length > 3)
                  state.lastLapHistory.shift();
                state.lastLapRaw = lastTime;
              }
            }
          });

          if (sumOfLaps > totalLapsCache || totalLapsCache === -1) {
            console.log(
              `[SessionInfo Update] Vueltas totales detectadas cruzando meta: ${sumOfLaps} - Timestamp: ${new Date().toISOString()}`
            );
            totalLapsCache = sumOfLaps;
          }
        }
      }
    }
  }

  if (data.DriverInfo && data.DriverInfo.Drivers) {
    if (!window.hasLoggedFullDriverInfo) {
      console.log("=== SessionInfo ===", data.SessionInfo);
      console.log("=== DriverInfo  ===", data.DriverInfo);

      window.hasLoggedFullDriverInfo = true;
    }

    playerCarIdx = data.DriverInfo.DriverCarIdx;

    data.DriverInfo.Drivers.forEach((driver) => {
      const carIdx = driver.CarIdx;
      if (carIdx < 0) return;

      // Guardamos la info real del piloto
      driverData.set(carIdx, {
        CarIdx: carIdx,
        UserName: driver.UserName,
        CarNumber: driver.CarNumber,
        CarShortName: driver.CarScreenNameShort || "car",
        FlairName: driver.FlairName || "default", // Para la bandera
        IRating: driver.IRating,
        LicString: driver.LicString,
      });

      // Inicializar telemetría para este piloto si no existe
      if (!telemetryData.has(carIdx)) {
        telemetryData.set(carIdx, {
          position: 0,
          classPosition: 0,
          gap: 0,
          interval: 0,
          lastLapRaw: -1,
          lastLapHistory: [],
          onPitRoad: false,
          bestLapRaw: -1,
          lapsCompleted: 0,
        });
      }
    });
  }

  // 1.5 PROCESAR POSICIONES EN TIEMPO REAL
  // SessionInfo NO actualiza las posiciones constantemente en todas las sesiones,
  // necesitamos esto de la telemetría dinámica.
  if (data.CarIdxClassPosition) {
    data.CarIdxClassPosition.forEach((pos, i) => {
      if (telemetryData.has(i)) telemetryData.get(i).classPosition = pos;
    });
  }

  if (data.CarIdxPosition) {
    data.CarIdxPosition.forEach((pos, i) => {
      if (telemetryData.has(i)) telemetryData.get(i).position = pos;
    });
  }

  // 2. PROCESAR TELEMETRÍA (Deltas, Pits, Llantas)
  const mapping = {
    CarIdxF2Time: "gap",
    CarIdxEstTime: "interval",
    CarIdxOnPitRoad: "onPitRoad",
    CarIdxTireCompound: "tire",
  };

  for (let key in mapping) {
    if (data[key]) {
      data[key].forEach((val, i) => {
        if (telemetryData.has(i)) {
          const state = telemetryData.get(i);
          const field = mapping[key];

          // Lógica de cronómetro de Pits
          if (field === "onPitRoad") {
            if (val && !state.onPitRoad) {
              pitTimers.set(i, { startTime: Date.now() });
            } else if (!val && state.onPitRoad) {
              pitTimers.delete(i);
            }
            state[field] = val;
          } else if (field === "tire") {
            let nTire = "-";
            if (val && val !== -1) {
              nTire = typeof val === "object" ? val.compound : val;
            }
            if (state.tire !== nTire) {
              state.tire = nTire;
            }
          } else {
            state[field] = val;
          }
        }
      });
    }
  }

  // Redibujado forzado incondicional a 10 Hz para reflejar de inmediato
  // cualquier fluctuación en Posición, Vueltas, o Gaps.
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("standing-tbody");
  if (!tbody) return;

  let html = "";

  // Solo array de pilotos reconocidos activamente
  const driversList = [];
  driverData.forEach((info, carIdx) => {
    const state = telemetryData.get(carIdx);
    // Validamos que exista estado y que tenga una posición oficial válida (> 0)
    if (state && (state.classPosition > 0 || state.position > 0)) {
      driversList.push({ info, state, carIdx });
    }
  });

  // RESTAURADO EL SORT DINÁMICO
  // Ordenar primero por ClassPosition entregada por telemetría.
  // Es la que se actualiza más rápido. Si es 0 (no calculada aún), mandamos al fondo.
  driversList.sort((a, b) => {
    const posA = a.state.classPosition || a.state.position || 999;
    const posB = b.state.classPosition || b.state.position || 999;
    return posA - posB;
  });

  const playerLastLap = telemetryData.get(playerCarIdx)?.lastLapRaw || 0;

  // Identificar si es carrera para el cálculo de Gaps
  const isRace = window.sessionType
    ? window.sessionType.toLowerCase().includes("race")
    : true;

  // Extraer el tiempo absoluto del líder basándonos en los datos consolidados oficiales
  let leaderBestLap = -1;
  if (!isRace && driversList.length > 0) {
    let bestTimes = driversList
      .map((d) => d.state.bestLapRaw)
      .filter((t) => t && t > 0);
    if (bestTimes.length > 0) {
      leaderBestLap = Math.min(...bestTimes);
    }
  }

  if (!window.hasLoggedSessionData) {
    console.log("=== DATOS DE SESIÓN ===");
    console.log("SessionNum:", window.currentSessionNum);
    console.log("SessionType:", window.sessionType);
    console.log("isRace detectado:", isRace);
    console.log("leaderBestLap detectado:", leaderBestLap);
    window.hasLoggedSessionData = true;
  }

  driversList.forEach((entry, index) => {
    const { info, state, carIdx } = entry;
    const isPlayer = carIdx === playerCarIdx;

    // License Class Extraction
    const licClass = getLicenseClass(info.LicString);

    // Gap & Interval Formatting
    let gapStr = "-";
    let intStr = "-";

    if (isRace) {
      // Lógica de Carrera: gap y estTime (distancia real en pista)
      gapStr = index === 0 ? "Leader" : formatTime(state.gap);
      intStr = state.interval > 0 ? formatTime(state.interval) : "-";
    } else {
      // Lógica de Práctica/Clasificación: diferencia de mejor vuelta respecto al líder
      if (state.bestLapRaw > 0 && leaderBestLap > 0) {
        if (state.bestLapRaw === leaderBestLap) {
          gapStr = "Top";
        } else {
          const diff = state.bestLapRaw - leaderBestLap;
          gapStr = `+${diff.toFixed(3)}`;
        }

        // Intervalo respecto al piloto directamente arriba en la tabla
        if (index > 0) {
          const prevDriverBestLap = driversList[index - 1].state.bestLapRaw;
          if (prevDriverBestLap > 0) {
            const intDiff = state.bestLapRaw - prevDriverBestLap;
            intStr = `+${intDiff.toFixed(3)}`;
          }
        }
      }
    }

    // Last Lap
    let lastLapStr = formatTime(state.lastLapRaw);

    // Best Lap
    let bestStr = formatTime(state.bestLapRaw);

    // Pit Status (Stopwatch)
    let pitStr = "";
    if (state.onPitRoad) {
      const timer = pitTimers.get(carIdx);
      if (timer) {
        const elapsedSeconds = (Date.now() - timer.startTime) / 1000;
        pitStr = `<span class="in-pit">${elapsedSeconds.toFixed(1)}s</span>`;
      } else {
        pitStr = '<span class="in-pit">PIT</span>';
      }
    }

    // Tires handling
    let tireStr = "-";
    if (typeof state.tire === "string") tireStr = state.tire;
    else if (state.tire.compound) tireStr = state.tire.compound;

    html += `
            <tr class="${isPlayer ? "is-player" : ""}">
                <td class="col-pos">${state.classPosition}</td>
                <td class="col-car"><span class="car-number">${
                  info.CarNumber
                }</span></td>
                <td class="col-logo">${info.CarShortName}</td>
                <td class="col-flag">${info.FlairName}</td>
                <td class="col-name"><span class="license-badge license-${licClass}">${getLicenseStr(
      info.LicString
    )}</span> ${info.UserName}</td>
                <td class="col-ir">${info.IRating || 0}</td>
                <td class="col-gap">${gapStr}</td>
                <td class="col-int">${intStr}</td>
                <td class="col-last">${lastLapStr}</td>
                <td class="col-best">${bestStr}</td>
                <td class="col-tire">${tireStr}</td>
                <td class="col-pit pit-status">${pitStr}</td>
            </tr>
        `;
  });

  if (!window.hasLoggedHtmlGenerated && html.length > 0) {
    console.log(
      "HTML generado primera fila de ejemplo:",
      html.substring(0, 200) + "..."
    );
    window.hasLoggedHtmlGenerated = true;
  }

  // Update DOM, requestAnimationFrame is useful to avoid blocking, though innerHTML is fast enough for ~60 rows
  window.requestAnimationFrame(() => {
    tbody.innerHTML = html;
    if (!window.hasLoggedDOMUpdate) {
      console.log(
        "DOM actualizado. Nodos hijos del tbody:",
        tbody.childElementCount
      );
      window.hasLoggedDOMUpdate = true;
    }
  });
}

// Helpers
function formatTime(seconds) {
  if (!seconds || seconds <= 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  // Extraemos exactamente 3 decimales (.XXX) y rellenamos los ceros con padEnd por si es redondo
  const msStr = (seconds % 1).toFixed(3).substring(2);

  if (m > 0) {
    return `${m}:${s.toString().padStart(2, "0")}.${msStr}`;
  }
  return `${s}.${msStr}`;
}

function getLicenseClass(licString) {
  if (!licString) return "R";
  const char = licString.charAt(0).toUpperCase();
  if (["R", "D", "C", "B", "A", "P"].includes(char)) return char;
  return "R";
}

function getLicenseStr(licString) {
  if (!licString) return "R";
  // Returns full string e.g. "A 4.99" if we only have standard formatting
  return licString;
}
