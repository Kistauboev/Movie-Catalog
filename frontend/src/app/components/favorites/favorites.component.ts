import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../services/api.service";
import { Favorite } from "../../models/interfaces";

@Component({
  selector: "app-favorites",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.css"],
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  loading = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.apiService.getFavorites().subscribe(
      (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = "Failed to load favorites";
        this.loading = false;
      },
    );
  }

  // Event 1: Remove from favorites
  onRemoveFavorite(favoriteId: number, movieId: number): void {
    this.apiService.removeFavorite(movieId).subscribe(
      () => {
        this.favorites = this.favorites.filter((f) => f.id !== favoriteId);
        this.successMessage = "Removed from favorites";
        setTimeout(() => (this.successMessage = ""), 3000);
      },
      (error) => {
        this.errorMessage = "Failed to remove from favorites";
      },
    );
  }

  // Event 2: View movie details
  onViewMovie(movieId: number): void {
    this.router.navigate(["/movie", movieId]);
  }

  // Event 3: Go back to movies
  onGoBack(): void {
    this.router.navigate(["/movies"]);
  }

  // Event 4: Clear all favorites (bulk operation)
  onClearAllFavorites(): void {
    if (confirm("Are you sure you want to remove all favorites?")) {
      if (this.favorites.length === 0) {
        this.successMessage = "No favorites to remove";
        setTimeout(() => (this.successMessage = ""), 3000);
        return;
      }

      const toRemove = [...this.favorites];
      let pending = toRemove.length;
      let failedRemovals = 0;

      toRemove.forEach((favorite) => {
        this.apiService.removeFavorite(favorite.movie).subscribe(
          () => {
            pending--;
            if (pending === 0) {
              if (failedRemovals > 0) {
                this.errorMessage = `Failed to remove ${failedRemovals} favorite(s)`;
              } else {
                this.successMessage = "All favorites removed";
                setTimeout(() => (this.successMessage = ""), 3000);
              }
              this.loadFavorites();
            }
          },
          () => {
            failedRemovals++;
            pending--;
            if (pending === 0) {
              this.errorMessage = `Failed to remove ${failedRemovals} favorite(s)`;
              this.loadFavorites();
            }
          },
        );
      });
    }
  }
}
