# 🎬 Movie Catalog Application

A full-stack web application for browsing, searching, and managing favorite movies built with **Angular** (frontend) and **Django + Django REST Framework** (backend).

---

## 📌 Features

### Frontend (Angular 17+)

- ✅ User authentication (Login/Register) with JWT tokens
- ✅ Browse and search movies with real-time filters
- ✅ View detailed movie information
- ✅ Add/remove movies from favorites with persistent storage
- ✅ Submit and view reviews for movies
- ✅ Responsive design with modern CSS styling
- ✅ HTTP interceptor for JWT token management
- ✅ Form validation with reactive forms (NgModel)
- ✅ Conditional rendering with @if directive
- ✅ Loop rendering with @for directive
- ✅ 4+ click events triggering API requests
- ✅ 4+ form controls using [(ngModel)]

### Backend (Django + DRF)

- ✅ 4+ database models (Movie, Review, Favorite, Watchlist)
- ✅ Multiple ForeignKey relationships
- ✅ JWT token-based authentication
- ✅ 2+ Function-Based Views (FBV) with DRF decorators
- ✅ 2+ Class-Based Views (CBV) with APIView
- ✅ 2+ Serializer classes and 2+ ModelSerializer classes
- ✅ Full CRUD operations for movies
- ✅ User-linked data for favorites and reviews
- ✅ CORS configuration for Angular dev server
- ✅ Comprehensive error handling
- ✅ API documentation with Swagger/Redoc

---

## 🛠 Tech Stack

### Frontend

- **Angular 17+** - Modern web framework
- **TypeScript** - Typed JavaScript
- **RxJS** - Reactive programming
- **FormsModule** - Form handling with ngModel
- **HttpClient** - API communication

### Backend

- **Django 4.2** - Python web framework
- **Django REST Framework 3.14** - REST API toolkit
- **PyJWT 2.8** - JWT token handling
- **django-cors-headers 4.3** - CORS support
- **SQLite** - Database (default)

---

## 📋 Requirements Met

### Backend Requirements ✅

- [x] At least 4 models (Movie, Review, Favorite, Watchlist)
- [x] At least 2 ForeignKey relationships
- [x] 2+ Serializer classes (UserSerializer, LoginSerializer)
- [x] 2+ ModelSerializer classes (MovieSerializer, ReviewSerializer, FavoriteSerializer)
- [x] 2+ FBV with DRF decorators (register, login, logout, user_reviews, favorite_movies)
- [x] 2+ CBV with APIView (MovieListCreateView, MovieDetailView)
- [x] Token-based JWT authentication
- [x] Login/logout endpoints
- [x] Full CRUD for movies
- [x] User-linked favorites and reviews
- [x] CORS configuration
- [x] Postman collection included

### Frontend Requirements ✅

- [x] Interfaces and services for API communication
- [x] 4+ click events (onLogin, onRegister, onSearch, onFilterByGenre, onViewDetails, onViewFavorites, onAddToFavorites, onRemoveFromFavorites, onSubmitReview, etc.)
- [x] 4+ form controls with [(ngModel)] (username, password, email, searchQuery, genreFilter, newReviewRating, newReviewComment)
- [x] CSS styling applied to all components
- [x] Routing module with 3+ named routes (login, movies, movie detail, favorites)
- [x] JWT authentication with HTTP interceptor
- [x] Login/logout functionality
- [x] @for and @if for Angular 17+ syntax
- [x] 1+ Angular Service using HttpClient (ApiService, MovieService, AuthService)
- [x] Graceful error handling with user feedback

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Create virtual environment**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Create migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

5. **Load sample data (optional)**

   ```bash
   python manage.py shell << EOF
   from movies.models import Movie
   from datetime import date

   Movie.objects.create(
       title="Inception",
       description="A thief who steals corporate secrets through dreams",
       release_date=date(2010, 7, 16),
       poster_url="https://via.placeholder.com/300x450",
       rating=8.8,
       genre="Science Fiction",
       director="Christopher Nolan",
       cast="Leonardo DiCaprio, Marion Cotillard",
       runtime=148,
       imdb_id="tt1375666"
   )
   EOF
   ```

6. **Run development server**

   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`
   - API: `http://localhost:8000/api/`
   - Admin: `http://localhost:8000/admin/`
   - Swagger: `http://localhost:8000/swagger/`

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:4200`

3. **Build for production**
   ```bash
   npm run build
   ```

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/logout/` - Logout

### Movies

- `GET /api/movies/` - List all movies (with search and genre filter)
- `GET /api/movies/{id}/` - Get movie details
- `POST /api/movies/` - Create movie (authenticated)
- `PUT /api/movies/{id}/` - Update movie (authenticated)
- `DELETE /api/movies/{id}/` - Delete movie (authenticated)

