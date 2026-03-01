import { Router } from "express";
import { PatientModel } from "../domain/patient.model";
import { validate } from "../middleware/validate";
import { CreatePatientSchema } from "../validators/patient.validator";

const router = Router();

router.post(
  "/",
  validate(CreatePatientSchema),
  async (req, res) => {
    try {
      const patient = await PatientModel.create(req.body);
      res.status(201).json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to create patient" });
    }
  }
);

export default router;