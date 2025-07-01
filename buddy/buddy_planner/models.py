from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models.signals import post_save  # Import post_save
from django.dispatch import receiver  # Import receiver


class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name="buddy_user_set", blank=True)
    user_permissions = models.ManyToManyField(
        Permission, related_name="buddy_user_permissions_set", blank=True
    )

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pics/", blank=True, null=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

    # Optional: Signal to create or update UserProfile when a User is created/saved
    @receiver(post_save, sender=User)
    def create_or_update_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)
        else:
            # Check if profile exists, if not create it (e.g., for existing users without profiles)
            UserProfile.objects.get_or_create(user=instance)
        instance.profile.save()

        def __str__(self):
            return self.user.username


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE
    )  # A user created this Task
    location = models.CharField(max_length=255, blank=True)
    is_all_day = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # HEX color code for the category

    def __str__(self):
        return self.name


class Reminder(models.Model):
    task = models.ForeignKey(Task, related_name="reminders", on_delete=models.CASCADE)
    reminder_time = models.DateTimeField()  # When to remind user
    method = models.CharField(
        max_length=20, choices=[("email", "Email"), ("notification", "Notification")]
    )

    def __str__(self):
        return f"Reminder for {self.task.title} at {self.reminder_time}"


class RecurringTask(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE)
    recurrence_rule = models.CharField(max_length=255)  # e.g., "every Monday at 9 AM"

    def __str__(self):
        return f"Recurring Task for {self.task.title}"


class Note(models.Model):
    task = models.ForeignKey(Task, related_name="notes", on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.user.username} on {self.task.title}"


class TaskList(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Priority(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField()  # e.g., 1 - low, 2 - medium, 3 - high

    def __str__(self):
        return self.name


class SharedTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    shared_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shared Task {self.task.title} with {self.user.username}"
