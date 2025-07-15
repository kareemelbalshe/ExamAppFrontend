export interface Result {
  id?: number;
  studentId: number;
  examId: number;
  attemptNumber: number;
  score?: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  takenAt?: Date;
}
