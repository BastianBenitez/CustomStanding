// app.js

// Variables de estado
const driverData = new Map();
const telemetryData = new Map();
let playerCarIdx = -1;
const pitTimers = new Map();
let weatherState = {
  trackWetness: 0,
  precipitation: 0,
  weatherDeclaredWet: false,
};
let camCarIdx = -1;
const IRATING_C = 1600 / Math.log(2);
const irsdkVarsToLog = [
  "SessionTime",
  "SessionTick",
  "SessionNum",
  "SessionState",
  "SessionUniqueID",
  "SessionFlags",
  "SessionTimeRemain",
  "SessionLapsRemain",
  "SessionLapsRemainEx",
  "SessionTimeTotal",
  "SessionLapsTotal",
  "SessionJokerLapsRemain",
  "SessionOnJokerLap",
  "SessionTimeOfDay",
  "RadioTransmitCarIdx",
  "RadioTransmitRadioIdx",
  "RadioTransmitFrequencyIdx",
  "DisplayUnits",
  "DriverMarker",
  "PushToTalk",
  "PushToPass",
  "ManualBoost",
  "ManualNoBoost",
  "IsOnTrack",
  "IsReplayPlaying",
  "ReplayFrameNum",
  "ReplayFrameNumEnd",
  "IsDiskLoggingEnabled",
  "IsDiskLoggingActive",
  "FrameRate",
  "CpuUsageFG",
  "GpuUsage",
  "ChanAvgLatency",
  "ChanLatency",
  "ChanQuality",
  "ChanPartnerQuality",
  "CpuUsageBG",
  "ChanClockSkew",
  "MemPageFaultSec",
  "MemSoftPageFaultSec",
  "PlayerCarPosition",
  "PlayerCarClassPosition",
  "PlayerCarClass",
  "PlayerTrackSurface",
  "PlayerTrackSurfaceMaterial",
  "PlayerCarIdx",
  "PlayerCarTeamIncidentCount",
  "PlayerCarMyIncidentCount",
  "PlayerCarDriverIncidentCount",
  "PlayerCarWeightPenalty",
  "PlayerCarPowerAdjust",
  "PlayerCarDryTireSetLimit",
  "PlayerCarTowTime",
  "PlayerCarInPitStall",
  "PlayerCarPitSvStatus",
  "PlayerTireCompound",
  "PlayerFastRepairsUsed",
  "CarIdxLap",
  "CarIdxLapCompleted",
  "CarIdxLapDistPct",
  "CarIdxTrackSurface",
  "CarIdxTrackSurfaceMaterial",
  "CarIdxOnPitRoad",
  "CarIdxPosition",
  "CarIdxClassPosition",
  "CarIdxClass",
  "CarIdxF2Time",
  "CarIdxEstTime",
  "CarIdxLastLapTime",
  "CarIdxBestLapTime",
  "CarIdxBestLapNum",
  "CarIdxTireCompound",
  "CarIdxQualTireCompound",
  "CarIdxQualTireCompoundLocked",
  "CarIdxFastRepairsUsed",
  "CarIdxSessionFlags",
  "PaceMode",
  "CarIdxPaceLine",
  "CarIdxPaceRow",
  "CarIdxPaceFlags",
  "OnPitRoad",
  "CarIdxSteer",
  "CarIdxRPM",
  "CarIdxGear",
  "SteeringWheelAngle",
  "Throttle",
  "Brake",
  "Clutch",
  "Gear",
  "RPM",
  "PlayerCarSLFirstRPM",
  "PlayerCarSLShiftRPM",
  "PlayerCarSLLastRPM",
  "PlayerCarSLBlinkRPM",
  "Lap",
  "LapCompleted",
  "LapDist",
  "LapDistPct",
  "RaceLaps",
  "CarDistAhead",
  "CarDistBehind",
  "LapBestLap",
  "LapBestLapTime",
  "LapLastLapTime",
  "LapCurrentLapTime",
  "LapLasNLapSeq",
  "LapLastNLapTime",
  "LapBestNLapLap",
  "LapBestNLapTime",
  "LapDeltaToBestLap",
  "LapDeltaToBestLap_DD",
  "LapDeltaToBestLap_OK",
  "LapDeltaToOptimalLap",
  "LapDeltaToOptimalLap_DD",
  "LapDeltaToOptimalLap_OK",
  "LapDeltaToSessionBestLap",
  "LapDeltaToSessionBestLap_DD",
  "LapDeltaToSessionBestLap_OK",
  "LapDeltaToSessionOptimalLap",
  "LapDeltaToSessionOptimalLap_DD",
  "LapDeltaToSessionOptimalLap_OK",
  "LapDeltaToSessionLastlLap",
  "LapDeltaToSessionLastlLap_DD",
  "LapDeltaToSessionLastlLap_OK",
  "Speed",
  "Yaw",
  "YawNorth",
  "Pitch",
  "Roll",
  "EnterExitReset",
  "TrackTemp",
  "TrackTempCrew",
  "AirTemp",
  "TrackWetness",
  "Skies",
  "AirDensity",
  "AirPressure",
  "WindVel",
  "WindDir",
  "RelativeHumidity",
  "FogLevel",
  "Precipitation",
  "SolarAltitude",
  "SolarAzimuth",
  "WeatherDeclaredWet",
  "SteeringFFBEnabled",
  "DCLapStatus",
  "DCDriversSoFar",
  "OkToReloadTextures",
  "LoadNumTextures",
  "CarLeftRight",
  "PitsOpen",
  "VidCapEnabled",
  "VidCapActive",
  "PlayerIncidents",
  "PitRepairLeft",
  "PitOptRepairLeft",
  "PitstopActive",
  "FastRepairUsed",
  "FastRepairAvailable",
  "LFTiresUsed",
  "RFTiresUsed",
  "LRTiresUsed",
  "RRTiresUsed",
  "LeftTireSetsUsed",
  "RightTireSetsUsed",
  "FrontTireSetsUsed",
  "RearTireSetsUsed",
  "TireSetsUsed",
  "LFTiresAvailable",
  "RFTiresAvailable",
  "LRTiresAvailable",
  "RRTiresAvailable",
  "LeftTireSetsAvailable",
  "RightTireSetsAvailable",
  "FrontTireSetsAvailable",
  "RearTireSetsAvailable",
  "TireSetsAvailable",
  "CamCarIdx",
  "CamCameraNumber",
  "CamGroupNumber",
  "CamCameraState",
  "IsOnTrackCar",
  "IsInGarage",
  "SteeringWheelAngleMax",
  "ShiftPowerPct",
  "ShiftGrindRPM",
  "ThrottleRaw",
  "BrakeRaw",
  "ClutchRaw",
  "HandbrakeRaw",
  "BrakeABSactive",
  "Shifter",
  "EngineWarnings",
  "FuelLevelPct",
  "PitSvFlags",
  "PitSvLFP",
  "PitSvRFP",
  "PitSvLRP",
  "PitSvRRP",
  "PitSvFuel",
  "PitSvTireCompound",
  "CarIdxP2P_Status",
  "CarIdxP2P_Count",
  "P2P_Status",
  "P2P_Count",
  "SteeringWheelPctTorque",
  "SteeringWheelPctTorqueSign",
  "SteeringWheelPctTorqueSignStops",
  "SteeringWheelPctIntensity",
  "SteeringWheelPctSmoothing",
  "SteeringWheelPctDamper",
  "SteeringWheelLimiter",
  "SteeringWheelMaxForceNm",
  "SteeringWheelPeakForceNm",
  "SteeringWheelUseLinear",
  "ShiftIndicatorPct",
  "ReplayPlaySpeed",
  "ReplayPlaySlowMotion",
  "ReplaySessionTime",
  "ReplaySessionNum",
  "TireLF_RumblePitch",
  "TireRF_RumblePitch",
  "TireLR_RumblePitch",
  "TireRR_RumblePitch",
  "IsGarageVisible",
  "SteeringWheelTorque_ST",
  "SteeringWheelTorque",
  "VelocityZ_ST",
  "VelocityY_ST",
  "VelocityX_ST",
  "VelocityZ",
  "VelocityY",
  "VelocityX",
  "YawRate_ST",
  "PitchRate_ST",
  "RollRate_ST",
  "YawRate",
  "PitchRate",
  "RollRate",
  "VertAccel_ST",
  "LatAccel_ST",
  "LongAccel_ST",
  "VertAccel",
  "LatAccel",
  "LongAccel",
  "dcStarter",
  "dcPitSpeedLimiterToggle",
  "dcTractionControlToggle",
  "dcHeadlightFlash",
  "dpRFTireChange",
  "dpLFTireChange",
  "dpRRTireChange",
  "dpLRTireChange",
  "dpFuelFill",
  "dpFuelAutoFillEnabled",
  "dpFuelAutoFillActive",
  "dpWindshieldTearoff",
  "dpFuelAddKg",
  "dpFastRepair",
  "dcBrakeBias",
  "dpLFTireColdPress",
  "dpRFTireColdPress",
  "dpLRTireColdPress",
  "dpRRTireColdPress",
  "dcTractionControl",
  "dcABS",
  "dcToggleWindshieldWipers",
  "dcTriggerWindshieldWipers",
  "FuelUsePerHour",
  "Voltage",
  "WaterTemp",
  "WaterLevel",
  "FuelPress",
  "OilTemp",
  "OilPress",
  "OilLevel",
  "ManifoldPress",
  "FuelLevel",
  "Engine0_RPM",
  "RFbrakeLinePress",
  "RFcoldPressure",
  "RFodometer",
  "RFtempCL",
  "RFtempCM",
  "RFtempCR",
  "RFwearL",
  "RFwearM",
  "RFwearR",
  "LFbrakeLinePress",
  "LFcoldPressure",
  "LFodometer",
  "LFtempCL",
  "LFtempCM",
  "LFtempCR",
  "LFwearL",
  "LFwearM",
  "LFwearR",
  "RRbrakeLinePress",
  "RRcoldPressure",
  "RRodometer",
  "RRtempCL",
  "RRtempCM",
  "RRtempCR",
  "RRwearL",
  "RRwearM",
  "RRwearR",
  "LRbrakeLinePress",
  "LRcoldPressure",
  "LRodometer",
  "LRtempCL",
  "LRtempCM",
  "LRtempCR",
  "LRwearL",
  "LRwearM",
  "LRwearR",
  "LRshockDefl",
  "LRshockDefl_ST",
  "LRshockVel",
  "LRshockVel_ST",
  "RRshockDefl",
  "RRshockDefl_ST",
  "RRshockVel",
  "RRshockVel_ST",
  "LFshockDefl",
  "LFshockDefl_ST",
  "LFshockVel",
  "LFshockVel_ST",
  "RFshockDefl",
  "RFshockDefl_ST",
  "RFshockVel",
  "RFshockVel_ST",
];
const IRSDK_LOG_INTERVAL_MS = 1000;
let lastIrsdkLogTs = 0;

