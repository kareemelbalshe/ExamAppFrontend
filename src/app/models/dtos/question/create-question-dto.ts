import { ChoiceDto } from "../choice/create-choice-dto";

export interface CreateQuestionDto {
  text: string;
  examId?: number; // Optional, if needed for exam-specific questions
  choices: ChoiceDto[];
}