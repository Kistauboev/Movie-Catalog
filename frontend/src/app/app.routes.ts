import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { MovieListComponent } from "./components/movie-list/movie-list.component";
import { MovieDetailComponent } from "./components/movie-detail/movie-detail.component";
import { FavoritesComponent } from "./components/favorites/favorites.component";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "movies", component: MovieListComponent },
  { path: "movie/:id", component: MovieDetailComponent },
  { path: "favorites", component: FavoritesComponent },
  { path: "**", redirectTo: "/login" },
];
