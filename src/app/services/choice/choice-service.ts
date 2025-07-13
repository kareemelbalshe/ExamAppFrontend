// choice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Choice } from '../../models/choice';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Bulk Update
  updateChoicesRange(choices: Choice[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/choice`, choices);
  }

  // Bulk Delete
  deleteChoices(choiceIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch-delete`, choiceIds);
  }

  // (Optional CRUD for single choice)
  getChoice(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/choice/${id}`);
  }

  // (Optional CRUD for single choice)
  getQuestionChoices(questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/choice/q/${questionId}`);
  }

  createChoice(choice: { text: string, questionId: number }): Observable<any> {
    return this.http.post(this.apiUrl, choice);
  }

  updateChoice(id: number, text: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { text });
  }
  updateRange(choices: Choice[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/choice`, choices);
  }

  deleteChoice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/choice/${id}`);
  }
}
