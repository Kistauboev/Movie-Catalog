# 🚀 Quick Start Guide

## Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create database migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (optional - for admin access)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**Backend will run on:** `http://localhost:8000`

- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- API Docs: `http://localhost:8000/swagger/`

---

## Frontend Setup (Angular)

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start development server
npm start
```

**Frontend will run on:** `http://localhost:4200`

---

## First Time Usage

### 1. Create a User Account

- Open `http://localhost:4200` in your browser
- Click "Create one" under the login form
- Fill in username, email, and password
- Click "Register"

### 2. Login

- Enter your username and password
- Click "Login"
- You'll be redirected to the movies list

### 3. Browse Movies

- Scroll through the movie grid
- Use the search bar to find movies by title
- Use the genre filter to filter movies
- Click "View Details" on any movie card

### 4. View Movie Details

- See full movie information
- Read and write reviews
- Add/remove from favorites
- Rate movies (1-10 stars)

### 5. Manage Favorites

- Click the "❤️ Favorites" button in the navbar
- View all your favorite movies
- Remove movies from favorites
- Click a movie to see details

### 6. Logout

- Click "Logout" button in the navbar
- You will be redirected to login page

---

## Testing with Postman

1. **Import the collection:**
   - Open Postman
   - Click "Import"
   - Select `Movie_Catalog_API.postman_collection.json`

2. **Test API endpoints:**
   - Register a new user: `POST /api/auth/register/`
   - Login: `POST /api/auth/login/` (copy the access_token)
   - Set the token in Postman variables (access_token)
   - Test protected endpoints with the token

3. **Example requests are included** with sample request/response bodies

---

## Key Features

✅ **4+ Models with Relationships**

- Movie
- Review (ForeignKey to Movie & User)
- Favorite (ForeignKey to Movie & User)
- Watchlist (OneToOne with User)

✅ **Multiple View Types**

- Serializers: UserSerializer, LoginSerializer, MovieSerializer, ReviewSerializer, FavoriteSerializer, WatchlistSerializer
- FBV: register, login, logout, user_reviews, favorite_movies
- CBV: MovieListCreateView, MovieDetailView

✅ **Authentication & Authorization**

- JWT token-based authentication
- Custom JWTAuthentication class
- Protected endpoints (require login)
- Anonymous access for public endpoints

✅ **Frontend Features**

- Login/Register with form validation
- Movie search and filtering
- Detailed movie views with reviews
- Favorite management
- Rating system (1-10)
- Responsive design
- Error handling with user feedback

---

## Endpoints Reference

| Method | Endpoint                      | Auth | Description           |
| ------ | ----------------------------- | ---- | --------------------- |
| POST   | /api/auth/register/           | No   | Register new user     |
| POST   | /api/auth/login/              | No   | Login and get JWT     |
| POST   | /api/auth/logout/             | Yes  | Logout                |
| GET    | /api/movies/                  | No   | List all movies       |
| GET    | /api/movies/?search=query     | No   | Search movies         |
| GET    | /api/movies/{id}/             | No   | Get movie details     |
| POST   | /api/movies/                  | Yes  | Create movie          |
| PUT    | /api/movies/{id}/             | Yes  | Update movie          |
| DELETE | /api/movies/{id}/             | Yes  | Delete movie          |
| GET    | /api/reviews/                 | Yes  | Get user reviews      |
| POST   | /api/reviews/                 | Yes  | Add review            |
| GET    | /api/favorites/               | Yes  | Get favorites         |
| POST   | /api/favorites/               | Yes  | Add to favorites      |
| DELETE | /api/favorites/?movie_id={id} | Yes  | Remove from favorites |

---

## Environment Setup (Optional)

Create a `.env` file in the backend directory for sensitive settings:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
JWT_SECRET_KEY=your-jwt-secret-key
```

Then update `settings.py` to read from `.env`:

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY', default='django-insecure-...')
DEBUG = config('DEBUG', default=True, cast=bool)
JWT_SECRET_KEY = config('JWT_SECRET_KEY', default='jwt-secret-key-...')
```

---

## Troubleshooting

**Port already in use?**

```bash
# Change Django port
python manage.py runserver 8001

# Change Angular port
ng serve --port 4201
```

**Dependencies issues?**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall packages
rm -rf node_modules package-lock.json
npm install
```

**Database issues?**

```bash
# Reset database
python manage.py flush

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

---

## Project Structure

```
movie-catalog/
├── backend/                          # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── movie_catalog/                # Django project
│   │   ├── settings.py               # Configuration
│   │   ├── urls.py                   # URL routing
│   │   └── wsgi.py
│   └── movies/                       # Movies app
│       ├── models.py                 # Database models
│       ├── serializers.py            # DRF serializers
│       ├── views.py                  # Views (FBV & CBV)
│       ├── urls.py                   # App routing
│       ├── authentication.py         # JWT implementation
│       └── admin.py
│
├── frontend/                         # Angular app
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts                   # Entry point
│       ├── index.html                # HTML template
│       └── app/
│           ├── app.component.ts      # Root component
│           ├── app.routes.ts         # Route definitions
│           ├── models/
│           │   └── interfaces.ts     # TypeScript interfaces
│           ├── services/
│           │   ├── api.service.ts    # API communication
│           │   ├── auth.service.ts   # Auth logic
│           │   └── movie.service.ts  # Movie management
│           ├── interceptors/
│           │   └── jwt.interceptor.ts # JWT token handling
│           └── components/
│               ├── login/            # Auth component
│               ├── movie-list/       # Movie listing
│               ├── movie-detail/     # Movie details
│               └── favorites/        # Favorites component
│
└── Movie_Catalog_API.postman_collection.json

```

---

## Next Steps

1. ✅ Clone/extract the project
2. ✅ Setup Backend (see Backend Setup above)
3. ✅ Setup Frontend (see Frontend Setup above)
4. ✅ Create a user account
5. ✅ Test the application
6. ✅ Explore the Postman collection
7. ✅ Modify and extend as needed!

---

**Happy coding! 🎉**
