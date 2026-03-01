import { Router } from "express";
import { ScheduleModel } from "../domain/schedule.model";
import { SessionModel } from "../domain/session.model";
import { validate } from "../middleware/validate";
import { CreateScheduleSchema } from "../validators/schedule.validator";

const router = Router();

/**
 * Create schedule entry
 */
router.post(
  "/",
  validate(CreateScheduleSchema),
  async (req, res, next) => {
    try {
      const schedule = await ScheduleModel.create({
        ...req.body,
        status: "not_started",
      });

      res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get today's schedule for unit (optimized)
 */
router.get("/today", async (req, res, next) => {
  try {
    const { unitId } = req.query;
    const today = new Date().toISOString().split("T")[0];

    const scheduleEntries = await ScheduleModel.find({
      unitId,
      date: today,
    }).populate("patientId");

    const sessions = await SessionModel.find({
      unitId,
    });

    const sessionMap = new Map();
    for (const session of sessions) {
      sessionMap.set(session.patientId.toString(), session);
    }
  
    const result = scheduleEntries.map((entry: any) => {
    const patientId = entry.patientId._id.toString();
    const session = sessionMap.get(patientId);

  return {
    patient: entry.patientId,
    status: entry.status,
    session,
    hasAnomalies: session?.anomalies.length > 0,
  };
});

    res.json({
      date: today,
      unitId,
      patients: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;