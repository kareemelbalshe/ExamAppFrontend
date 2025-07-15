
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Result } from '../../models/result';

interface ResultResponse {
  data: {
    $values: Result[];
  };  
}
@Injectable({
  providedIn: 'root'
})
export class ResultSerivce {
  baseUrl = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getResultByStudentId(studentId: number) {
    return this.http.get<ResultResponse>(`${this.baseUrl}/Result/by-student/detailed/${studentId}`);
  }
}
