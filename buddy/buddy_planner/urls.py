from django.urls import path
from . import views
from rest_framework import generics

urlpatterns = [
    path('buddy_planner/', views.CalendarView.as_view(), name ='buddy_planner')
]