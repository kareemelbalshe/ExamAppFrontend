import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  role: string = '';
  private baseUrl = environment.baseUrl;

  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/login`, payload).pipe(
      tap((response: any) => {
        this.role = response.data.role;
        localStorage.setItem('token', response.data.token);
        this.loggedIn.next(true); // ✅ تحديث الحالة
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false); // ✅ تحديث الحالة
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
