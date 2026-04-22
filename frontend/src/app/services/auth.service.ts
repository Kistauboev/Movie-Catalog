import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "./api.service";
import { LoginResponse, User } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  constructor(private apiService: ApiService) {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("access_token");
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null,
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
    this.token = this.tokenSubject.asObservable();
  }

  // Get current user immediately
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current token immediately
  get currentTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  register(
    username: string,
    email: string,
    password: string,
  ): Observable<User> {
    return this.apiService.register(username, email, password);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.apiService
      .login(username, password)
      .pipe
      // tap(response => {
      //   localStorage.setItem('access_token', response.access_token);
      //   localStorage.setItem('currentUser', JSON.stringify(response.user));
      //   this.currentUserSubject.next(response.user);
      //   this.tokenSubject.next(response.access_token);
      // })
      ();
  }

  setUserAndToken(user: User, token: string): void {
    localStorage.setItem("access_token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  logout(): Observable<any> {
    return this.apiService.logout();
  }

  performLogout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentTokenValue;
  }
}
