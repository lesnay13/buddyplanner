from rest_framework import serializers
from buddy_planner.models import Task, Calendar, Month

class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model:Task
        fields= '__all__' 

class TaskSerializer(serializers.ModelSerializer):
  class Meta:
        model:Task
        fields= '__all__' 