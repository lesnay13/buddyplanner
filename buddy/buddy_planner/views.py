from django.http import HttpResponse
from django.template import loader
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from buddy_planner.models import Task, Calendar, Month
from buddy_planner.serializers import CalendarSerializer

def buddy_planner(request):
    template = loader.get_template('myfirst.html')
    return HttpResponse (template.render())

class CalendarView(generics.ListCreateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [IsAdminUser]

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = CalendarSerializer(queryset, many=True)
        return HttpResponse(serializer.data)