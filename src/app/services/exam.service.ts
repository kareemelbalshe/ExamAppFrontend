import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Exam } from '../models/exam';
import { CreateExam } from '../models/dtos/Exam/CreateExam';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = `${environment.baseUrl}/Exam`;

  constructor(private http: HttpClient) { }

  getAllExams(
    name: string = '',
    sortBy: string = 'id',
    isDesc: boolean = false,
    page: number = 1,
    pageSize: number = 5,
    isActive?: boolean
  ): Observable<any> {
    const params: any = {
      name,
      sortBy,
      isDesc,
      page,
      pageSize
    };

    if (isActive !== undefined) {
      params.isActive = isActive;
    }

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      tap(response => console.log('📦 Full API Response:', response)),
      map(res => {
        const data = res?.data;
        return {
          items: data?.data?.$values || [], 
          totalItems: data?.totalCount || 0,
          totalPages: Math.ceil((data?.totalCount || 0) / pageSize),
          currentPage: data?.page || 1,
          pageSize: data?.pageSize || pageSize
        };
      })
    );
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
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