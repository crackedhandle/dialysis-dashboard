import mongoose from "mongoose";
import dotenv from "dotenv";
import { PatientModel } from "./domain/patient.model";
import { ScheduleModel } from "./domain/schedule.model";
import { SessionModel } from "./domain/session.model";
import { detectAnomalies } from "./services/anomaly.service";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB");

    await PatientModel.deleteMany({});
    await ScheduleModel.deleteMany({});
    await SessionModel.deleteMany({});
    console.log("Cleared existing data");

    const patient1 = await PatientModel.create({
      firstName: "Rahul",
      lastName: "Sharma",
      age: 45,
      gender: "male",
      dryWeightKg: 70,
      unitId: "U1",
    });

    const patient2 = await PatientModel.create({
      firstName: "Anita",
      lastName: "Verma",
      age: 52,
      gender: "female",
      dryWeightKg: 60,
      unitId: "U1",
    });

    const today = new Date().toISOString().split("T")[0];

    await ScheduleModel.create([
      {
        patientId: patient1._id,
        unitId: "U1",
        date: today,
        status: "completed",
      },
      {
        patientId: patient2._id,
        unitId: "U1",
        date: today,
        status: "not_started",
      },
    ]);

    const startTime = new Date();
    const endTime = new Date(Date.now() + 240 * 60000);

    const anomalies = detectAnomalies({
       dryWeightKg: patient1.dryWeightKg,
       preWeightKg: 74,
       postWeightKg: 69,
       systolicBP: 170,
       startTime,
       endTime,
     });
    await SessionModel.create({
      patientId: patient1._id,
      unitId: "U1",
      scheduledDate: today,
      startTime,
      endTime,
      preWeightKg: 74,
      postWeightKg: 69,
      systolicBP: 170,
      diastolicBP: 90,
      machineId: "M1",
      anomalies,
    });

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();