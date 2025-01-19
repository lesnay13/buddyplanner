from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from buddy_planner.models import Task, Calendar, Month
from buddy_planner.serializers import CalendarSerializer,CreateCalendarSerializer, TaskSerializer,MonthSerializer
from django.urls import reverse_lazy
import json

def main(request):
    return HttpResponse("Hello")


class CreateCalendarView(APIView):
    serializer_class = CreateCalendarSerializer

    def post(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer =self.serializer_class(data=request.data)
        if serializer.is_valid():
            month = serializer.data.get('month')
            day = serializer.data.get('day')
            year = serializer.data.get('year')
            name = self.request.session.session_key
            queryset = Calendar.objects.filter(name=name)
            if queryset.exists():
                calendar = queryset[0]
                calendar.month = month
                calendar.day = day
                calendar.year = year
                calendar.save(update_fields=['month','day','year'])
                return Response(CalendarSerializer(calendar).data, status=status.HTTP_200_OK)
            else:
                calendar = Calendar(name=name, month=month, day=day, year=year)
                calendar.save()
                return Response(CalendarSerializer(calendar).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
                

"""class CalendarCreateView(generics.ListCreateAPIView):
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
"""    

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
