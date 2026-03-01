import mongoose, { Schema, Document, Types } from "mongoose";

export interface IScheduleEntry extends Document {
  patientId: Types.ObjectId;
  unitId: string;
  date: string;
  status: "not_started" | "in_progress" | "completed";
}

const ScheduleSchema = new Schema<IScheduleEntry>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
    index: true,
  },
  unitId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started",
  },
});

ScheduleSchema.index({ unitId: 1, date: 1 });

export const ScheduleModel = mongoose.model<IScheduleEntry>(
  "ScheduleEntry",
  ScheduleSchema
);