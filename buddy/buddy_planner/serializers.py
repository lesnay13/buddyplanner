from rest_framework import serializers
from buddy_planner.models import Task, Calendar, Month

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = '__all__' 

class CreateCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model= Calendar
        fields= ('month', 'day', 'year')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:  
        model = Task
        fields = '__all__' 

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = '__all__' 