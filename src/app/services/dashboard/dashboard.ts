import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.baseUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`).pipe(
      tap(res => console.log('📊 Stats:', res))
    );
  }

  getStudentsPerMonth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chart/students-per-month`).pipe(
      tap(res => console.log('📅 Students Per Month:', res))
    );
  }

  getAiInsights(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ai/insights`).pipe(
      tap(res => console.log('🤖 AI Insights:', res))
    );
  }

  getPredictions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ai/predictions`).pipe(
      tap(res => console.log('🔮 AI Predictions:', res))
    );
  }
}
