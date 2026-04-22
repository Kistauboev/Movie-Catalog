import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MovieService } from "../../services/movie.service";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
import { Movie, Review, Favorite } from "../../models/interfaces";

@Component({
  selector: "app-movie-detail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./movie-detail.component.html",
  styleUrls: ["./movie-detail.component.css"],
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  isFavorite = false;
  newReviewRating = 8;
  newReviewComment = "";
  errorMessage = "";
  successMessage = "";
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get("id");
    if (movieId) {
      this.loadMovieDetails(parseInt(movieId));
      this.checkIfFavorite(parseInt(movieId));
    }
  }

  loadMovieDetails(movieId: number): void {
    this.movieService.getMovieById(movieId).subscribe(
      (movie) => {
        this.movie = movie;
        this.loadReviews(movieId);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = "Failed to load movie details";
        this.loading = false;
      },
    );
  }

  loadReviews(movieId: number): void {
    this.apiService.getMovieReviews(movieId).subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      () => {
        this.errorMessage = "Failed to load reviews";
      },
    );
  }

  checkIfFavorite(movieId: number): void {
    this.apiService.getFavorites().subscribe(
      (favorites) => {
        this.isFavorite = favorites.some((f) => f.movie === movieId);
      },
      () => {
        this.errorMessage = "Failed to check favorite status";
      },
    );
  }

  // Event 1: Add to favorites
  onAddToFavorites(): void {
    if (!this.movie) return;

    this.apiService.addFavorite(this.movie.id).subscribe(
      (favorite) => {
        this.isFavorite = true;
        this.successMessage = "Added to favorites!";
        setTimeout(() => (this.successMessage = ""), 3000);
      },
      (error) => {
        this.errorMessage = "Failed to add to favorites";
      },
    );
  }

  // Event 2: Remove from favorites
  onRemoveFromFavorites(): void {
    if (!this.movie) return;

    this.apiService.removeFavorite(this.movie.id).subscribe(
      () => {
        this.isFavorite = false;
        this.successMessage = "Removed from favorites";
        setTimeout(() => (this.successMessage = ""), 3000);
      },
      (error) => {
        this.errorMessage = "Failed to remove from favorites";
      },
    );
  }

  // Event 3: Go back to movie list
  onGoBack(): void {
    this.router.navigate(["/movies"]);
  }

  onSubmitReview(): void {
    if (!this.movie) return;
    if (!this.newReviewComment.trim()) {
      this.errorMessage = "Please enter your review comment";
      return;
    }

    this.apiService
      .createReview(this.movie.id, this.newReviewRating, this.newReviewComment)
      .subscribe(
        () => {
          this.successMessage = "Review posted successfully";
          this.newReviewComment = "";
          this.newReviewRating = 8;
          this.loadReviews(this.movie!.id);
          this.loadMovieDetails(this.movie!.id);
          setTimeout(() => (this.successMessage = ""), 3000);
        },
        () => {
          this.errorMessage = "Failed to post review";
        },
      );
  }

  onDeleteReview(reviewId: number): void {
    if (!confirm("Delete this review?")) return;

    this.apiService.deleteReview(reviewId).subscribe(
      () => {
        this.successMessage = "Review deleted";
        if (this.movie) {
          this.loadReviews(this.movie.id);
          this.loadMovieDetails(this.movie.id);
        }
        setTimeout(() => (this.successMessage = ""), 3000);
      },
      () => {
        this.errorMessage = "Failed to delete review";
      },
    );
  }

  canDeleteReview(review: Review): boolean {
    return review.user === this.authService.currentUserValue?.id;
  }

  getBackdropStyle(): string {
    if (!this.movie?.poster_url) {
      return "linear-gradient(180deg, #101629 0%, #161f3a 55%, #0f1528 100%)";
    }

    return `linear-gradient(rgba(10, 15, 34, 0.86), rgba(12, 18, 40, 0.9)), url(${this.movie.poster_url})`;
  }
}
