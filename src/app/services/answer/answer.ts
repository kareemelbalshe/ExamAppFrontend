import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Answer {

private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }
  createAnswer(payload: any) {
    return this.http.post(`${this.apiUrl}/Answer/submit`, payload);
  }
  getAnswersByResultId(resultId: number) {
    return this.http.get(`${this.apiUrl}/Answer/by-result/${resultId}`);
  }
  updateAnswer(answerId: number, payload: any) {
    return this.http.put(`${this.apiUrl}/Answer/${answerId}`, payload);
  }
}
