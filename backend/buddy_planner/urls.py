from django.urls import path, re_path
from .views.auth import (
    CustomTokenObtainPairView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView,
    get_csrf_token,
)
from .views.profiles import UserProfileView
from .views.tasks import TaskListCreateView, TaskDetailView, JournalEntryListCreateView, JournalEntryUpsertView
from .views.proxy import proxy_edamam_api, proxy_edamam_nutrition
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from django.views.generic import TemplateView

app_name = "buddy_planner"

urlpatterns = [
    # Auth endpoints
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/register/", RegisterView.as_view(), name="auth-register"),
    path("api/auth/password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("api/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    # CSRF token endpoint
    path("api/auth/csrf/", get_csrf_token, name="csrf-token"),
    path("csrf-token/", get_csrf_token, name="csrf-token"),
    # User profile
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    # Tasks
    path("api/tasks/", TaskListCreateView.as_view(), name="task-list-create"),
    path("api/tasks/<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    # Journal
    path("api/journals/", JournalEntryListCreateView.as_view(), name="journal-list-create"),
    path("api/journals/upsert/", JournalEntryUpsertView.as_view(), name="journal-upsert"),
    # Proxy Endpoints
    path('api/proxy/edamam/', proxy_edamam_api, name='proxy_edamam_api'),
    path('api/proxy/nutrition/', proxy_edamam_nutrition, name='proxy_edamam_nutrition'),

    # Frontend catch-all route
    re_path(
        r"^(?!admin|static|media).*$",
        TemplateView.as_view(template_name="index.html"),
        name="vite-frontend-catchall",
    ),
]
