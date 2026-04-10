from datetime import date
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import Task, JournalEntry
from ..serializers import TaskSerializer, JournalEntrySerializer


# For listing and creating tasks
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure user has a profile
        if hasattr(self.request.user, "userprofile"):
            return Task.objects.filter(created_by=self.request.user.userprofile)
        return Task.objects.none()

    def perform_create(self, serializer):
        # Ensure user has a profile
        if hasattr(self.request.user, "userprofile"):
            serializer.save(created_by=self.request.user.userprofile)


# For detail/update/delete of a specific task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, "userprofile"):
            return Task.objects.filter(created_by=self.request.user.userprofile)
        return Task.objects.none()


class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, "userprofile"):
            return JournalEntry.objects.filter(user=self.request.user.userprofile)
        return JournalEntry.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, "userprofile"):
            entry_date = serializer.validated_data.get("entry_date") or date.today()
            serializer.save(user=self.request.user.userprofile, entry_date=entry_date)


class JournalEntryUpsertView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not hasattr(request.user, "userprofile"):
            return Response({"detail": "Profile required."}, status=status.HTTP_400_BAD_REQUEST)

        payload = request.data.copy()
        entry_date = payload.get("entry_date") or date.today()
        entry, _ = JournalEntry.objects.get_or_create(user=request.user.userprofile, entry_date=entry_date)
        serializer = JournalEntrySerializer(entry, data=payload, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user.userprofile, entry_date=entry_date)
        return Response(serializer.data, status=status.HTTP_200_OK)
