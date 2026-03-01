import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "../pages/Dashboard";
import * as apiModule from "../api/client";

vi.mock("../api/client", () => ({
  api: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          patients: [
            {
              patient: {
                _id: "1",
                firstName: "Rahul",
                lastName: "Sharma",
                age: 45,
                gender: "male",
                dryWeightKg: 70,
                unitId: "U1",
              },
              status: "completed",
              hasAnomalies: true,
              session: {
                _id: "s1",
                patientId: "1",
                unitId: "U1",
                scheduledDate: "2026-03-01",
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                preWeightKg: 74,
                postWeightKg: 69,
                systolicBP: 170,
                diastolicBP: 90,
                machineId: "M1",
                anomalies: [
                  {
                    type: "EXCESS_WEIGHT_GAIN",
                    message: "Test anomaly",
                    value: 6,
                    threshold: 5,
                  },
                ],
              },
            },
          ],
        },
      })
    ),
  },
}));

describe("Dashboard UI", () => {
  it("renders patient name and anomaly message", async () => {
    render(<Dashboard />);

    expect(await screen.findByText("Rahul Sharma")).toBeInTheDocument();
    expect(await screen.findByText("Test anomaly")).toBeInTheDocument();
  });
});