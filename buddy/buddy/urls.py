from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # For media files
from django.conf.urls.static import static  # For media files

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('buddy_planner.urls')),  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
