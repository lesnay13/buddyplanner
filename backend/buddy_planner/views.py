from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import UserProfile, Task
from .serializers import (
    UserProfileSerializer,
    RegisterSerializer,
    UserDetailSerializer,
    MyTokenObtainPairSerializer,
    TaskSerializer,
)

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.utils.decorators import method_decorator  # Import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from rest_framework.permissions import AllowAny

""


@ensure_csrf_cookie
@api_view(["GET"])
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})


# Apply the method_decorator for CSRF exemption
@method_decorator(csrf_exempt, name="dispatch")
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": UserDetailSerializer(
                        user, context={"request": request}
                    ).data,
                    "message": "User created successfully. Please log in to get your token.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"detail": "User created successfully"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


@login_required
def profile_api(request):
    if request.method == "GET":
        user = request.user
        profile = user.userprofile
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


# For listing and creating tasks
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user.profile)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.profile)


# For detail/update/delete of a specific task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user.profile)


# Add these imports at the top
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


# Add this new view
@csrf_exempt
def proxy_edamam_api(request):
    if request.method == "GET":
        query = request.GET.get("q", "")
        app_id = request.GET.get("app_id", "")
        app_key = request.GET.get("app_key", "")

        # Forward the request to Edamam API
        edamam_url = f"https://api.edamam.com/api/recipes/v2?type=public&q={query}&app_id={app_id}&app_key={app_key}"

        # Add User ID header for apps with Active User Tracking enabled
        headers = {
            "Edamam-Account-User": "buddy_user"
        }
        
        response = requests.get(edamam_url, headers=headers)
        
        # Return the response from Edamam API
        return JsonResponse(response.json(), status=response.status_code)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def proxy_edamam_nutrition(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            app_id = request.GET.get("app_id", "")
            app_key = request.GET.get("app_key", "")

            # Edamam Nutrition Analysis API endpoint
            edamam_url = f"https://api.edamam.com/api/nutrition-details?app_id={app_id}&app_key={app_key}"

            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(edamam_url, json=data, headers=headers)
            
            return JsonResponse(response.json(), status=response.status_code)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)
