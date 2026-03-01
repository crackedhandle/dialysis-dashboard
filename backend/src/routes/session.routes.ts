import { Router } from "express";
import { SessionModel } from "../domain/session.model";
import { PatientModel } from "../domain/patient.model";
import { ScheduleModel } from "../domain/schedule.model";
import { detectAnomalies } from "../services/anomaly.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      unitId,
      startTime,
      endTime,
      preWeightKg,
      postWeightKg,
      systolicBP,
      diastolicBP,
      machineId,
    } = req.body;

    // ✅ Validation
    if (
      !patientId ||
      !unitId ||
      !startTime ||
      !endTime ||
      preWeightKg == null ||
      postWeightKg == null ||
      systolicBP == null ||
      diastolicBP == null ||
      !machineId
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // ✅ Patient check
    const patient = await PatientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // ✅ Detect anomalies
    const anomalies = detectAnomalies({
      dryWeightKg: patient.dryWeightKg,
      preWeightKg,
      postWeightKg,
      systolicBP,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    // ✅ Create session
    const session = await SessionModel.create({
      patientId,
      unitId,
      scheduledDate: new Date().toISOString().split("T")[0],
      startTime,
      endTime,
      preWeightKg,
      postWeightKg,
      systolicBP,
      diastolicBP,
      machineId,
      anomalies,
    });

    // 🔥 VERY IMPORTANT: Update schedule status
    await ScheduleModel.findOneAndUpdate(
      {
        patientId,
        unitId,
        date: new Date().toISOString().split("T")[0],
      },
      { status: "completed" }
    );

    return res.status(201).json(session);

  } catch (error) {
    console.error("SESSION ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;