from django.contrib import admin
from .models import Movie, Review, Favorite, Watchlist


admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(Favorite)
admin.site.register(Watchlist)
