import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Choice } from '../../models/choice';
import { ChoiceDto } from '../../models/dtos/choice/create-choice-dto';
import { CreateQuestionDto } from '../../models/dtos/question/create-question-dto';
import { QuestionDto } from '../../models/dtos/question/question-dto';




@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private apiUrl = environment.baseUrl + '/question';

  constructor(private http: HttpClient) { }

  // CREATE
  createQuestion(payload: CreateQuestionDto ): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }

  // READ (optional example)
  getQuestion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getQuestionsByExamIdWithChoices(examId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-exam/detailed/${examId}`);
  }

  // UPDATE
  updateQuestion(id: number, question: QuestionDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, question);
  }

  // DELETE
  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
