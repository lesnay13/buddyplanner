from django.urls import path, include
from django.contrib import admin
from . import views
from rest_framework import generics
from .views import main

urlpatterns = [
    path('calendar/create', views.CreateCalendarView.as_view(), name = 'calendarcreate'),
    #path('calendar', views.CalendarReadView.as_view(), name = 'calendar'),
    path('calendar/update', views.CalendarUpdateView.as_view(), name = 'calendarupdate'),
    path('calendar/delete', views.CalendarDeleteView.as_view(), name = 'calendardelete'),

    path('task', views.TaskReadView.as_view(), name = 'task'),
    path('task/update', views.TaskUpdateView.as_view(), name = 'taskupdate'),
    path('task/delete', views.TaskDeleteView.as_view(), name = 'taskdelete'),

   
    path('month', views.MonthReadView.as_view(), name = 'month'),
    path('month/update', views.MonthUpdateView.as_view(), name = 'monthupdate'),
    path('month/delete', views.MonthUpdateView.as_view(), name = 'monthdelete'),
    
]