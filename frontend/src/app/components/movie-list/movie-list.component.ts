import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MovieService } from "../../services/movie.service";
import { AuthService } from "../../services/auth.service";
import { Movie } from "../../models/interfaces";

@Component({
  selector: "app-movie-list",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./movie-list.component.html",
  styleUrls: ["./movie-list.component.css"],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  searchQuery = "";
  genreFilter = "";
  categoryFilter = "";
  yearFilter = "";
  categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "movie", label: "Movies" },
    { value: "cartoon", label: "Cartoons" },
    { value: "bollywood", label: "Bollywood Movies" },
    { value: "series", label: "Series" },
  ];
  errorMessage = "";
  loading = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.movieService.movies$.subscribe(
      (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = "Failed to load movies";
        this.loading = false;
      },
    );
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.errorMessage = "";
    this.movieService.loadMovies();
  }

  // Event 1: Search movies
  onSearch(): void {
    this.movieService.loadMovies(
      this.searchQuery.trim(),
      this.genreFilter.trim(),
      this.categoryFilter,
      this.yearFilter.trim(),
    );
  }

  // Event 2: Filter by genre
  onFilterByGenre(): void {
    this.movieService.loadMovies(
      this.searchQuery.trim(),
      this.genreFilter.trim(),
      this.categoryFilter,
      this.yearFilter.trim(),
    );
  }

  // Event 3: Advanced category/year filter
  onApplyAdvancedFilters(): void {
    this.movieService.loadMovies(
      this.searchQuery.trim(),
      this.genreFilter.trim(),
      this.categoryFilter,
      this.yearFilter.trim(),
    );
  }

  // Event 4: Reset all filters
  onResetFilters(): void {
    this.searchQuery = "";
    this.genreFilter = "";
    this.categoryFilter = "";
    this.yearFilter = "";
    this.movieService.loadMovies();
  }

  // Event 5: Navigate to movie details
  onViewDetails(movieId: number): void {
    this.router.navigate(["/movie", movieId]);
  }

  onPosterError(movie: Movie): void {
    movie.poster_url = "";
  }

  // Event 6: Navigate to favorites
  onViewFavorites(): void {
    this.router.navigate(["/favorites"]);
  }

  onLogout(): void {
    this.authService.logout().subscribe(
      () => {
        this.authService.performLogout();
        this.router.navigate(["/login"]);
      },
      (error) => {
        this.authService.performLogout();
        this.router.navigate(["/login"]);
      },
    );
  }
}
