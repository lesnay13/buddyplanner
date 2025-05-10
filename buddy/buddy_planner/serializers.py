from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Task, Category, Reminder, RecurringTask, Note, TaskList, Priority, SharedTask # Import all necessary models
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import User 

class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category # Now Category should be defined
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder # Now Reminder should be defined
        fields = '__all__'

class RecurringTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringTask # Now RecurringTask should be defined
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note 
        fields = '__all__'

class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskList 
        fields = '__all__'

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority 
        fields = '__all__'

class SharedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedTask 
        fields = '__all__'

# Example: If you have a UserSerializer for registration, it might look like this:
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'first_name', 'last_name')

# Serializer for User details to be nested in UserProfileSerializer if needed
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True) # Display user details, read-only
    # If you want to allow updating user fields via profile endpoint, configure 'user' field accordingly
    # Or, provide a separate endpoint for user details update.

    # To make profile_picture writable and handle file uploads:
    profile_picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'bio', 'profile_picture') # Add other fields from your UserProfile model
        # Example: fields = ('id', 'user', 'bio', 'profile_picture', 'location', 'birth_date')

    def update(self, instance, validated_data):
        # Handle profile picture update carefully if it's optional
        # If 'profile_picture' is not in validated_data, it means it wasn't sent or was null.
        # If it was sent as null, DRF handles setting it to null if allow_null=True.
        # If it's not sent at all, it won't be in validated_data, and the existing picture remains.
        # If you want to clear the picture if an empty value is sent, you might need custom logic.
        # For now, default behavior should be fine.
        return super().update(instance, validated_data)

# Ensure your RegisterSerializer (if it exists) is correctly defined
# For example, if you have a RegisterSerializer:
class RegisterSerializer(serializers.ModelSerializer): # Uncommented this line
#     password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    # We make password write-only for security (it won't be included in response)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    profile = UserProfileSerializer(required=False) # For creating profile along with user

    class Meta:
        model = User
        # List all fields that can be included in a request or a response
        fields = ['id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name', 'birth_date', 'phone_number', 'profile']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},  
            'email': {'required': True}, 
        }

    def validate_email(self, value):
        """
        Check that the email is unique.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, attrs):
        """
        Check that the two password entries match
        """
        if attrs['password'] != attrs.pop('password2'): # Remove password2 after validation
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        return attrs

    @transaction.atomic # Ensure user and profile are created together or not at all
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''), 
            last_name=validated_data.get('last_name', ''),   
            birth_date=validated_data.get('birth_date'),
            phone_number=validated_data.get('phone_number')
        )
        
        # Create UserProfile
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            UserProfile.objects.create(user=user) # Create an empty profile

        return user