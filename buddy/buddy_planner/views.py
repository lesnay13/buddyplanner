from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from buddy_planner.models import Task, Calendar, Month
from buddy_planner.serializers import CalendarSerializer,TaskSerializer,MonthSerializer
from django.urls import reverse_lazy
import json

def main(request):
    return HttpResponse("Hello")

class CalendarCreateView(generics.ListCreateAPIView):
    model = Calendar
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()

    def create(self, request, *args, **kwargs):
        json_data = request.data
        serializer = self.get_serializer(data=json_data)
        serializer.is_valid(raise_exception=True)
        calendar = Calendar(**json_data)
        calendar.save()
        result = "successfully saved calendar"
        return Response(result, status=status.HTTP_200_OK)
    

class CalendarReadView(generics.ListCreateAPIView):
    model = Calendar
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()

    def get_queryset(self, *args, **kwargs):
        qs = super(CalendarReadView, self).get_queryset(*args, **kwargs)
        qs = qs.order_by("-id")
        return qs


class CalendarUpdateView(generics.ListCreateAPIView):
    model = Calendar
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()


class CalendarDeleteView(generics.ListCreateAPIView):
    model = Calendar
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()


class TaskCreateView(generics.ListCreateAPIView):
    model = Task
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

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

class MonthCreateView(generics.ListCreateAPIView):
    model = Month
    serializer_class = MonthSerializer
    queryset = Month.objects.all()

class MonthReadView(generics.ListCreateAPIView):
    model = Month
    serializer_class = MonthSerializer
    queryset = Month.objects.all()

class MonthUpdateView(generics.ListCreateAPIView):
    model = Month
    serializer_class = MonthSerializer
    queryset = Month.objects.all()

class MonthDeleteView(generics.ListCreateAPIView):
    model = Month
    serializer_class = MonthSerializer
    queryset = Month.objects.all()