// Diccionario de países a códigos ISO (2 letras) para flag-icons
// Incluye una lista exhaustiva de prácticamente todos los países y clubes de iRacing
const countryToIso = {
  "Afghanistan": "af", "Albania": "al", "Algeria": "dz", "Andorra": "ad", "Angola": "ao",
  "Antarctica": "aq", "Antigua and Barbuda": "ag", "Argentina": "ar", "Armenia": "am", "Australia": "au",
  "Austria": "at", "Azerbaijan": "az", "Bahamas": "bs", "Bahrain": "bh", "Bangladesh": "bd",
  "Barbados": "bb", "Belarus": "by", "Belgium": "be", "Belize": "bz", "Benin": "bj", "Bhutan": "bt",
  "Bolivia": "bo", "Bosnia and Herzegovina": "ba", "Botswana": "bw", "Brazil": "br", "Brunei": "bn",
  "Bulgaria": "bg", "Burkina Faso": "bf", "Burundi": "bi", "Cabo Verde": "cv", "Cambodia": "kh",
  "Cameroon": "cm", "Canada": "ca", "Central African Republic": "cf", "Central Europe": "eu",
  "Chad": "td", "Chile": "cl", "China": "cn", "Colombia": "co", "Comoros": "km", "Congo": "cg",
  "Costa Rica": "cr", "Croatia": "hr", "Cuba": "cu", "Cyprus": "cy", "Czech Republic": "cz",
  "Denmark": "dk", "Djibouti": "dj", "Dominica": "dm", "Dominican Republic": "do", "Ecuador": "ec",
  "Egypt": "eg", "El Salvador": "sv", "Equatorial Guinea": "gq", "Eritrea": "er", "Estonia": "ee",
  "Eswatini": "sz", "Ethiopia": "et", "Fiji": "fj", "Finland": "fi", "France": "fr", "Gabon": "ga",
  "Gambia": "gm", "Georgia": "ge", "Germany": "de", "Ghana": "gh", "Greece": "gr", "Grenada": "gd",
  "Guam": "gu", "Guatemala": "gt", "Guinea": "gn", "Guinea-Bissau": "gw", "Guyana": "gy",
  "Haiti": "ht", "Honduras": "hn", "Hong Kong": "hk", "Hungary": "hu", "Iceland": "is", "India": "in",
  "Indonesia": "id", "International": "un", "Iran": "ir", "Iraq": "iq", "Ireland": "ie", "Israel": "il",
  "Italy": "it", "Ivory Coast": "ci", "Jamaica": "jm", "Japan": "jp", "Jordan": "jo", "Kazakhstan": "kz",
  "Kenya": "ke", "Kiribati": "ki", "Kuwait": "kw", "Kyrgyzstan": "kg", "Laos": "la", "Latvia": "lv",
  "Lebanon": "lb", "Lesotho": "ls", "Liberia": "lr", "Libya": "ly", "Liechtenstein": "li",
  "Lithuania": "lt", "Luxembourg": "lu", "Macau": "mo", "Macedonia": "mk", "Madagascar": "mg",
  "Malawi": "mw", "Malaysia": "my", "Maldives": "mv", "Mali": "ml", "Malta": "mt", "Marshall Islands": "mh",
  "Mauritania": "mr", "Mauritius": "mu", "Mexico": "mx", "Micronesia": "fm", "Moldova": "md",
  "Monaco": "mc", "Mongolia": "mn", "Montenegro": "me", "Morocco": "ma", "Mozambique": "mz",
  "Myanmar": "mm", "Namibia": "na", "Nauru": "nr", "Nepal": "np", "Netherlands": "nl", "New Zealand": "nz",
  "Nicaragua": "ni", "Niger": "ne", "Nigeria": "ng", "North Korea": "kp", "Norway": "no", "Oman": "om",
  "Pakistan": "pk", "Palau": "pw", "Palestine": "ps", "Panama": "pa", "Papua New Guinea": "pg",
  "Paraguay": "py", "Peru": "pe", "Philippines": "ph", "Poland": "pl", "Portugal": "pt",
  "Puerto Rico": "pr", "Qatar": "qa", "Romania": "ro", "Russia": "ru", "Rwanda": "rw",
  "Saint Kitts and Nevis": "kn", "Saint Lucia": "lc", "Saint Vincent and the Grenadines": "vc",
  "Samoa": "ws", "San Marino": "sm", "Sao Tome and Principe": "st", "Saudi Arabia": "sa",
  "Senegal": "sn", "Serbia": "rs", "Seychelles": "sc", "Sierra Leone": "sl", "Singapore": "sg",
  "Slovakia": "sk", "Slovenia": "si", "Solomon Islands": "sb", "Somalia": "so", "South Africa": "za",
  "South Korea": "kr", "South Sudan": "ss", "Spain": "es", "Sri Lanka": "lk", "Sudan": "sd",
  "Suriname": "sr", "Sweden": "se", "Switzerland": "ch", "Syria": "sy", "Taiwan": "tw",
  "Tajikistan": "tj", "Tanzania": "tz", "Thailand": "th", "Timor-Leste": "tl", "Togo": "tg",
  "Tonga": "to", "Trinidad and Tobago": "tt", "Tunisia": "tn", "Turkey": "tr", "Türkiye": "tr", "Turkmenistan": "tm",
  "Tuvalu": "tv", "UK and I": "gb", "Uganda": "ug", "Ukraine": "ua", "United Arab Emirates": "ae",
  "United Kingdom": "gb", "United States": "us", "Uruguay": "uy", "Uzbekistan": "uz", "Vanuatu": "vu",
  "Vatican City": "va", "Venezuela": "ve", "Vietnam": "vn", "Yemen": "ye", "Zambia": "zm", "Zimbabwe": "zw"
};

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
  const varsDinamicas = [...irsdkVarsToLog, "SessionInfo"];

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
  if (data.TrackWetness !== undefined) {
    weatherState.trackWetness = data.TrackWetness;
  }
  if (data.Precipitation !== undefined) {
    weatherState.precipitation = data.Precipitation;
  }
  if (data.WeatherDeclaredWet !== undefined) {
    weatherState.weatherDeclaredWet = data.WeatherDeclaredWet;
  }
  if (data.CamCarIdx !== undefined) {
    camCarIdx = data.CamCarIdx;
  }

  const now = Date.now();
  if (now - lastIrsdkLogTs >= IRSDK_LOG_INTERVAL_MS) {
    const snapshot = {};
    irsdkVarsToLog.forEach((name) => {
      snapshot[name] = data[name] !== undefined ? data[name] : null;
    });
    console.log("[IRSDK] Variables:", snapshot);
    lastIrsdkLogTs = now;
  }

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
              // Pero confiaremos más en CarIdxClassPosition dinámico cuando exista.
              state.position = res.Position;
              if (res.ClassPosition !== undefined && res.ClassPosition > 0) {
                state.classPosition = res.ClassPosition;
              } else if (res.Position > 0 && (!state.classPosition || state.classPosition === 0)) {
                state.classPosition = res.Position;
              }

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

        // Guardar parrilla de clasificación si es sesión NO race
        const isRaceSess = window.sessionType
          ? window.sessionType.toLowerCase().includes("race")
          : false;
        if (!isRaceSess && currentSession.ResultsPositions) {
          if (!window.qualifyingGrid) window.qualifyingGrid = new Map();
          currentSession.ResultsPositions.forEach((res) => {
            if (res.CarIdx >= 0) {
              window.qualifyingGrid.set(res.CarIdx, {
                position: res.Position,
                classPosition: res.ClassPosition || res.Position,
              });
            }
          });
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
    CarIdxClass: "classId",
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
              let pitLap = (state.lapsCompleted || 0) + 1;
              if (data.CarIdxLap && data.CarIdxLap[i] > 0) {
                pitLap = data.CarIdxLap[i];
              }
              pitTimers.set(i, { startTime: Date.now(), lap: pitLap });
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

  // Track last 3 lap times from telemetry
  if (data.CarIdxLastLapTime) {
    data.CarIdxLastLapTime.forEach((val, i) => {
      if (telemetryData.has(i) && val > 0) {
        const state = telemetryData.get(i);
        if (Math.abs(val - state.lastLapRaw) > 0.001) {
          state.lastLapHistory.push(val);
          if (state.lastLapHistory.length > 3) state.lastLapHistory.shift();
          state.lastLapRaw = val;
        }
      }
    });
  }

  // Detectar inicio de carrera (primer cruce de meta)
  if (data.CarIdxLapCompleted && window.sessionType
    ? window.sessionType.toLowerCase().includes("race")
    : false) {
    const anyLapCompleted = data.CarIdxLapCompleted.some((l) => l > 0);
    if (anyLapCompleted && !window.raceHasStarted) {
      console.log("[RACE] Cruce de meta detectado, cambiando a posiciones en vivo");
    }
    if (anyLapCompleted) window.raceHasStarted = true;
  }

  // Redibujado forzado incondicional a 10 Hz para reflejar de inmediato
  // cualquier fluctuación en Posición, Vueltas, o Gaps.
  renderTable();
}

