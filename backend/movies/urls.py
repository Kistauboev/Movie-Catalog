from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),

    # Movie endpoints
    path('movies/', views.MovieListCreateView.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),

    # Review endpoints
    path('reviews/', views.user_reviews, name='user-reviews'),

    # Favorite endpoints
    path('favorites/', views.favorite_movies, name='favorite-movies'),
]
