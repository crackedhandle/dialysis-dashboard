import { z } from "zod";

export const CreateSessionSchema = z.object({
  patientId: z.string(),
  unitId: z.string(),
  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  preWeightKg: z.number().positive(),
  postWeightKg: z.number().positive(),
  systolicBP: z.number().min(50).max(300),
  diastolicBP: z.number().min(30).max(200),
  machineId: z.string(),
  nurseNotes: z.string().optional(),
});