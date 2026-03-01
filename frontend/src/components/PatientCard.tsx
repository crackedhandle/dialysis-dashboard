import type { ScheduleEntry } from "../types/types";
import dayjs from "dayjs";

interface Props {
  entry: ScheduleEntry;
}

export default function PatientCard({ entry }: Props) {
  const { patient, status, session, hasAnomalies } = entry;

  const duration =
    session &&
    Math.round(
      (new Date(session.endTime).getTime() -
        new Date(session.startTime).getTime()) /
        60000
    );

  return (
    <div className={`card ${hasAnomalies ? "anomaly" : ""}`}>
      <h3>
        {patient.firstName} {patient.lastName}
      </h3>

      <span className={`status ${status}`}>
        {status.replace("_", " ")}
      </span>

      {session && (
        <>
          <p>
            <strong>Date:</strong>{" "}
            {dayjs(session.scheduledDate).format("DD MMM YYYY")}
          </p>
          <p>
            <strong>Pre Weight:</strong> {session.preWeightKg} kg
          </p>
          <p>
            <strong>Post Weight:</strong> {session.postWeightKg} kg
          </p>
          <p>
            <strong>BP:</strong>{" "}
            {session.systolicBP}/{session.diastolicBP}
          </p>
          <p>
            <strong>Duration:</strong> {duration} minutes
          </p>

          {hasAnomalies && (
            <div className="anomaly-list">
              <strong>Anomalies:</strong>
              <ul>
                {session.anomalies.map((a, index) => (
                  <li key={index}>{a.message}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!session && (
        <button className="primary">
          Start Session
        </button>
      )}
    </div>
  );
}