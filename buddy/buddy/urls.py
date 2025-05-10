from django.contrib import admin
from django.urls import path, include
from django.conf import settings # For media files
from django.conf.urls.static import static # For media files

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('buddy_planner.urls')), # Include your app's URLs under /api/
    # The lines below were redundant and have been removed:
    # path('/api/auth/register/', RegisterView.as_view(), name="register"),
    # path('/api/auth/login/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # path('/api/auth/token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
]

# Serve media files during development (for profile pictures)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# The commented out lines below can be removed if they are just notes
# Step 6: Include App URLs in Project URLs (`buddy/buddy/urls.py`)
# Modify `/Users/yanselflores/Documents/Repos/My_Planner_APP/buddy/buddy/urls.py`: # This line was causing the error
