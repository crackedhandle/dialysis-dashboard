import { ClinicalConfig } from "../config/clinical.config";

export type AnomalyType =
  | "EXCESS_WEIGHT_GAIN"
  | "HIGH_POST_DIALYSIS_BP"
  | "ABNORMAL_SESSION_DURATION";

export type Anomaly = {
  type: AnomalyType;
  message: string;
  value: number;
  threshold: number;
};

export type SessionInput = {
  dryWeightKg: number;
  preWeightKg: number;
  postWeightKg: number;
  systolicBP: number;
  startTime: Date;
  endTime: Date;
};

export function detectAnomalies(input: SessionInput): Anomaly[] {
  const anomalies: Anomaly[] = [];

  const {
    dryWeightKg,
    preWeightKg,
    systolicBP,
    startTime,
    endTime,
  } = input;

  // 1️⃣ Interdialytic Weight Gain
  const weightGainPercent =
    ((preWeightKg - dryWeightKg) / dryWeightKg) * 100;

  if (
    weightGainPercent >
    ClinicalConfig.weightGainPercentThreshold
  ) {
    anomalies.push({
      type: "EXCESS_WEIGHT_GAIN",
      message: `Weight gain ${weightGainPercent.toFixed(
        2
      )}% exceeds ${ClinicalConfig.weightGainPercentThreshold}%`,
      value: weightGainPercent,
      threshold: ClinicalConfig.weightGainPercentThreshold,
    });
  }

  // 2️⃣ High Post-Dialysis Systolic BP
  if (
    systolicBP >
    ClinicalConfig.systolicBPThreshold
  ) {
    anomalies.push({
      type: "HIGH_POST_DIALYSIS_BP",
      message: `Systolic BP ${systolicBP} exceeds ${ClinicalConfig.systolicBPThreshold}`,
      value: systolicBP,
      threshold: ClinicalConfig.systolicBPThreshold,
    });
  }

  // 3️⃣ Abnormal Session Duration
  const durationMinutes =
    (endTime.getTime() - startTime.getTime()) / 60000;

  const target =
    ClinicalConfig.targetSessionDurationMinutes;

  const tolerance =
    ClinicalConfig.durationToleranceMinutes;

  const minAllowed = target - tolerance;
  const maxAllowed = target + tolerance;

  if (
    durationMinutes < minAllowed ||
    durationMinutes > maxAllowed
  ) {
    anomalies.push({
      type: "ABNORMAL_SESSION_DURATION",
      message: `Duration ${durationMinutes} min outside range ${minAllowed}-${maxAllowed}`,
      value: durationMinutes,
      threshold: target,
    });
  }

  return anomalies;
}