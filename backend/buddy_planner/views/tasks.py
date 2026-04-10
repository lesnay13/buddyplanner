from datetime import date
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import Task, JournalEntry, UserProfile
from ..serializers import TaskSerializer, JournalEntrySerializer


def get_or_create_profile(user):
    profile = getattr(user, "profile", None)
    if profile:
        return profile
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile


# For listing and creating tasks
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = get_or_create_profile(self.request.user)
        return Task.objects.filter(created_by=profile)

    def perform_create(self, serializer):
        profile = get_or_create_profile(self.request.user)
        serializer.save(created_by=profile)


# For detail/update/delete of a specific task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = get_or_create_profile(self.request.user)
        return Task.objects.filter(created_by=profile)


class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = get_or_create_profile(self.request.user)
        return JournalEntry.objects.filter(user=profile)

    def perform_create(self, serializer):
        profile = get_or_create_profile(self.request.user)
        entry_date = serializer.validated_data.get("entry_date") or date.today()
        serializer.save(user=profile, entry_date=entry_date)


class JournalEntryUpsertView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = get_or_create_profile(request.user)
        payload = request.data.copy()
        entry_date = payload.get("entry_date") or date.today()
        entry, _ = JournalEntry.objects.get_or_create(user=profile, entry_date=entry_date)
        serializer = JournalEntrySerializer(entry, data=payload, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=profile, entry_date=entry_date)
        return Response(serializer.data, status=status.HTTP_200_OK)
