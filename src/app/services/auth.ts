import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();

  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  isLoggedInNow(): boolean {
    return this.loggedIn.value;
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.data.token);
        this.setLoggedIn(true);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.setLoggedIn(false);
  }
}
