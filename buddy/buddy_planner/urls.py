from django.urls import path
from . import views
from rest_framework import generics

urlpatterns = [
    path('calendar/create', views.CalendarCreateView.as_view(), name = 'calendarcreate'),
    path('calendar', views.CalendarReadView.as_view(), name = 'calendar'),
    path('calendar/update', views.CalendarUpdateView.as_view(), name = 'calendarupdate'),
    path('calendar/delete', views.CalendarDeleteView.as_view(), name = 'calendardelete'),

    path('task/create', views.TaskCreateView.as_view(), name = 'taskcreate'),
    path('task', views.TaskReadView.as_view(), name = 'task'),
    path('task/update', views.TaskUpdateView.as_view(), name = 'taskupdate'),
    path('task/delete', views.TaskDeleteView.as_view(), name = 'taskdelete'),


]