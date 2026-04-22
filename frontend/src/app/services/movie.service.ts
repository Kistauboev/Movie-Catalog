import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Movie } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.moviesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadMovies();
  }

  loadMovies(
    search?: string,
    genre?: string,
    category?: string,
    year?: string,
  ): void {
    this.apiService.getMovies(search, genre, category, year).subscribe(
      (movies) => this.moviesSubject.next(movies),
      (error) => console.error("Error loading movies:", error),
    );
  }

  getMovies(): Movie[] {
    return this.moviesSubject.value;
  }

  getMovieById(id: number): Observable<Movie> {
    return this.apiService.getMovieById(id);
  }

  searchMovies(query: string): void {
    this.loadMovies(query);
  }

  filterByGenre(genre: string): void {
    this.loadMovies("", genre);
  }

  filterByCategoryAndYear(category?: string, year?: string): void {
    this.loadMovies("", "", category, year);
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.apiService.createMovie(movie);
  }

  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.apiService.updateMovie(id, movie);
  }

  deleteMovie(id: number): Observable<any> {
    return this.apiService.deleteMovie(id);
  }
}
