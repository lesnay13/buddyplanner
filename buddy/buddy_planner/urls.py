from django.urls import path, include
from django.contrib import admin
from . import views
from rest_framework import generics
from .views import main

urlpatterns = [
    path('task', views.TaskReadView.as_view(), name = 'task'),
    path('task/update', views.TaskUpdateView.as_view(), name = 'taskupdate'),
    path('task/delete', views.TaskDeleteView.as_view(), name = 'taskdelete'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
]