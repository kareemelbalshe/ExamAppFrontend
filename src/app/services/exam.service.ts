import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Exam } from '../models/exam';
import { environment } from '../environments/environment.development';
import { CreateExam } from '../models/dtos/Exam/CreateExam';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = `${environment.baseUrl}/Exam`;

  constructor(private http: HttpClient) { }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      tap(response => console.log('📦 Full API Response:', response?.data?.$values)),
      map(res => res?.data?.$values || [])
    );
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(res => res?.data)
    );
  }

  searchExams(name: string = '', sortBy: string = 'id', isDesc: boolean = false, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = {
      name,
      sortBy,
      isDesc,
      page,
      pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/search`, { params }).pipe(
      map(res => res?.data)
    );
  }

  addExam(exam: CreateExam): Observable<Exam> {
    return this.http.post<Exam>(this.baseUrl, exam);
  }

  updateExam(id: number, exam: CreateExam): Observable<Exam> {
  return this.http.put<Exam>(`${this.baseUrl}/${id}`, exam);
}


  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
