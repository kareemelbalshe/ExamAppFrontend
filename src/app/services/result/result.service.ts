import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Result } from '../../models/result';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  baseUrl = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getResultByStudentId(studentId: number) {
    return this.http.get(`${this.baseUrl}/Result/by-student/detailed/${studentId}`);
  }
  createResult(result: Result) {
    return this.http.post(`${this.baseUrl}/Result`, result);
  }

  updateResult(result: Result) {
    return this.http.put(`${this.baseUrl}/Result/${result.id}`, result);
  }
}
