import { Choice } from '../../choice';

export interface QuestionDto {
    id: number;
    text: string;
    examId?: number; // Optional, if needed for exam-specific questions
    choices: Choice[];
}
