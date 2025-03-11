from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from buddy_planner.models import Task, UserProfile, Category, Reminder, RecurringTask, Note, TaskList, Priority, SharedTask
from buddy_planner.serializers import (
    CreateTaskSerializer, TaskSerializer, UserProfileSerializer,
    CategorySerializer, ReminderSerializer, RecurringTaskSerializer,
    NoteSerializer, TaskListSerializer, PrioritySerializer, SharedTaskSerializer
)

def main(request):
    return HttpResponse("Hello")

class TaskReadView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TaskUpdateView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TaskDeleteView(generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class CategoryViewSet(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class ReminderViewSet(generics.ListCreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

class RecurringTaskViewSet(generics.ListCreateAPIView):
    queryset = RecurringTask.objects.all()
    serializer_class = RecurringTaskSerializer
    permission_classes = [IsAuthenticated]

class RecurringTaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecurringTask.objects.all()
    serializer_class = RecurringTaskSerializer
    permission_classes = [IsAuthenticated]

class NoteViewSet(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

class TaskListViewSet(generics.ListCreateAPIView):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer
    permission_classes = [IsAuthenticated]

class TaskListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer
    permission_classes = [IsAuthenticated]

class PriorityViewSet(generics.ListCreateAPIView):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]

class PriorityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]

class SharedTaskViewSet(generics.ListCreateAPIView):
    queryset = SharedTask.objects.all()
    serializer_class = SharedTaskSerializer
    permission_classes = [IsAuthenticated]

class SharedTaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SharedTask.objects.all()
    serializer_class = SharedTaskSerializer
    permission_classes = [IsAuthenticated]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)