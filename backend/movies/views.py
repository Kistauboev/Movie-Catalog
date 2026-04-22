from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Movie, Review, Favorite, Watchlist
from .serializers import (
    UserSerializer, LoginSerializer, MovieSerializer,
    ReviewSerializer, FavoriteSerializer
)
from .authentication import create_access_token


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Function-Based View for user registration
    """
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not all([username, email, password]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Function-Based View for user login with JWT token generation
    """
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not all([username, password]):
            return Response(
                {'error': 'Missing username or password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = create_access_token(user)
        return Response({
            'access_token': token,
            'user': UserSerializer(user).data
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Function-Based View for logout (token invalidation on client side)
    """
    return Response({'message': 'Logout successful'})


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_reviews(request):
    """
    Function-Based View for user's reviews
    GET: List user's reviews
    POST: Create/update a review for a movie
    DELETE: Delete user's review by review_id
    """
    if request.method == 'GET':
        movie_id = request.query_params.get('movie_id')
        if movie_id:
            reviews = Review.objects.filter(movie_id=movie_id)
        else:
            reviews = Review.objects.filter(user=request.user)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        movie_id = request.data.get('movie')
        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not all([movie_id, rating, comment]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response(
                {'error': 'Movie not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        review, created = Review.objects.get_or_create(
            movie=movie,
            user=request.user,
            defaults={'rating': rating, 'comment': comment}
        )

        if not created:
            review.rating = rating
            review.comment = comment
            review.save()

        serializer = ReviewSerializer(review)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    elif request.method == 'DELETE':
        review_id = request.query_params.get('review_id')

        if not review_id:
            return Response(
                {'error': 'review_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response(
                {'error': 'Review not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        review.delete()
        return Response({'message': 'Review deleted successfully'})


class MovieListCreateView(APIView):
    """
    Class-Based View for listing all movies and creating new ones
    GET: List all movies with pagination
    POST: Create a new movie (admin only)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """Get all movies"""
        search_query = request.query_params.get('search', '')
        genre_filter = request.query_params.get('genre', '')
        category_filter = request.query_params.get('category', '')
        year_filter = request.query_params.get('year', '')

        movies = Movie.objects.all()

        if search_query:
            movies = movies.filter(
                title__icontains=search_query
            ) | movies.filter(description__icontains=search_query)

        if genre_filter:
            movies = movies.filter(genre__icontains=genre_filter)

        if category_filter:
            movies = movies.filter(category__iexact=category_filter)

        if year_filter:
            try:
                movies = movies.filter(release_date__year=int(year_filter))
            except ValueError:
                return Response(
                    {'error': 'Year must be a valid number'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new movie (requires authentication)"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailView(APIView):
    """
    Class-Based View for retrieving, updating, and deleting a specific movie
    """
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        """Get movie details"""
        movie = self.get_object(pk)
        if not movie:
            return Response(
                {'error': 'Movie not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = MovieSerializer(movie)
        return Response(serializer.data)



@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorite_movies(request):
    """
    Function-Based View for managing favorite movies
    GET: List user's favorite movies
    POST: Add movie to favorites
    DELETE: Remove movie from favorites (movie_id in query params)
    """
    if request.method == 'GET':
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        movie_id = request.data.get('movie_id')

        if not movie_id:
            return Response(
                {'error': 'movie_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response(
                {'error': 'Movie not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        favorite, created = Favorite.objects.get_or_create(
            movie=movie,
            user=request.user
        )

        if created:
            return Response(
                FavoriteSerializer(favorite).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'message': 'Movie already in favorites'},
            status=status.HTTP_200_OK
        )

    elif request.method == 'DELETE':
        movie_id = request.query_params.get('movie_id')

        if not movie_id:
            return Response(
                {'error': 'movie_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            favorite = Favorite.objects.get(movie_id=movie_id, user=request.user)
            favorite.delete()
            return Response({'message': 'Removed from favorites'})
        except Favorite.DoesNotExist:
            return Response(
                {'error': 'Favorite not found'},
                status=status.HTTP_404_NOT_FOUND
            )

