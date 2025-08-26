import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Result, ResultWithDetails } from '../../models/result';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getResultByStudentId(studentId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/Result/by-student/detailed/${studentId}`)
      .pipe(
        tap((res: any) => {
          console.log('res', res);
        })
      );
  }
  createResult(result: Result) {
    return this.http.post(`${this.baseUrl}/Result`, result);
  }

  updateResult(result: Result) {
    return this.http.put(`${this.baseUrl}/Result/${result.id}`, result);
  }

  getResultById(id: number) {
    return this.http.get(`${this.baseUrl}/Result/${id}`);
  }
}
