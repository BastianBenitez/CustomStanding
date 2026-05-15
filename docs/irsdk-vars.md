# Documentacion IRSDK (snapshot)

Este documento resume las variables IRSDK observadas en `data.json` y explica como solicitarlas desde `app.js`.

## Como solicitar datos
1. Define las listas de variables en `varsDinamicas` y `varsEstaticas`.
2. Crea la instancia con `new IRacing(varsDinamicas, varsEstaticas, fps)`.
3. Lee los valores en `iracing.onUpdate` usando `this.data`.
4. Solo llegan las variables listadas; si no esta suscrita, el valor sera `undefined`.

Ejemplo:
```js
const varsDinamicas = ["SessionTime", "CarIdxPosition"];
const varsEstaticas = ["DriverInfo"];
const iracing = new IRacing(varsDinamicas, varsEstaticas, 10);

iracing.onUpdate = function () {
  const data = this.data;
  if (data.SessionTime !== undefined) {
    console.log("SessionTime", data.SessionTime);
  }
  if (Array.isArray(data.CarIdxPosition)) {
    console.log("CarIdxPosition[0]", data.CarIdxPosition[0]);
  }
};
```

## Notas de formato
- Numeros: normalmente segundos o unidades del sim. Valores como `0` o `-1` suelen indicar sin dato.
- Booleanos: `true` / `false`.
- Arrays: `CarIdx*` es un array por auto (indice = carIdx). `_ST` es un array de muestras (normalmente 6).
- Snapshot: este archivo es una captura en un instante; para logs continuos usa un intervalo.

## Catalogo de variables (ejemplo)
Fuente: `data.json`.

