import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | "other";
  dryWeightKg: number;
  unitId: string;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dryWeightKg: { type: Number, required: true, min: 0 },
    unitId: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PatientModel = mongoose.model<IPatient>(
  "Patient",
  PatientSchema
);