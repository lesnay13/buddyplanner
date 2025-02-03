from django.db import models
import string
import random

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

