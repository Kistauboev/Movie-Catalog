from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Movie(models.Model):
    """
    Movie model to store movie information
    """
    CATEGORY_MOVIE = 'movie'
    CATEGORY_CARTOON = 'cartoon'
    CATEGORY_BOLLYWOOD = 'bollywood'
    CATEGORY_SERIES = 'series'
    CATEGORY_CHOICES = [
        (CATEGORY_MOVIE, 'Movie'),
        (CATEGORY_CARTOON, 'Cartoon'),
        (CATEGORY_BOLLYWOOD, 'Bollywood'),
        (CATEGORY_SERIES, 'Series'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    release_date = models.DateField()
    poster_url = models.URLField(max_length=500, blank=True)
    rating = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        default=0
    )
    genre = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default=CATEGORY_MOVIE
    )
    director = models.CharField(max_length=255, blank=True)
    cast = models.TextField(blank=True)
    runtime = models.IntegerField(help_text="Runtime in minutes", null=True, blank=True)
    imdb_id = models.CharField(max_length=50, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Review(models.Model):
    """
    Review model with ForeignKey relationship to Movie and User
    """
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('movie', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Favorite(models.Model):
    """
    Favorite model with ForeignKey relationship to Movie and User
    """
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='favorites')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_movies')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('movie', 'user')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Watchlist(models.Model):
    """
    Watchlist model for storing movies to watch
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='watchlist')
    movies = models.ManyToManyField(Movie, related_name='in_watchlists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Watchlist"

    class Meta:
        ordering = ['-created_at']
