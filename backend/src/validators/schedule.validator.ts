import { z } from "zod";

export const CreateScheduleSchema = z.object({
  patientId: z.string(),
  unitId: z.string(),
  date: z.string(),
});