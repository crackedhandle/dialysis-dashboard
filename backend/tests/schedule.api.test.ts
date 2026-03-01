import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/app";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /schedule/today", () => {
  it("should return today's schedule with anomalies", async () => {
    const response = await request(app).get(
      "/schedule/today?unitId=U1"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("patients");
    expect(Array.isArray(response.body.patients)).toBe(true);

    const patients = response.body.patients;

    const hasAnomalousPatient = patients.some(
      (p: any) => p.hasAnomalies === true
    );

    expect(hasAnomalousPatient).toBe(true);
  });
});