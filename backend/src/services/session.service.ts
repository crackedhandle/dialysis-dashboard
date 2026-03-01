import { Types } from "mongoose";
import { PatientModel } from "../domain/patient.model";
import { SessionModel } from "../domain/session.model";
import { ScheduleModel } from "../domain/schedule.model";
import { detectAnomalies } from "./anomaly.service";
import { AppError } from "../middleware/error.middleware";

export type CreateSessionDTO = {
  patientId: string;
  unitId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  preWeightKg: number;
  postWeightKg: number;
  systolicBP: number;
  diastolicBP: number;
  machineId: string;
  nurseNotes?: string;
};

export async function createSession(data: CreateSessionDTO) {
  const {
    patientId,
    unitId,
    scheduledDate,
    startTime,
    endTime,
    preWeightKg,
    postWeightKg,
    systolicBP,
    diastolicBP,
    machineId,
    nurseNotes,
  } = data;

  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    throw new Error("Session end time must be after start time");
  }

  if (postWeightKg > preWeightKg) {
    throw new Error("Post-dialysis weight cannot exceed pre-dialysis weight");
  }

  if (patient.unitId !== unitId) {
    throw new AppError("Patient not found", 404);;
  }

  const anomalies = detectAnomalies({
    dryWeightKg: patient.dryWeightKg,
    preWeightKg,
    postWeightKg,
    systolicBP,
    startTime: start,
    endTime: end,
  });

  const session = await SessionModel.create({
    patientId: new Types.ObjectId(patientId),
    unitId,
    scheduledDate,
    startTime: start,
    endTime: end,
    preWeightKg,
    postWeightKg,
    systolicBP,
    diastolicBP,
    machineId,
    nurseNotes,
    anomalies,
  });

  await ScheduleModel.findOneAndUpdate(
    { patientId, unitId, date: scheduledDate },
    { status: "completed" }
  );

  return session;
}