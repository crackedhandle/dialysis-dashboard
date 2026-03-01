import { z } from "zod";

export const CreatePatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  age: z.number().int().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
  dryWeightKg: z.number().positive(),
  unitId: z.string().min(1),
});