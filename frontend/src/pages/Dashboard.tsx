import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ScheduleEntry } from "../types/types";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { format } from "date-fns";
import { SessionModal } from "../components/SessionModal";

export default function Dashboard() {
  const [data, setData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/schedule/today?unitId=U1");
      setData(response.data.patients ?? []);
    } catch {
      setError("Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const filtered = showOnlyAnomalies
    ? data.filter((d) => d.hasAnomalies)
    : data;

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={fetchSchedule} />;

  return (
    <div className="container">
      <h1>Dialysis Unit Dashboard</h1>

      <label style={{ display: "block", marginBottom: "20px" }}>
        <input
          type="checkbox"
          checked={showOnlyAnomalies}
          onChange={(e) => setShowOnlyAnomalies(e.target.checked)}
        />
        {" "}Show only patients with anomalies
      </label>

      {filtered.length === 0 && <p>No patients scheduled.</p>}

      {filtered.map((entry) => {
        const session = entry.session;

        const durationMinutes =
          session
            ? Math.round(
                (new Date(session.endTime).getTime() -
                  new Date(session.startTime).getTime()) /
                  60000
              )
            : null;

        return (
          <div
            key={entry.patient._id}
            className={`card ${entry.hasAnomalies ? "anomaly" : ""}`}
          >
            <h3>
              {entry.patient.firstName} {entry.patient.lastName}
            </h3>

            <span
              className={`badge ${
                entry.status === "completed"
                  ? "completed"
                  : entry.status === "in_progress"
                  ? "in-progress"
                  : "pending"
              }`}
            >
              {entry.status}
            </span>

            {session && (
              <>
                <p>
                  Date:{" "}
                  {format(new Date(session.startTime), "dd MMM yyyy")}
                </p>

                <p>Pre Weight: {session.preWeightKg} kg</p>
                <p>Post Weight: {session.postWeightKg} kg</p>

                <p>
                  BP: {session.systolicBP}/
                  {session.diastolicBP}
                </p>

                {durationMinutes !== null && (
                  <p>Duration: {durationMinutes} minutes</p>
                )}

                {session.anomalies?.length > 0 && (
                  <>
                    <h4 style={{ color: "red" }}>Anomalies:</h4>
                    <ul>
                      {session.anomalies.map((a, i) => (
                        <li key={i}>{a.message}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

            {entry.status === "not_started" && (
              <button
                className="button primary"
                onClick={() =>
                  setSelectedPatient(entry.patient._id)
                }
              >
                Start Session
              </button>
            )}
          </div>
        );
      })}

      {selectedPatient && (
        <SessionModal
          patientId={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onSuccess={fetchSchedule}
        />
      )}
    </div>
  );
}