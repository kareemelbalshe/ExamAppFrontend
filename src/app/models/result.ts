export interface Result {
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