| Variable | Tipo | Ejemplo |
| --- | --- | --- |
| `SessionTime` | number | 713.98335978157 |
| `SessionTick` | number | 73140 |
| `SessionNum` | number | 2 |
| `SessionState` | number | 4 |
| `SessionUniqueID` | number | 3 |
| `SessionFlags` | number | 268435456 |
| `SessionTimeRemain` | number | 702.8333068850966 |
| `SessionLapsRemain` | number | 32767 |
| `SessionLapsRemainEx` | number | 32767 |
| `SessionTimeTotal` | number | 1200 |
| `SessionLapsTotal` | number | 32767 |
| `SessionJokerLapsRemain` | number | 0 |
| `SessionOnJokerLap` | boolean | false |
| `SessionTimeOfDay` | number | 26513 |
| `RadioTransmitCarIdx` | number | -1 |
| `RadioTransmitRadioIdx` | number | 0 |
| `RadioTransmitFrequencyIdx` | number | 0 |
| `DisplayUnits` | number | 1 |
| `DriverMarker` | boolean | false |
| `PushToTalk` | boolean | false |
| `PushToPass` | boolean | false |
| `ManualBoost` | boolean | false |
| `ManualNoBoost` | boolean | false |
| `IsOnTrack` | boolean | false |
| `IsReplayPlaying` | boolean | true |
| `ReplayFrameNum` | number | 21814 |
| `ReplayFrameNumEnd` | number | 1 |
| `IsDiskLoggingEnabled` | boolean | true |
| `IsDiskLoggingActive` | boolean | false |
| `FrameRate` | number | 150.5261993408203 |
| `CpuUsageFG` | number | 0.2533186078071594 |
| `GpuUsage` | number | 0.37408795952796936 |
| `ChanAvgLatency` | number | 0.16735202074050903 |
| `ChanLatency` | number | 0.1666666716337204 |
| `ChanQuality` | number | 1.0000532865524292 |
| `ChanPartnerQuality` | number | 1 |
| `CpuUsageBG` | number | 0.3740004897117615 |
| `ChanClockSkew` | number | 0 |
| `MemPageFaultSec` | number | 0 |
| `MemSoftPageFaultSec` | number | 0 |
| `PlayerCarPosition` | number | 0 |
| `PlayerCarClassPosition` | number | 0 |
| `PlayerCarClass` | number | 4091 |
| `PlayerTrackSurface` | number | -1 |
| `PlayerTrackSurfaceMaterial` | number | -1 |
| `PlayerCarIdx` | number | 63 |
| `PlayerCarTeamIncidentCount` | number | 0 |
| `PlayerCarMyIncidentCount` | number | 0 |
| `PlayerCarDriverIncidentCount` | number | 0 |
| `PlayerCarWeightPenalty` | number | 0 |
| `PlayerCarPowerAdjust` | number | 0 |
| `PlayerCarDryTireSetLimit` | number | 0 |
| `PlayerCarTowTime` | number | 0 |
| `PlayerCarInPitStall` | boolean | false |
| `PlayerCarPitSvStatus` | number | 0 |
| `PlayerTireCompound` | number | -1 |
| `PlayerFastRepairsUsed` | number | 0 |
| `CarIdxLap` | array[64] | [0, 5, 5, 5, 5, 5, ...] |
| `CarIdxLapCompleted` | array[64] | [-1, 4, 4, 4, 4, 4, ...] |
| `CarIdxLapDistPct` | array[64] | [0.058078743517398834, 0.2589226961135864, 0.2279142588376999, 0.24187639355659485, 0.12655805051326752, 0.23082537949085236, ...] |
| `CarIdxTrackSurface` | array[64] | [1, 3, 3, 3, 3, 3, ...] |
| `CarIdxTrackSurfaceMaterial` | array[64] | [5, 1, 1, 1, 1, 1, ...] |
| `CarIdxOnPitRoad` | array[64] | [true, false, false, false, false, false, ...] |
| `CarIdxPosition` | array[64] | [0, 1, 4, 2, 13, 3, ...] |
| `CarIdxClassPosition` | array[64] | [0, 1, 4, 2, 13, 3, ...] |
| `CarIdxClass` | array[64] | [11, 4091, 4091, 4091, 4091, 4091, ...] |
| `CarIdxF2Time` | array[64] | [0, 0, 4.158599853515625, 2.3297998905181885, 17.79829978942871, 3.7177999019622803, ...] |
| `CarIdxEstTime` | array[64] | [5.33189582824707, 28.39375877380371, 24.231718063354492, 26.179603576660156, 11.194677352905273, 24.601516723632812, ...] |
| `CarIdxLastLapTime` | array[64] | [-1, 117.35559844970703, 117.53469848632812, 117.42949676513672, 118.34860229492188, 117.7385025024414, ...] |
| `CarIdxBestLapTime` | array[64] | [-1, 117.2750015258789, 117.49369812011719, 117.42949676513672, 119.2654037475586, 117.7385025024414, ...] |
| `CarIdxBestLapNum` | array[64] | [-1, 3, 3, 4, 3, 4, ...] |
| `CarIdxTireCompound` | array[64] | [-1, 0, 0, 0, 0, 0, ...] |
| `CarIdxQualTireCompound` | array[64] | [-1, 0, 0, 0, 0, 0, ...] |
| `CarIdxQualTireCompoundLocked` | array[64] | [false, false, false, false, false, false, ...] |
| `CarIdxFastRepairsUsed` | array[64] | [0, 0, 0, 0, 0, 0, ...] |
| `CarIdxSessionFlags` | array[64] | [262144, 262144, 262144, 262144, 262144, 262144, ...] |
| `PaceMode` | number | 1 |
| `CarIdxPaceLine` | array[64] | [-1, -1, -1, -1, -1, -1, ...] |
| `CarIdxPaceRow` | array[64] | [-1, -1, -1, -1, -1, -1, ...] |
| `CarIdxPaceFlags` | array[64] | [0, 0, 0, 0, 0, 0, ...] |
| `OnPitRoad` | boolean | false |
| `CarIdxSteer` | array[64] | [-1.2720187403392202E-10, -1.923516869544983, 0.8997165560722351, 0.6194755434989929, -0.035918671637773514, 2.373344898223877, ...] |
| `CarIdxRPM` | array[64] | [2000, 7334.20361328125, 5393.4130859375, 5924.88818359375, 7508.8525390625, 6368.3154296875, ...] |
| `CarIdxGear` | array[64] | [1, 3, 4, 3, 4, 3, ...] |
| `SteeringWheelAngle` | number | 0 |
| `Throttle` | number | 0 |
| `Brake` | number | 1 |
| `Clutch` | number | 0 |
| `Gear` | number | 0 |
| `RPM` | number | 300 |
| `PlayerCarSLFirstRPM` | number | 7300 |
| `PlayerCarSLShiftRPM` | number | 8050 |
| `PlayerCarSLLastRPM` | number | 8100 |
| `PlayerCarSLBlinkRPM` | number | 8150 |
| `Lap` | number | 0 |
| `LapCompleted` | number | 0 |
| `LapDist` | number | 0 |
| `LapDistPct` | number | 0 |
| `RaceLaps` | number | 5 |
| `CarDistAhead` | number | 500000 |
| `CarDistBehind` | number | 500000 |
| `LapBestLap` | number | 0 |
| `LapBestLapTime` | number | 0 |
| `LapLastLapTime` | number | 0 |
| `LapCurrentLapTime` | number | 0 |
| `LapLasNLapSeq` | number | 0 |
| `LapLastNLapTime` | number | 0 |
| `LapBestNLapLap` | number | 0 |
| `LapBestNLapTime` | number | 0 |
| `LapDeltaToBestLap` | number | 0 |
| `LapDeltaToBestLap_DD` | number | 0 |
| `LapDeltaToBestLap_OK` | boolean | false |
| `LapDeltaToOptimalLap` | number | 0 |
| `LapDeltaToOptimalLap_DD` | number | 0 |
| `LapDeltaToOptimalLap_OK` | boolean | false |
| `LapDeltaToSessionBestLap` | number | 0 |
| `LapDeltaToSessionBestLap_DD` | number | 0 |
| `LapDeltaToSessionBestLap_OK` | boolean | false |
| `LapDeltaToSessionOptimalLap` | number | 0 |
| `LapDeltaToSessionOptimalLap_DD` | number | 0 |
| `LapDeltaToSessionOptimalLap_OK` | boolean | false |
| `LapDeltaToSessionLastlLap` | number | 0 |
| `LapDeltaToSessionLastlLap_DD` | number | 0 |
| `LapDeltaToSessionLastlLap_OK` | boolean | false |
| `Speed` | number | 0 |
| `Yaw` | number | 0 |
| `YawNorth` | number | 0 |
| `Pitch` | number | 0 |
| `Roll` | number | 0 |
| `EnterExitReset` | number | 0 |
| `TrackTemp` | number | 21.666656494140625 |
| `TrackTempCrew` | number | 21.666656494140625 |
| `AirTemp` | number | 20.012325286865234 |
| `TrackWetness` | number | 1 |
| `Skies` | number | 3 |
| `AirDensity` | number | 1.1843305826187134 |
| `AirPressure` | number | 100501.734375 |
| `WindVel` | number | 5.061464309692383 |
| `WindDir` | number | 5.846413612365723 |
| `RelativeHumidity` | number | 0.949999988079071 |
| `FogLevel` | number | 0 |
| `Precipitation` | number | 0 |
| `SolarAltitude` | number | 0.5077292919158936 |
| `SolarAzimuth` | number | 1.511368989944458 |
| `WeatherDeclaredWet` | boolean | false |
| `SteeringFFBEnabled` | boolean | false |
| `DCLapStatus` | number | 2 |
| `DCDriversSoFar` | number | 0 |
| `OkToReloadTextures` | boolean | true |
| `LoadNumTextures` | boolean | false |
| `CarLeftRight` | number | 0 |
| `PitsOpen` | boolean | true |
| `VidCapEnabled` | boolean | true |
| `VidCapActive` | boolean | false |
| `PlayerIncidents` | number | 0 |
| `PitRepairLeft` | number | 0 |
| `PitOptRepairLeft` | number | 0 |
| `PitstopActive` | boolean | false |
| `FastRepairUsed` | number | 0 |
| `FastRepairAvailable` | number | 0 |
| `LFTiresUsed` | number | 0 |
| `RFTiresUsed` | number | 0 |
| `LRTiresUsed` | number | 0 |
| `RRTiresUsed` | number | 0 |
| `LeftTireSetsUsed` | number | 0 |
| `RightTireSetsUsed` | number | 0 |
| `FrontTireSetsUsed` | number | 0 |
| `RearTireSetsUsed` | number | 0 |
| `TireSetsUsed` | number | 0 |
| `LFTiresAvailable` | number | 0 |
| `RFTiresAvailable` | number | 0 |
| `LRTiresAvailable` | number | 0 |
| `RRTiresAvailable` | number | 0 |
| `LeftTireSetsAvailable` | number | 0 |
| `RightTireSetsAvailable` | number | 0 |
| `FrontTireSetsAvailable` | number | 0 |
| `RearTireSetsAvailable` | number | 0 |
| `TireSetsAvailable` | number | 0 |
| `CamCarIdx` | number | 15 |
| `CamCameraNumber` | number | 3 |
| `CamGroupNumber` | number | 18 |
| `CamCameraState` | number | 81 |
| `IsOnTrackCar` | boolean | false |
| `IsInGarage` | boolean | false |
| `SteeringWheelAngleMax` | number | 10.681405067443848 |
| `ShiftPowerPct` | number | 0 |
| `ShiftGrindRPM` | number | 0 |
| `ThrottleRaw` | number | 0 |
| `BrakeRaw` | number | 0 |
| `ClutchRaw` | number | 0 |
| `HandbrakeRaw` | number | 0 |
| `BrakeABSactive` | boolean | false |
| `Shifter` | number | 0 |
| `EngineWarnings` | number | 0 |
| `FuelLevelPct` | number | 0 |
| `PitSvFlags` | number | 0 |
| `PitSvLFP` | number | 0 |
| `PitSvRFP` | number | 0 |
| `PitSvLRP` | number | 0 |
| `PitSvRRP` | number | 0 |
| `PitSvFuel` | number | 0 |
| `PitSvTireCompound` | number | 0 |
| `CarIdxP2P_Status` | array[64] | [false, false, false, false, false, false, ...] |
| `CarIdxP2P_Count` | array[64] | [-1, -1, -1, -1, -1, -1, ...] |
| `P2P_Status` | boolean | false |
| `P2P_Count` | number | 0 |
| `SteeringWheelPctTorque` | number | 0 |
| `SteeringWheelPctTorqueSign` | number | 0 |
| `SteeringWheelPctTorqueSignStops` | number | 0 |
| `SteeringWheelPctIntensity` | number | 0 |
| `SteeringWheelPctSmoothing` | number | 0 |
| `SteeringWheelPctDamper` | number | 0 |
| `SteeringWheelLimiter` | number | 0 |
| `SteeringWheelMaxForceNm` | number | 8500 |
| `SteeringWheelPeakForceNm` | number | -1 |
| `SteeringWheelUseLinear` | boolean | true |
| `ShiftIndicatorPct` | number | 0 |
| `ReplayPlaySpeed` | number | 1 |
| `ReplayPlaySlowMotion` | boolean | false |
| `ReplaySessionTime` | number | 712.9833455403646 |
| `ReplaySessionNum` | number | 2 |
| `TireLF_RumblePitch` | number | 0 |
| `TireRF_RumblePitch` | number | 0 |
| `TireLR_RumblePitch` | number | 0 |
| `TireRR_RumblePitch` | number | 0 |
| `IsGarageVisible` | boolean | false |
| `SteeringWheelTorque_ST` | array[6] | [5.9450439948705025E-06, 5.9450439948705025E-06, 5.9450439948705025E-06, 5.9450439948705025E-06, 5.9450439948705025E-06, 5.9450439948705025E-06] |
| `SteeringWheelTorque` | number | 5.9450439948705025E-06 |
| `VelocityZ_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `VelocityY_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `VelocityX_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `VelocityZ` | number | 0 |
| `VelocityY` | number | 0 |
| `VelocityX` | number | 0 |
| `YawRate_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `PitchRate_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `RollRate_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `YawRate` | number | 0 |
| `PitchRate` | number | 0 |
| `RollRate` | number | 0 |
| `VertAccel_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `LatAccel_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `LongAccel_ST` | array[6] | [0, 0, 0, 0, 0, 0] |
| `VertAccel` | number | 0 |
| `LatAccel` | number | 0 |
| `LongAccel` | number | 0 |
| `dcStarter` | boolean | false |
| `dcPitSpeedLimiterToggle` | boolean | false |
| `dcTractionControlToggle` | boolean | false |
| `dcHeadlightFlash` | boolean | false |
| `dpRFTireChange` | number | 0 |
| `dpLFTireChange` | number | 0 |
| `dpRRTireChange` | number | 0 |
| `dpLRTireChange` | number | 0 |
| `dpFuelFill` | number | 0 |
| `dpFuelAutoFillEnabled` | number | 0 |
| `dpFuelAutoFillActive` | number | 0 |
| `dpWindshieldTearoff` | number | 0 |
| `dpFuelAddKg` | number | 0 |
| `dpFastRepair` | number | 0 |
| `dcBrakeBias` | number | 0 |
| `dpLFTireColdPress` | number | 0 |
| `dpRFTireColdPress` | number | 0 |
| `dpLRTireColdPress` | number | 0 |
| `dpRRTireColdPress` | number | 0 |
| `dcTractionControl` | number | 0 |
| `dcABS` | number | 0 |
| `dcToggleWindshieldWipers` | boolean | false |
| `dcTriggerWindshieldWipers` | boolean | false |
| `FuelUsePerHour` | number | 0 |
| `Voltage` | number | 13.40000057220459 |
| `WaterTemp` | number | 77 |
| `WaterLevel` | number | 19.65999984741211 |
| `FuelPress` | number | 4.4599124393585043E-10 |
| `OilTemp` | number | 77 |
| `OilPress` | number | 0 |
| `OilLevel` | number | 9 |
| `ManifoldPress` | number | 1 |
| `FuelLevel` | number | 0 |
| `Engine0_RPM` | number | 0.0005033692577853799 |
| `RFbrakeLinePress` | number | 0 |
| `RFcoldPressure` | number | 158.57901000976562 |
| `RFodometer` | number | 0 |
| `RFtempCL` | number | 34.569610595703125 |
| `RFtempCM` | number | 34.569610595703125 |
| `RFtempCR` | number | 34.569610595703125 |
| `RFwearL` | number | 1 |
| `RFwearM` | number | 1 |
| `RFwearR` | number | 1 |
| `LFbrakeLinePress` | number | 0 |
| `LFcoldPressure` | number | 158.57901000976562 |
| `LFodometer` | number | 0 |
| `LFtempCL` | number | 34.569610595703125 |
| `LFtempCM` | number | 34.569610595703125 |
| `LFtempCR` | number | 34.569610595703125 |
| `LFwearL` | number | 1 |
| `LFwearM` | number | 1 |
| `LFwearR` | number | 1 |
| `RRbrakeLinePress` | number | 0 |
| `RRcoldPressure` | number | 158.57901000976562 |
| `RRodometer` | number | 0 |
| `RRtempCL` | number | 34.555877685546875 |
| `RRtempCM` | number | 34.555877685546875 |
| `RRtempCR` | number | 34.555877685546875 |
| `RRwearL` | number | 1 |
| `RRwearM` | number | 1 |
| `RRwearR` | number | 1 |
| `LRbrakeLinePress` | number | 0 |
| `LRcoldPressure` | number | 158.57901000976562 |
| `LRodometer` | number | 0 |
| `LRtempCL` | number | 34.555877685546875 |
| `LRtempCM` | number | 34.555877685546875 |
| `LRtempCR` | number | 34.555877685546875 |
| `LRwearL` | number | 1 |
| `LRwearM` | number | 1 |
| `LRwearR` | number | 1 |
| `LRshockDefl` | number | 0.05961209535598755 |
| `LRshockDefl_ST` | array[6] | [0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755] |
| `LRshockVel` | number | 0.6865198016166687 |
| `LRshockVel_ST` | array[6] | [0.6865198016166687, 0.6865198016166687, 0.6865198016166687, 0.6865198016166687, 0.6865198016166687, 0.6865198016166687] |
| `RRshockDefl` | number | 0.05961209535598755 |
| `RRshockDefl_ST` | array[6] | [0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755, 0.05961209535598755] |
| `RRshockVel` | number | 0.6865864396095276 |
| `RRshockVel_ST` | array[6] | [0.6865864396095276, 0.6865864396095276, 0.6865864396095276, 0.6865864396095276, 0.6865864396095276, 0.6865864396095276] |
| `LFshockDefl` | number | 0.025202512741088867 |
| `LFshockDefl_ST` | array[6] | [0.025202512741088867, 0.025202512741088867, 0.025202512741088867, 0.025202512741088867, 0.025202512741088867, 0.025202512741088867] |
| `LFshockVel` | number | 0.43865159153938293 |
| `LFshockVel_ST` | array[6] | [0.43865159153938293, 0.43865159153938293, 0.43865159153938293, 0.43865159153938293, 0.43865159153938293, 0.43865159153938293] |
| `RFshockDefl` | number | 0.025202453136444092 |
| `RFshockDefl_ST` | array[6] | [0.025202453136444092, 0.025202453136444092, 0.025202453136444092, 0.025202453136444092, 0.025202453136444092, 0.025202453136444092] |
| `RFshockVel` | number | 0.43865200877189636 |
| `RFshockVel_ST` | array[6] | [0.43865200877189636, 0.43865200877189636, 0.43865200877189636, 0.43865200877189636, 0.43865200877189636, 0.43865200877189636] |
