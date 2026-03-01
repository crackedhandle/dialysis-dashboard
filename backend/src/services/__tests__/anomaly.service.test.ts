import { detectAnomalies } from "../anomaly.service";
import { ClinicalConfig } from "../../config/clinical.config";

describe("detectAnomalies", () => {
  it("should detect excess weight gain", () => {
    const result = detectAnomalies({
      dryWeightKg: 70,
      preWeightKg: 75,
      postWeightKg: 69,
      systolicBP: 120,
      startTime: new Date(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });

    expect(result.some(a => a.type === "EXCESS_WEIGHT_GAIN")).toBe(true);
  });

  it("should detect high systolic BP", () => {
    const result = detectAnomalies({
      dryWeightKg: 70,
      preWeightKg: 70,
      postWeightKg: 69,
      systolicBP: ClinicalConfig.maxPostDialysisSystolicBP + 10,
      startTime: new Date(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });

    expect(result.some(a => a.type === "HIGH_POST_DIALYSIS_BP")).toBe(true);
  });

  it("should detect abnormal duration", () => {
    const result = detectAnomalies({
      dryWeightKg: 70,
      preWeightKg: 70,
      postWeightKg: 69,
      systolicBP: 120,
      startTime: new Date(),
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });

    expect(result.some(a => a.type === "ABNORMAL_DURATION")).toBe(true);
  });
});