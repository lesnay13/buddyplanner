from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from buddy_planner.models import Task, UserProfile
from buddy_planner.serializers import CreateTaskSerializer, TaskSerializer, UserProfileSerializer
from django.urls import reverse_lazy
import json

def main(request):
    return HttpResponse("Hello")


class CreateTaskView(APIView):
    serializer_class = CreateTaskSerializer

    def post(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer =self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            date = serializer.data.get('date')
            queryset = Task.objects.filter(name=name)
            if queryset.exists():
                task = queryset[0]
                task.name = name
                task.description = description
                task.date = date
                task.save(update_fields=['name','description','date'])
                return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
            else:
                task = Task(name=name, description=description, date=date,)
                task.save()
                return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
                

"""class TaskCreateView(APIView):
    model = Task
    queryset = Task.objects.all()

    serializer_class = CreateTaskSerialzer

    def post(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer =self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            date = serializer.data.get('date')
            name = self.request.session.session_key
            queryset = Task.objects.filter(name=name)
            if queryset.exists():
                task = queryset[0]
                task.description = description
                task.date = date
                task.save(update_fields=['name','description','date',])
                return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
            else:
                task = Task(name=name, description=description, date=date)
                task.save()
                return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)"""
    
class TaskReadView(generics.ListCreateAPIView):
    model = Task
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class TaskUpdateView(generics.ListCreateAPIView):
    model = Task
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class TaskDeleteView(generics.ListCreateAPIView):
    model = Task
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=404)

    def put(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)