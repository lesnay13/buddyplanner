from django.db import models

class Calendar(models.Model):
    name = models.CharField(max_length=255,null=True)
    month = models.CharField(max_length=255,null=True)
    day = models.PositiveIntegerField(default=1)
    year = models.PositiveIntegerField(default=1997)

class Task(models.Model):
    name = models.CharField(max_length=255,null=True)
    description = models.CharField(max_length=355,null=True)
    date = models.DateTimeField()
    calendar_id = models.PositiveIntegerField(null=True)


class Month(models.Model):
    name = models.CharField(max_length=50,null=True)
    day = models.PositiveIntegerField(default=1)   