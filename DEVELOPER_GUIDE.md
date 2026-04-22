# 👨‍💻 Movie Catalog - Developer Guide

## Common Commands

### Backend Development

**Setup Backend Environment**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run development server on port 8000
python manage.py runserver

# Run on different port
python manage.py runserver 8001
```

**Django Management**

```bash
# Create new migration after model changes
python manage.py makemigrations movies

# Apply pending migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations

# Create superuser for admin
python manage.py createsuperuser

# Access Django shell (interactive Python)
python manage.py shell

# Remove all data and reset database
python manage.py flush

# Collect static files for production
python manage.py collectstatic
```

**Database Queries in Shell**

```python
python manage.py shell << EOF
from movies.models import Movie
from django.contrib.auth.models import User

# Create a movie
Movie.objects.create(
    title="Example Movie",
    description="Example description",
    release_date="2024-01-01",
    rating=8.5,
    genre="Drama"
)

# Query movies
movies = Movie.objects.all()
for movie in movies:
    print(movie.title)

# Filter movies
scifi_movies = Movie.objects.filter(genre="Science Fiction")

# Delete a movie
Movie.objects.filter(id=1).delete()
EOF
```

---

### Frontend Development

**Setup Frontend Environment**

```bash
cd frontend

# Install npm dependencies
npm install

# Start development server on port 4200
npm start

# Start on different port
ng serve --port 4201

# Build for production
npm run build

# Build with optimization
ng build --configuration production

# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

**Angular CLI Commands**

```bash
# Generate new component
ng generate component components/new-component

# Generate new service
ng generate service services/new-service

# Generate guard
ng generate guard guards/auth.guard

# Generate module
ng generate module shared

# List all available schematics
ng schematics --help
```

---

## Debugging

### Backend Debugging

**Django Debug Toolbar**

```bash
# Install debug toolbar
pip install django-debug-toolbar

# Add to INSTALLED_APPS in settings.py
INSTALLED_APPS = [
    ...
    'debug_toolbar',
]

# Add to MIDDLEWARE
MIDDLEWARE = [
    ...
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# Add to URLs
urlpatterns = [
    ...
] + path('__debug__/', include('debug_toolbar.urls'))
```

**Django Shell Debug**

```bash
python manage.py shell

>>> from movies.models import Movie, Review
>>> movie = Movie.objects.first()
>>> reviews = movie.reviews.all()
>>> print(reviews)
```

**View Errors in Django**

```python
# In views.py
import logging
logger = logging.getLogger(__name__)

# Then use in views
logger.debug(f"Movie ID: {movie_id}")
logger.error(f"Error: {str(error)}")
```

### Frontend Debugging

**Angular DevTools**

```
1. Install Angular DevTools browser extension
2. Open DevTools (F12)
3. Go to Angular tab
4. Inspect components and services
```

**Console Logging**

```typescript
// In components/services
console.log("Debug message:", variable);
console.error("Error:", error);
console.warn("Warning:", warning);
```

**Network Tab Debugging**

```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform API calls
4. Click request to see:
   - Request headers (Authorization, Content-Type)
   - Request payload
   - Response status and data
```

**Storage Debugging**

```
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Check stored values:
   - access_token
   - currentUser
```

---

## Common Issues & Solutions

### CORS Issues

**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solutions:**

```python
# Check CORS settings in backend/movie_catalog/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
]

# Add your frontend URL if different
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Different port
    'http://localhost:4200',  # Standard Angular port
]

# Make sure CORS middleware is in correct position
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Must be here, after SessionMiddleware
    'django.middleware.common.CommonMiddleware',
    ...
]
```

### JWT Token Issues

**Problem:** "Invalid token" or "Token has expired"

**Solutions:**

```typescript
// Check if token is stored
console.log(localStorage.getItem("access_token"));

// Check token format (should start with "eyJ")
const token = localStorage.getItem("access_token");
console.log(token?.substring(0, 20)); // Show first 20 chars

// Clear and re-login
localStorage.removeItem("access_token");
localStorage.removeItem("currentUser");
// Navigate to login and login again
```

### Port Already in Use

**Problem:** "Address already in use"

**Solutions:**

```bash
# Change Django port
python manage.py runserver 8001

# Change Angular port
ng serve --port 4201

# Or kill the process using the port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti :8000 | xargs kill -9
```

### Dependencies Issues

**Problem:** npm install fails or dependency conflicts

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Force install specific version
npm install @angular/core@17.0.0

# Python dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Database Issues

**Problem:** Migration errors or database locked

**Solutions:**

