from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

# Fix relative imports by going up one level
from ..serializers import RegisterSerializer, UserDetailSerializer

User = get_user_model()


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


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        email = (request.data.get("email") or "").strip()

        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user and user.has_usable_password():
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/login?uid={uid}&token={token}"
                send_mail(
                    "BuddyPlanner password reset",
                    f"Use this link to reset your password: {reset_link}",
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )

        return Response(
            {"message": "If an account with that email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")
        password2 = request.data.get("password2")

        if not uid or not token or not password or not password2:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != password2:
            return Response({"password2": ["Password fields didn't match."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired reset link."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password, user)
        except DjangoValidationError as exc:
            return Response({"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save(update_fields=["password"])

        return Response(
            {"message": "Password reset successful. You can now log in."},
            status=status.HTTP_200_OK,
        )


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
