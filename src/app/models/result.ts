
export interface ResultWithDetails{
  id: number;
  attemptNumber: number;
  examId: number;
  score: number;
  startTime: string;
  endTime: string | null;
  status: string;
  takenAt: string;
  exam: {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
}

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
