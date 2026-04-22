import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Movie,
  Review,
  Favorite,
  LoginResponse,
  User,
} from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = "http://localhost:8000/api";

  constructor(private http: HttpClient) {}

  // ============ Authentication Endpoints ============

  register(
    username: string,
    email: string,
    password: string,
  ): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register/`, {
      username,
      email,
      password,
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, {
      username,
      password,
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout/`, {});
  }

  // ============ Movie Endpoints ============

  getMovies(
    search?: string,
    genre?: string,
    category?: string,
    year?: string,
  ): Observable<Movie[]> {
    let params = "";
    if (search) params += `?search=${encodeURIComponent(search)}`;
    if (genre)
      params += params
        ? `&genre=${encodeURIComponent(genre)}`
        : `?genre=${encodeURIComponent(genre)}`;
    if (category)
      params += params
        ? `&category=${encodeURIComponent(category)}`
        : `?category=${encodeURIComponent(category)}`;
    if (year)
      params += params
        ? `&year=${encodeURIComponent(year)}`
        : `?year=${encodeURIComponent(year)}`;
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/${params}`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}/`);
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies/`, movie);
  }

  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/movies/${id}/`, movie);
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movies/${id}/`);
  }

  // ============ Review Endpoints ============

  getUserReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/`);
  }

  getMovieReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.apiUrl}/reviews/?movie_id=${movieId}`,
    );
  }

  createReview(
    movieId: number,
    rating: number,
    comment: string,
  ): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/`, {
      movie: movieId,
      rating,
      comment,
    });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reviews/?review_id=${reviewId}`);
  }

  // ============ Favorite Endpoints ============

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites/`);
  }

  addFavorite(movieId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/favorites/`, {
      movie_id: movieId,
    });
  }

  removeFavorite(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/?movie_id=${movieId}`);
  }
}
