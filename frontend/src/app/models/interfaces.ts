// Movie interface
export interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  rating: number;
  genre: string;
  category: string;
  director: string;
  cast: string;
  runtime: number;
  imdb_id: string;
  reviews_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
}

// Review interface
export interface Review {
  id: number;
  movie: number;
  movie_title: string;
  user: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Favorite interface
export interface Favorite {
  id: number;
  movie: number;
  movie_detail: Movie;
  user: number;
  added_at: string;
}

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

// Login response interface
export interface LoginResponse {
  access_token: string;
  user: User;
}
