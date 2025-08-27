import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateStudent, Student } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = `${environment.baseUrl}/User`;

  constructor(private http: HttpClient) { }

  getAllStudents(
    name: string = '',
    sortBy: string = 'id',
    isDesc: boolean = false,
    page: number = 1,
    pageSize: number = 5,
    isDeleted?: boolean
  ): Observable<any> {
    const params: any = {
      name,
      sortBy,
      isDesc,
      page,
      pageSize
    };

    if (isDeleted !== undefined) {
      params.isDeleted = isDeleted;
    }

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      tap(response => console.log('📦 Students API Response:', response)),
      map(res => {
        const data = res?.data;
        return {
          items: data?.data || [],
          totalItems: data?.totalCount || 0,
          totalPages: Math.ceil((data?.totalCount || 0) / pageSize),
          currentPage: data?.page || 1,
          pageSize: data?.pageSize || pageSize
        };
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(res => res?.data)
    );
  }

  addStudent(student: CreateStudent): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  updateStudent(id: number, student: CreateStudent): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