```bash
# Reset entire database (CAUTION: deletes all data)
python manage.py flush

# Recreate migrations
python manage.py makemigrations
python manage.py migrate

# Check migration status
python manage.py showmigrations

# Manually delete migration file if corrupted:
# 1. Delete files in movies/migrations/ (except __init__.py)
# 2. Run makemigrations and migrate again
```

### API Not Returning Data

**Problem:** Endpoints returning empty arrays or no data

**Solutions:**

```bash
# Check data exists in database
python manage.py shell

>>> from movies.models import Movie
>>> Movie.objects.count()  # Should be > 0
>>> Movie.objects.all().values()  # List all movies

# Add test data
>>> Movie.objects.create(
...     title="Test Movie",
...     description="Test description",
...     release_date="2024-01-01",
...     rating=8.5,
...     genre="Test"
... )
```

---

## Performance Tips

### Backend Optimization

```python
# Use select_related for ForeignKey
movies = Movie.objects.select_related('user')

# Use prefetch_related for reverse relations
movies = Movie.objects.prefetch_related('reviews')

# Use only() to fetch specific fields
movies = Movie.objects.only('id', 'title', 'rating')

# Use values() for dictionary response
movie_data = Movie.objects.values('id', 'title', 'rating')

# Use exists() instead of count > 0
if Movie.objects.filter(id=1).exists():
    # ...

# Paginate large result sets
from rest_framework.pagination import PageNumberPagination
```

### Frontend Optimization

```typescript
// Use OnPush change detection
@Component({
  selector: 'app-movie',
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Unsubscribe to prevent memory leaks
private destroy$ = new Subject<void>();

ngOnInit() {
  this.movieService.movies$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(movies => {
    this.movies = movies;
  });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// Use trackBy for ngFor
trackByMovieId(index: number, movie: Movie): number {
  return movie.id;
}

// In template: @for (movie of movies; track trackByMovieId($index, $item))
```

---

## Testing

### Backend Testing

```bash
# Run tests
python manage.py test

# Run specific test
python manage.py test movies.tests.MovieTestCase

# Run with verbosity
python manage.py test --verbosity=2

# Test coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

**Example Test**

```python
from django.test import TestCase
from movies.models import Movie

class MovieTestCase(TestCase):
    def setUp(self):
        Movie.objects.create(
            title="Test Movie",
            description="Test",
            release_date="2024-01-01",
            rating=8.5,
            genre="Test"
        )

    def test_movie_creation(self):
        movie = Movie.objects.get(title="Test Movie")
        self.assertEqual(movie.rating, 8.5)
```

### Frontend Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --code-coverage

# Run e2e tests
npm run e2e

# Run specific test file
ng test --include='**/movie.service.spec.ts'
```

---

## Deployment Preparation

### Backend

```python
# Update settings.py for production
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Use environment variables
import os
from decouple import config

SECRET_KEY = config('SECRET_KEY')
JWT_SECRET_KEY = config('JWT_SECRET_KEY')

# Database: Use PostgreSQL instead of SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# CORS: Update allowed origins
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# Collect static files
python manage.py collectstatic --noinput
```

### Frontend

```bash
# Build for production
npm run build

# Build output: dist/movie-catalog/

# Test production build locally
npx http-server dist/movie-catalog/
```

---

## Useful Resources

### Django

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)

### Angular

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [RxJS Documentation](https://rxjs.dev/)

### APIs & Testing

- [Postman](https://www.postman.com/)
- [JWT.io](https://jwt.io/) - JWT decoder
- [Swagger/OpenAPI](https://swagger.io/)

---

## Development Workflow

### Making a Change

1. **Identify the change location**
   - Backend change? → Modify backend files
   - Frontend change? → Modify frontend files

2. **Make the change**
   - Update code
   - Update tests (if applicable)

3. **Test locally**
   - Run dev server: `python manage.py runserver` & `npm start`
   - Browser: `http://localhost:4200`
   - Test in Postman

4. **Check for errors**
   - Browser console (F12)
   - Python console/logs
   - Network tab

5. **Commit changes**
   ```bash
   git add .
   git commit -m "Clear message describing change"
   git push
   ```

---

## Quick Reference

| Task             | Command                                         |
| ---------------- | ----------------------------------------------- |
| Start backend    | `python manage.py runserver`                    |
| Start frontend   | `npm start`                                     |
| Create model     | `Edit models.py` → `makemigrations` → `migrate` |
| Create component | `ng generate component components/name`         |
| Run tests        | `npm test` or `python manage.py test`           |
| View API docs    | `http://localhost:8000/swagger/`                |
| Access admin     | `http://localhost:8000/admin/`                  |
| View console     | Browser F12 or Terminal                         |

---

**Happy coding! 🚀**
