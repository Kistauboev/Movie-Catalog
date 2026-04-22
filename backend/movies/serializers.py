from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, Review, Favorite, Watchlist


class UserSerializer(serializers.Serializer):
    """
    Basic Serializer for User data (not ModelSerializer)
    """
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    is_staff = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data.get('password', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login (username and password)
    """
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class MovieSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Movie data with all fields
    """
    reviews_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'description', 'release_date', 'poster_url',
            'rating', 'genre', 'category', 'director', 'cast', 'runtime', 'imdb_id',
            'reviews_count', 'favorites_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_favorites_count(self, obj):
        return obj.favorites.count()


class ReviewSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Review data
    """
    username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'movie', 'movie_title', 'user', 'username',
            'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class FavoriteSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Favorite movies
    """
    movie_detail = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'movie', 'movie_detail', 'user', 'added_at']
        read_only_fields = ['id', 'user', 'added_at']


class WatchlistSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Watchlist
    """
    movies_detail = MovieSerializer(source='movies', many=True, read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'movies', 'movies_detail', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
