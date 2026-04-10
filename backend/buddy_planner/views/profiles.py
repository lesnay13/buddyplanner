from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from ..models import UserProfile
from ..serializers import UserProfileSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


@login_required
def profile_api(request):
    if request.method == "GET":
        user = request.user
        # Ensure profile exists
        profile, created = UserProfile.objects.get_or_create(user=user)
        return JsonResponse(
            {
                "user": {
                    "username": user.username,
                    "birth_date": profile.birth_date,
                    "phone_number": profile.phone_number,
                },
                "bio": profile.bio,
            }
        )
