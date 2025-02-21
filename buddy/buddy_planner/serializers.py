from rest_framework import serializers
from buddy_planner.models import Task, UserProfile

class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model:Task
        fields= '__all__' 

class TaskSerializer(serializers.ModelSerializer):
  class Meta:
        model:Task
        fields= '__all__' 

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Serialize the user field as a string
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'profile_picture']