from django.db import models
import string
import random
from django.contrib.auth.models import AbstractUser, Group, Permission



"""def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Task.objects.filter(code=code).count == 0:
            break
            
    return code
"""


class Task(models.Model):
    name = models.CharField(max_length=255,null=True)
    description = models.CharField(max_length=355,null=True)
    date = models.DateTimeField()

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_date = models.DateTimeField()
    
    def __str__(self):
        return self.title

class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    groups = models.ManyToManyField(
        Group, related_name='buddy_user_set', blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission, related_name='buddy_user_permissions_set', blank=True
    )

    def __str__(self):
        return self.username
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)

    def __str__(self):
        return self.user.username