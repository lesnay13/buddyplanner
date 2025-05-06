from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings

class Command(BaseCommand):
    help = 'Creates a default user for development/testing purposes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force create the default user even if ALLOW_DEFAULT_USER is False',
        )

    def handle(self, *args, **options):
        User = get_user_model()

        # Check if default user creation is allowed
        allow_default_user = getattr(settings, 'ALLOW_DEFAULT_USER', False)
        if not (allow_default_user or options['force']):
            self.stdout.write(
                self.style.WARNING('Default user creation is disabled. Use --force to override.')
            )
            return

        # Default credentials
        username = getattr(settings, 'DEFAULT_USER_USERNAME', 'admin')
        email = getattr(settings, 'DEFAULT_USER_EMAIL', 'admin@example.com')
        password = getattr(settings, 'DEFAULT_USER_PASSWORD', 'admin123')

        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))
        except User.DoesNotExist:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created default user: {username}')
            )