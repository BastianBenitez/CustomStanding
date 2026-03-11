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
    "CarIdxF2Time",
    "CarIdxEstTime",
    "CarIdxTireCompound",
    "CarIdxOnPitRoad",
    "PlayerCarInPitStall",
    "PlayerTireCompound",
  ];

  const varsEstaticas = ["DriverInfo", "SessionInfo"];

  // IMPORTANTE: Pasamos los parámetros DIRECTO al constructor
  // new IRacing(dinamicas, estaticas, fps)
  const iracing = new IRacing(varsDinamicas, varsEstaticas, 10); // 10 FPS para fluidez en pits y gaps

  iracing.onConnect = () => console.log("✅ Conectado a Kapps");

  iracing.onUpdate = function () {
    // En ir.coffee, 'this' dentro de onUpdate es la instancia de IRacing
    // y los datos están en this.data
    processUpdate(this.data);
  };
}

function processUpdate(data) {
  let tableNeedsUpdate = false;

  if (data.SessionNum !== undefined) {
    if (window.currentSessionNum !== data.SessionNum) {
      window.currentSessionNum = data.SessionNum;
      totalLapsCache = -1; // Resetear caché al cambiar de sesión
      tableNeedsUpdate = true;
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
                lapsCompleted: 0
              });
              tableNeedsUpdate = true;
            }
            
            if (carIdx >= 0) {
              const state = telemetryData.get(carIdx);
              
              const didCrossFinishLine = res.LapsComplete > state.lapsCompleted;

              // Actualizamos posiciones oficiales desde SessionInfo
              state.position = res.Position;
              state.classPosition = res.ClassPosition;
              
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

          // Solo detonamos actualización real del DOM si hubieron nuevas vueltas procesadas. 
          // O si es la primera vez (totalLapsCache == -1)
          if (sumOfLaps > totalLapsCache || totalLapsCache === -1) {
            totalLapsCache = sumOfLaps;
            tableNeedsUpdate = true;
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
      tableNeedsUpdate = true;
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
          lapsCompleted: 0
        });
        tableNeedsUpdate = true;
      }
    });
  }

  // 2. PROCESAR TELEMETRÍA (Deltas, Pits, Llantas)
  // Nota: Ya no extraemos CarIdxClassPosition de aquí porque ahora usamos SessionInfo
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

          // Lógica de cronómetro de Pits (esta info si queremos actualizarla fluido)
          if (field === "onPitRoad") {
            if (val && !state.onPitRoad) {
              pitTimers.set(i, { startTime: Date.now() });
              tableNeedsUpdate = true;
            } else if (!val && state.onPitRoad) {
              pitTimers.delete(i);
              tableNeedsUpdate = true;
            }
            state[field] = val;
          } else if (field === "tire") {
            let nTire = "-";
            if (val && val !== -1) {
              nTire = typeof val === "object" ? val.compound : val;
            }
            if (state.tire !== nTire) {
               state.tire = nTire;
               tableNeedsUpdate = true;
            }
          } else {
             // Si quieres ver distancias o GAPS (CarIdxF2Time) moviendose SUAVEMENTE (flujo de 10fps),
             // Descomenta la siguiente línea para forzar actualización constante solo de lapsos.
             
             // tableNeedsUpdate = true; 
             
            state[field] = val;
          }
        }
      });
    }
  }

  // El cronómetro de PitLane es algo que SÍ necesita refrescarse constantemente
  if (pitTimers.size > 0) {
      tableNeedsUpdate = true; 
  }

  // Solo redibujar la tabla si hubieron cambios en las posiciones (cruce de meta), un auto entró/salió de pits,
  // cambio neumático, cambio sesión o ingresó un jugador nuevo.
  if (tableNeedsUpdate) {
    renderTable();
  }
}

function renderTable() {
  const tbody = document.getElementById("standing-tbody");
  if (!tbody) return;

  let html = "";

  // Solo array de pilotos reconocidos activamente
  const driversList = [];
  driverData.forEach((info, carIdx) => {
    const state = telemetryData.get(carIdx);
    // Validamos que exista estado y que tenga una posición asignada por SessionInfo
    if (state && typeof state.position === "number" && state.position > 0) {
      driversList.push({ info, state, carIdx });
    }
  });

  // Ordenar estricta y únicamente por Position oficial de SessionInfo
  driversList.sort((a, b) => a.state.position - b.state.position);

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

    // Delta calculation relative to player
    let deltaStr = "";
    if (!isPlayer && playerLastLap > 0 && state.lastLapRaw > 0) {
      const delta = state.lastLapRaw - playerLastLap;
      const color = delta < 0 ? "#00ff00" : "#ff0000"; // Verde si es más rápido que tú
      deltaStr = `<span style="color:${color}">${
        delta > 0 ? "+" : ""
      }${delta.toFixed(3)}</span>`;
    }

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
                <td class="col-delta">${deltaStr}</td>
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
