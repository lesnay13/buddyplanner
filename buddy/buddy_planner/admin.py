from django.contrib import admin
from buddy_planner.models import Task, Calendar, Month

admin.site.register(Calendar)
admin.site.register(Task)
admin.site.register(Month)
