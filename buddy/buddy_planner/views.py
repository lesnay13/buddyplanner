from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser # For file uploads
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserProfileSerializer, RegisterSerializer, UserDetailSerializer # Updated imports

# View for User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer # RegisterSerializer is now imported

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # You could return a token here as well if desired,
            # but typically login is a separate step.
            return Response({
                "user": UserDetailSerializer(user, context=self.get_serializer_context()).data, # Changed UserSerializer to UserDetailSerializer
                "message": "User Created Successfully. Please login to get your token.",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for User Profile (Example - you might have this already)
class UserProfileView(generics.RetrieveUpdateAPIView): # Changed from CreateAPIView if it was that
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] # Add parsers for file uploads

    def get_object(self):
        # Retrieve or create the profile for the current user
        # This ensures that a profile object is always available for GET, PUT, PATCH
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    # If you are using signals to create UserProfile, POST might not be needed
    # or could be used for an initial bulk update if desired.
    # The CreateProfilePage.js on the frontend uses POST.
    # If get_or_create in get_object handles creation, a separate POST might be redundant
    # unless you want different logic for creation vs update.
    # For simplicity with get_or_create, RetrieveUpdateAPIView is often enough.
    # If you need a distinct POST for creation:
    # def post(self, request, *args, **kwargs):
    #     # This would be if you don't use get_or_create in get_object for creation
    #     # and want a dedicated POST endpoint for creating a profile.
    #     # However, with OneToOne, it's often simpler to ensure profile exists via get_object or signals.
    #     profile, created = UserProfile.objects.get_or_create(user=request.user)
    #     if not created:
    #         return Response({"detail": "Profile already exists. Use PUT to update."}, status=status.HTTP_400_BAD_REQUEST)
        
    #     serializer = self.get_serializer(profile, data=request.data, partial=False) # Use profile instance
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        # Ensure the user associated with the profile is the request.user
        # This is implicitly handled by get_object, but good to be mindful
        serializer.save(user=self.request.user)


# Login is handled by djangorestframework-simplejwt's TokenObtainPairView
# We just need to wire it up in urls.py