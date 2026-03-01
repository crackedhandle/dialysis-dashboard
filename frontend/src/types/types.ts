export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  dryWeightKg: number;
  unitId: string;
}

export interface Anomaly {
  type: string;
  message: string;
  value: number;
  threshold: number;
}

export interface Session {
  _id: string;
  patientId: string;
  unitId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  preWeightKg: number;
  postWeightKg: number;
  systolicBP: number;
  diastolicBP: number;
  machineId: string;
  anomalies: Anomaly[];
}

export interface ScheduleEntry {
  patient: Patient;
  status: string;
  session?: Session;
  hasAnomalies: boolean;
}