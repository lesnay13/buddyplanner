from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Task, UserProfile, User
from django.utils import timezone

class TaskModelTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        # Create a user profile
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )

    def test_create_task(self):
        """Test Task creation"""
        task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            start_time=timezone.now(),
            end_time=timezone.now(),
            created_by=self.user_profile,
            location='Test Location'
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.description, 'Test Description')
        self.assertEqual(task.created_by, self.user_profile)

    def test_task_str_method(self):
        """Test the string representation of Task"""
        task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            start_time=timezone.now(),
            end_time=timezone.now(),
            created_by=self.user_profile
        )
        self.assertEqual(str(task), 'Test Task')
