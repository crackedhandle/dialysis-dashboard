import mongoose, { Schema, Document, Types } from "mongoose";
import { Anomaly } from "../services/anomaly.service";

export interface IDialysisSession extends Document {
  patientId: Types.ObjectId;
  unitId: string;
  scheduledDate: string;
  startTime: Date;
  endTime: Date;
  preWeightKg: number;
  postWeightKg: number;
  systolicBP: number;
  diastolicBP: number;
  machineId: string;
  nurseNotes?: string;
  anomalies: Anomaly[];
  createdAt: Date;
}

const AnomalySchema = new Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
  },
  { _id: false }
);

const SessionSchema = new Schema<IDialysisSession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    unitId: { type: String, required: true, index: true },
    scheduledDate: { type: String, required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    preWeightKg: { type: Number, required: true, min: 0 },
    postWeightKg: { type: Number, required: true, min: 0 },
    systolicBP: { type: Number, required: true, min: 50, max: 300 },
    diastolicBP: { type: Number, required: true, min: 30, max: 200 },
    machineId: { type: String, required: true },
    nurseNotes: { type: String },
    anomalies: { type: [AnomalySchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SessionSchema.index({ unitId: 1, scheduledDate: 1 });

export const SessionModel = mongoose.model<IDialysisSession>(
  "DialysisSession",
  SessionSchema
);