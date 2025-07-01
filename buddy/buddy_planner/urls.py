from django.urls import path, re_path 
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    get_csrf_token,
    TaskListCreateView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.views.generic import TemplateView  
from django.urls import path
from . import views

app_name = 'buddy_planner'

urlpatterns = [
    # Auth endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # CSRF token endpoint 
    path('api/auth/csrf/', get_csrf_token, name='csrf-token'),

    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # Tasks
    path('api/tasks/', TaskListCreateView.as_view(), name='task-list-create'),

    # Frontend catch-all route
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='vite-frontend-catchall'),
]