### Reviews

- `GET /api/reviews/` - Get user's reviews
- `POST /api/reviews/` - Add review to movie

### Favorites

- `GET /api/favorites/` - Get user's favorite movies
- `POST /api/favorites/` - Add movie to favorites
- `DELETE /api/favorites/?movie_id={id}` - Remove movie from favorites

---

## 🧪 Testing with Postman

1. **Import Collection**
   - Open Postman
   - Click "Import" and select `Movie_Catalog_API.postman_collection.json`

2. **Set Access Token Variable**
   - Login endpoint returns `access_token`
   - Copy the token and set it in Postman variables
   - Use `{{access_token}}` in headers for protected endpoints

3. **Example Workflow**
   ```
   1. Register user (POST /api/auth/register/)
   2. Login (POST /api/auth/login/) - save access_token
   3. Get movies (GET /api/movies/)
   4. Get movie detail (GET /api/movies/1/)
   5. Add to favorites (POST /api/favorites/)
   6. Get favorites (GET /api/favorites/)
   7. Add review (POST /api/reviews/)
   8. Logout (POST /api/auth/logout/)
   ```

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. HTTP interceptor adds token to Authorization header
5. Backend validates token on protected routes
6. On logout, token is removed from storage and localStorage

---

## 📁 Project Structure

```
movie-catalog/
├── backend/                    # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── movie_catalog/          # Project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── movies/                 # Movies app
│       ├── models.py           # 4 models with ForeignKey
│       ├── serializers.py      # Serializers & ModelSerializers
│       ├── views.py            # FBV & CBV
│       ├── urls.py
│       ├── authentication.py    # JWT implementation
│       └── admin.py
│
├── frontend/                   # Angular Frontend
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.html
│       ├── main.ts
│       ├── app/
│       │   ├── app.component.ts
│       │   ├── app.routes.ts    # Routing (3+ routes)
│       │   ├── models/
│       │   │   └── interfaces.ts    # Interfaces
│       │   ├── services/
│       │   │   ├── api.service.ts   # HttpClient
│       │   │   ├── auth.service.ts  # Auth logic
│       │   │   └── movie.service.ts # Movie logic
│       │   ├── interceptors/
│       │   │   └── jwt.interceptor.ts # JWT token handling
│       │   └── components/
│       │       ├── login/      # Login & Register (4+ ngModel forms)
│       │       ├── movie-list/ # Search & Filter (4+ click events)
│       │       ├── movie-detail/ # Reviews & Details
│       │       └── favorites/  # Favorite management
│       └── styles.css
│
└── Movie_Catalog_API.postman_collection.json  # Postman collection
```

---

## 🎯 Key Implementation Details

### Forms & Input Binding

- **ngModel binding** for 2-way data binding: `[(ngModel)]="property"`
- Used in: Login, Search, Filter, Review forms (4+ instances)

### Event Handling

- **Click events**: `(click)="handler()"`
- **Form submission**: `(ngSubmit)="handler()"`
- Examples: Login, Register, Search, Filter, Add Favorite, Submit Review (4+ events)

### Conditional Rendering

- **Angular 17+ syntax**: `@if (condition) { content } @else { fallback }`
- Used for: Error messages, loading states, empty states, auth checks

### Data Looping

- **Angular 17+ syntax**: `@for (item of array; track item.id) { content }`
- Used for: Movie lists, reviews, favorites

### Styling

- **Global CSS**: `global.css` with variables and resets
- **Component CSS**: Scoped styles for each component
- **Responsive**: Mobile-first design with media queries
- **Modern**: Gradient backgrounds, transitions, hover effects

---

## 🔒 Security Considerations

1. **JWT Token Storage**: Stored in localStorage (consider upgrading to secure httpOnly)
2. **CORS**: Configured for localhost (update for production)
3. **CSRF Protection**: Django default protection enabled
4. **Password Hashing**: Django's default password hashing
5. **SSL/TLS**: Use HTTPS in production

---

## 🐛 Troubleshooting

### CORS Issues

- Ensure backend is running on `http://localhost:8000`
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Token Not Persisting

- Check localStorage in browser DevTools
- Verify JWT interceptor is added to HTTP_INTERCEPTORS

### API Calls Failing

- Check network tab in DevTools
- Verify backend is running
- Check token is valid (not expired)

### Migration Issues

```bash
python manage.py makemigrations movies
python manage.py migrate
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Movie Catalog Application - Full Stack Demo

**Built with Angular 17+ & Django REST Framework**

---

## ✨ Thank You

This application demonstrates professional full-stack development practices with:

- Proper separation of concerns
- JWT-based authentication
- RESTful API design
- Type-safe TypeScript code
- Modern Angular patterns (standalone components)
- Comprehensive error handling
- "Production-ready" structure
