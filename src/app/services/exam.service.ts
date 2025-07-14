import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../environment';
import { Exam } from '../models/exam';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = `${environment.apiUrl}/Exam`;

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<Exam[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      tap(response => console.log('📦 Full API Response:', response?.data?.$values)),
      map(res => res?.data?.$values || [])
    );
  }
}
