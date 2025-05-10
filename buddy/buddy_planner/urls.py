from django.urls import path, include
from django.contrib import admin
from . import views
from rest_framework import generics

from django.urls import path
from .views import RegisterView, UserProfileView # Ensure these are the views you have
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

app_name = 'buddy_planner'

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    
    # Profile endpoint (example)
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    # Add other app-specific urls here
]