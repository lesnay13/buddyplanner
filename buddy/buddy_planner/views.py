from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import (
    UserProfileSerializer, 
    RegisterSerializer, 
    UserDetailSerializer, 
    MyTokenObtainPairSerializer
)

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.utils.decorators import method_decorator # Import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
''
@ensure_csrf_cookie
@api_view(['GET'])
def get_csrf_token(request):
    print("🔐 Django view hit: CSRF cookie should be set")
    return JsonResponse({'message': 'CSRF cookie set'})


# Apply the method_decorator for CSRF exemption
@method_decorator(csrf_exempt, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['post'] 

    def post(self, request, *args, **kwargs):
        # 👇 Log the incoming payload for debugging
        print("🔍 Incoming registration payload:", request.data)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserDetailSerializer(user, context={"request": request}).data,
                "message": "User created successfully. Please log in to get your token."
            }, status=status.HTTP_201_CREATED)

        print("❌ Registration errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'detail': 'User created successfully'}, status=status.HTTP_201_CREATED)
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


def profile_api(request):
    if request.method == 'GET':
        profile = request.user.userprofile
        return JsonResponse({
            'user': {
                'username': request.user.username,
                'birth_date': profile.birth_date,
                'phone_number': profile.phone_number
            },
            'bio': profile.bio
        })