function computeIRatingDeltas(allDrivers) {
  const N = allDrivers.length;
  if (N < 2) return new Map();

  const expNeg = [];
  for (let i = 0; i < N; i++) {
    expNeg.push(Math.exp(-allDrivers[i].info.IRating / IRATING_C));
  }

  const E = [];
  for (let i = 0; i < N; i++) {
    E[i] = [];
    const a = expNeg[i];
    const oneMinusA = 1 - a;
    for (let j = 0; j < N; j++) {
      if (i === j) {
        E[i][j] = 0;
        continue;
      }
      const b = expNeg[j];
      const oneMinusB = 1 - b;
      E[i][j] = (oneMinusA * b) / (oneMinusB * a + oneMinusA * b);
    }
  }

  const result = new Map();
  for (let i = 0; i < N; i++) {
    let expectedScore = 0;
    for (let j = 0; j < N; j++) {
      if (i !== j) expectedScore += E[i][j];
    }
    expectedScore -= 0.5;

    const pos = i + 1;
    const fudgeFactor = ((N / 2) - pos) / 100;
    const delta = (N - pos - expectedScore - fudgeFactor) * 200 / N - 5;
    result.set(allDrivers[i].carIdx, Math.round(delta));
  }

  return result;
}

function renderTable() {
  const tbody = document.getElementById("standing-tbody");
  if (!tbody) return;

  let html = "";

  // Solo array de pilotos reconocidos activamente
  let driversList = [];
  driverData.forEach((info, carIdx) => {
    const state = telemetryData.get(carIdx);
    // Validamos que exista estado y que tenga una posición oficial válida (> 0)
    if (state && (state.classPosition > 0 || state.position > 0)) {
      driversList.push({ info, state, carIdx });
    }
  });

  // Fallback: si no hay posiciones válidas aún, mostramos todos los pilotos
  if (driversList.length === 0) {
    driverData.forEach((info, carIdx) => {
      const state = telemetryData.get(carIdx);
      if (state) driversList.push({ info, state, carIdx });
    });
  }

  // Filtrar por clase (multi-clase): solo mostrar autos de la misma clase que el auto foco
  const focusCarIdx = camCarIdx >= 0 ? camCarIdx : playerCarIdx;
  const focusClassId = telemetryData.get(focusCarIdx)?.classId;
  if (focusClassId !== undefined && focusClassId !== null && focusClassId > 0) {
    const filtered = driversList.filter(
      (d) => d.state.classId === focusClassId
    );
    if (filtered.length > 0) driversList = filtered;
  }

  // Identificar si es carrera para el cálculo de Gaps
  const isRace = window.sessionType
    ? window.sessionType.toLowerCase().includes("race")
    : true;

  // Determinar si mostrar posiciones de parrilla (carrera sin cruces aún)
  const raceHasStarted = window.raceHasStarted || false;
  const qualifyingGrid = window.qualifyingGrid || null;
  const useQualifyingGrid = isRace && !raceHasStarted && qualifyingGrid && qualifyingGrid.size > 0;

  // RESTAURADO EL SORT DINÁMICO
  // Ordenar primero por ClassPosition entregada por telemetría.
  // Es la que se actualiza más rápido. Si es 0 (no calculada aún), mandamos al fondo.
  driversList.sort((a, b) => {
    let posA, posB;
    if (useQualifyingGrid) {
      posA = qualifyingGrid.get(a.carIdx)?.classPosition || a.state.classPosition || a.state.position || a.carIdx || 999;
      posB = qualifyingGrid.get(b.carIdx)?.classPosition || b.state.classPosition || b.state.position || b.carIdx || 999;
    } else {
      posA = a.state.classPosition || a.state.position || a.carIdx || 999;
      posB = b.state.classPosition || b.state.position || b.carIdx || 999;
    }
    return posA - posB;
  });

  // Precomputar deltas de iRating
  const iratingDeltas = computeIRatingDeltas(driversList);

  const playerLastLap = telemetryData.get(playerCarIdx)?.lastLapRaw || 0;

  const focusLastLap = telemetryData.get(focusCarIdx)?.lastLapRaw || -1;

  const isWetSession =
    weatherState.weatherDeclaredWet ||
    weatherState.trackWetness > 0 ||
    weatherState.precipitation > 0;

  // Extraer la mejor vuelta del líder para detectar vueltas perdidas
  let leaderBestLap = -1;
  if (driversList.length > 0) {
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

  const visibleSelection = selectVisibleDrivers(driversList, focusCarIdx);
  const visibleDrivers = visibleSelection.items;
  const showSeparator = visibleSelection.showSeparator;
  const separatorIndex = visibleSelection.separatorIndex;

  visibleDrivers.forEach((item, index) => {
    const { entry, index: originalIndex } = item;
    const { info, state, carIdx } = entry;
    const isPlayer = carIdx === playerCarIdx;
    const isFocus = carIdx === (camCarIdx >= 0 ? camCarIdx : playerCarIdx);

    // License Class Extraction
    const licClass = getLicenseClass(info.LicString);

    // Gap & Interval Formatting
    let gapStr = "-";
    let intStr = "-";

    if (isRace) {
      // Lógica de Carrera: gap y diferencia con el auto al frente
      gapStr = originalIndex === 0 ? "Leader" : formatGapTime(state.gap, leaderBestLap);
      if (originalIndex === 0) {
        intStr = "-";
      } else {
        const prevGap = driversList[originalIndex - 1].state.gap;
        const deltaToFront = state.gap - prevGap;
        intStr = deltaToFront > 0 ? formatGapTime(deltaToFront, leaderBestLap) : "-";
      }
    } else {
      // Lógica de Práctica/Clasificación: diferencia de mejor vuelta respecto al líder
      if (state.bestLapRaw > 0 && leaderBestLap > 0) {
        if (state.bestLapRaw === leaderBestLap) {
          gapStr = "Top";
        } else {
          const diff = state.bestLapRaw - leaderBestLap;
          gapStr = formatGapTime(diff, leaderBestLap, true);
        }

        // Intervalo respecto al piloto directamente arriba en la tabla
        if (originalIndex > 0) {
          const prevDriverBestLap =
            driversList[originalIndex - 1].state.bestLapRaw;
          if (prevDriverBestLap > 0) {
            const intDiff = state.bestLapRaw - prevDriverBestLap;
            intStr = intDiff > 0 ? formatGapTime(intDiff, leaderBestLap, true) : "-";
          }
        }
      }
    }

    // Last Lap
    let lastLapStr = formatTime(state.lastLapRaw);

    // Laps gap to focus car (3 individual lap values with color)
    let gapFocusStr = "-";
    let gapFocusClass = "";
    const focusState = telemetryData.get(focusCarIdx);
    const focusHistory = focusState?.lastLapHistory || [];
    const driverHistory = state.lastLapHistory || [];
    const lapsCount = Math.min(3, focusHistory.length, driverHistory.length);
    if (lapsCount > 0) {
      const chunks = [];
      for (let i = 0; i < lapsCount; i++) {
        const fTime = focusHistory[focusHistory.length - lapsCount + i];
        const dTime = driverHistory[driverHistory.length - lapsCount + i];
        const diff = dTime - fTime;
        const val = Math.abs(diff).toFixed(1);
        let cls = "";
        if (diff < 0) cls = "gap-focus-up";
        else if (diff > 0) cls = "gap-focus-down";
        chunks.push(`<span class="${cls}">${val}</span>`);
      }
      gapFocusStr = chunks.join(' ');
    }

    // Best Lap
    let bestStr = formatTime(state.bestLapRaw);

    // Pit Status
    let pitStr = "";
    if (state.onPitRoad) {
      const timer = pitTimers.get(carIdx);
      if (timer) {
        const elapsedSeconds = (Date.now() - timer.startTime) / 1000;
        const lapStr = `L${timer.lap}`;
        pitStr = `<span class="in-pit">${lapStr} ${formatPitTime(elapsedSeconds)}</span>`;
      } else {
        pitStr = '<span class="in-pit">PIT</span>';
      }
    }

    // Tires handling
    let tireStr = "DRY";
    if (state.tire === -1 || state.tire === "-") {
      tireStr = "-";
    } else if (typeof state.tire === "number") {
      if (state.tire === 1) tireStr = "WET";
    } else if (typeof state.tire === "string") {
      const t = state.tire.toLowerCase();
      if (t.includes("wet") || t.includes("rain") || t === "w") tireStr = "WET";
    } else if (state.tire && state.tire.compound) {
      const c = String(state.tire.compound).toLowerCase();
      if (c.includes("wet") || c.includes("rain") || c === "w") tireStr = "WET";
    }

    // Flag handling
    const isoCode = countryToIso[info.FlairName] || "xx";
    const flagHtml = `<span class="fi fi-${isoCode.toLowerCase()}" title="${info.FlairName}"></span>`;

    const posStr = useQualifyingGrid
      ? qualifyingGrid.get(carIdx)?.classPosition || state.classPosition || state.position || "-"
      : state.classPosition || state.position || "-";

    const carBrand = info.CarShortName
      ? String(info.CarShortName).trim().split(/\s+/)[0]
      : "car";

    const iratingStr = formatIRating(info.IRating || 0);

    const delta = iratingDeltas.get(carIdx) || 0;
    let deltaHtml = "";
    if (delta > 0) {
      deltaHtml = `<span class="ir-delta ir-gain">▲+${delta}</span>`;
    } else if (delta < 0) {
      deltaHtml = `<span class="ir-delta ir-loss">▼${delta}</span>`;
    }

    if (showSeparator && originalIndex === separatorIndex) {
      html += `
            <tr class="row-separator">
                <td colspan="12"></td>
            </tr>
        `;
    }

    html += `
            <tr class="${isPlayer ? "is-player" : ""} ${
      isFocus ? "is-focus" : ""
    }">
                <td class="col-pos">${posStr}</td>
                <td class="col-car"><span class="car-number">${
                  info.CarNumber
                }</span></td>
                <td class="col-logo">${carBrand}</td>
                <td class="col-name"><span class="license-badge license-${licClass}">${getLicenseStr(
      info.LicString
    )}</span> ${flagHtml} ${info.UserName}</td>
                <td class="col-ir"><div class="ir-main">${iratingStr}</div>${deltaHtml}</td>
                <td class="col-gap">${gapStr}</td>
                <td class="col-int">${intStr}</td>
                <td class="col-last">${lastLapStr}</td>
                <td class="col-best">${bestStr}</td>
                <td class="col-tire">${tireStr}</td>
                <td class="col-pit pit-status">${pitStr}</td>
                <td class="col-gap-focus ${gapFocusClass}">${gapFocusStr}</td>
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

function formatGapTime(seconds, refLap, showPlus) {
  if (!seconds || seconds <= 0) return "-";
  const prefix = showPlus ? "+" : "";
  if (refLap > 0 && seconds >= refLap) {
    const laps = Math.floor(seconds / refLap);
    return `${prefix}${laps}L`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ds = (seconds % 1).toFixed(1).substring(1);
  if (m > 0) {
    return `${prefix}${m}:${s.toString().padStart(2, "0")}${ds}`;
  }
  return `${prefix}${s}${ds}`;
}

function formatPitTime(seconds) {
  if (!seconds || seconds <= 0) return "0.0";
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return seconds.toFixed(1);
}

function formatIRating(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "0";
  if (num < 1000) return Math.round(num).toString();
  const k = num / 1000;
  const rounded = Math.round(k * 10) / 10;
  return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)}k`;
}

function selectVisibleDrivers(driversList, focusCarIdx) {
  if (!driversList.length)
    return { items: [], showSeparator: false, separatorIndex: -1 };

  const topCount = Math.min(3, driversList.length);
  const visibleIndexes = new Set();

  for (let i = 0; i < topCount; i++) visibleIndexes.add(i);

  let focusIndex = driversList.findIndex((d) => d.carIdx === focusCarIdx);
  if (focusIndex === -1) focusIndex = 0;

  const windowStart = Math.max(0, focusIndex - 3);
  const windowEnd = Math.min(driversList.length - 1, focusIndex + 3);
  for (let i = windowStart; i <= windowEnd; i++) visibleIndexes.add(i);

  const items = Array.from(visibleIndexes)
    .sort((a, b) => a - b)
    .map((idx) => ({ index: idx, entry: driversList[idx] }));

  const showSeparator = windowStart > 3;
  const separatorIndex = showSeparator ? windowStart : -1;

  return { items, showSeparator, separatorIndex };
}

function isWetCompound(value) {
  if (!value) return false;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    return v.includes("wet") || v.includes("rain") || v === "w";
  }
  if (value && typeof value === "object" && value.compound) {
    const c = String(value.compound).toLowerCase();
    return c.includes("wet") || c.includes("rain") || c === "w";
  }
  if (typeof value === "number") return value === 1;
  return false;
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
