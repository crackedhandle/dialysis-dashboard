import { detectAnomalies } from "../src/services/anomaly.service";

describe("Anomaly Detection", () => {
  const baseInput = {
    dryWeightKg: 70,
    preWeightKg: 73.5, // 5% exactly
    postWeightKg: 69,
    systolicBP: 150,
    startTime: new Date("2026-01-01T08:00:00"),
    endTime: new Date("2026-01-01T12:00:00"), // 240 minutes
  };

  it("should not flag exactly 5% weight gain", () => {
    const anomalies = detectAnomalies(baseInput);
    expect(
      anomalies.find(a => a.type === "EXCESS_WEIGHT_GAIN")
    ).toBeUndefined();
  });

  it("should flag weight gain above threshold", () => {
    const input = { ...baseInput, preWeightKg: 74 }; // >5%
    const anomalies = detectAnomalies(input);
    expect(
      anomalies.find(a => a.type === "EXCESS_WEIGHT_GAIN")
    ).toBeDefined();
  });

  it("should flag high systolic BP", () => {
    const input = { ...baseInput, systolicBP: 170 };
    const anomalies = detectAnomalies(input);
    expect(
      anomalies.find(a => a.type === "HIGH_POST_DIALYSIS_BP")
    ).toBeDefined();
  });

  it("should flag abnormal short duration", () => {
    const input = {
      ...baseInput,
      endTime: new Date("2026-01-01T10:00:00"), // 120 min
    };
    const anomalies = detectAnomalies(input);
    expect(
      anomalies.find(a => a.type === "ABNORMAL_SESSION_DURATION")
    ).toBeDefined();
  });
});