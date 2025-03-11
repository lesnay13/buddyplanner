from rest_framework import serializers
from buddy_planner.models import Task, UserProfile, Category, Reminder, RecurringTask, Note, TaskList, Priority, SharedTask

class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'profile_picture']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'

class RecurringTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringTask
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskList
        fields = '__all__'

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = '__all__'

class SharedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedTask
        fields = '__all__'