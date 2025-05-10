from django.contrib import admin
from .models import UserProfile # Import your UserProfile model
from buddy_planner.models import Task

admin.site.register(Task)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'profile_picture') # Customize as needed
    search_fields = ('user__username', 'user__email', 'bio') # Search by related user fields
    # You can add more customizations here, like list_filter, raw_id_fields for user, etc.

# If you prefer simple registration:
# admin.site.register(UserProfile)
