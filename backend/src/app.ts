import express from "express";
import cors from "cors";

import patientRoutes from "./routes/patient.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./docs/swagger";

export const app = express();

app.use(cors());
app.use(express.json());

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * API Routes
 */
app.use("/patients", patientRoutes);
app.use("/sessions", sessionRoutes);
app.use("/schedule", scheduleRoutes);

/**
 * Swagger Documentation
 */
setupSwagger(app);

/**
 * Global Error Handler
 */
app.use(errorMiddleware);