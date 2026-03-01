import { useState } from "react";
import { api } from "../api/client";

interface Props {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SessionModal({ patientId, onClose, onSuccess }: Props) {
  const [preWeightKg, setPreWeightKg] = useState<number | "">("");
  const [postWeightKg, setPostWeightKg] = useState<number | "">("");
  const [systolicBP, setSystolicBP] = useState<number | "">("");
  const [diastolicBP, setDiastolicBP] = useState<number | "">("");
  const [machineId, setMachineId] = useState("M1");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (
        preWeightKg === "" ||
        postWeightKg === "" ||
        systolicBP === "" ||
        diastolicBP === ""
      ) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);

      await api.post("/sessions", {
        patientId,
        unitId: "U1",
        startTime,
        endTime,
        preWeightKg: Number(preWeightKg),
        postWeightKg: Number(postWeightKg),
        systolicBP: Number(systolicBP),
        diastolicBP: Number(diastolicBP),
        machineId,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Session creation error:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Start Session</h3>

      <input
        type="number"
        placeholder="Pre Weight"
        value={preWeightKg}
        onChange={(e) =>
          setPreWeightKg(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="number"
        placeholder="Post Weight"
        value={postWeightKg}
        onChange={(e) =>
          setPostWeightKg(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="number"
        placeholder="Systolic BP"
        value={systolicBP}
        onChange={(e) =>
          setSystolicBP(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="number"
        placeholder="Diastolic BP"
        value={diastolicBP}
        onChange={(e) =>
          setDiastolicBP(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="text"
        placeholder="Machine ID"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
      />

      <div style={{ marginTop: "12px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}