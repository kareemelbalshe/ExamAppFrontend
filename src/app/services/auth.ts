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
        localStorage.setItem('userId', response.data.id);
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
