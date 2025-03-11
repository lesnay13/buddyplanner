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
    
    # Category URLs
    path('categories/', views.CategoryViewSet.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # Reminder URLs
    path('reminders/', views.ReminderViewSet.as_view(), name='reminder-list'),
    path('reminders/<int:pk>/', views.ReminderDetailView.as_view(), name='reminder-detail'),
    
    # RecurringTask URLs
    path('recurring-tasks/', views.RecurringTaskViewSet.as_view(), name='recurring-task-list'),
    path('recurring-tasks/<int:pk>/', views.RecurringTaskDetailView.as_view(), name='recurring-task-detail'),
    
    # Note URLs
    path('notes/', views.NoteViewSet.as_view(), name='note-list'),
    path('notes/<int:pk>/', views.NoteDetailView.as_view(), name='note-detail'),
    
    # TaskList URLs
    path('task-lists/', views.TaskListViewSet.as_view(), name='task-list-list'),
    path('task-lists/<int:pk>/', views.TaskListDetailView.as_view(), name='task-list-detail'),
    
    # Priority URLs
    path('priorities/', views.PriorityViewSet.as_view(), name='priority-list'),
    path('priorities/<int:pk>/', views.PriorityDetailView.as_view(), name='priority-detail'),
    
    # SharedTask URLs
    path('shared-tasks/', views.SharedTaskViewSet.as_view(), name='shared-task-list'),
    path('shared-tasks/<int:pk>/', views.SharedTaskDetailView.as_view(), name='shared-task-detail'),
]