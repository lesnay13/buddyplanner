# Docker Deployment Instructions

This project is fully containerized using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Build and Run:**
   ```bash
   docker-compose up --build
   ```
2. **Access the Application:**
   - Frontend: <http://localhost>
   - Backend API: <http://localhost:8000/api/>
   - Admin: <http://localhost:8000/admin/>
3. **Stop Containers:**
   ```bash
   docker-compose down -v
   ```

## Services

- **Frontend**: React application served via Nginx (Port 80).
- **Backend**: Django API running with Gunicorn (Port 8000).
- **Database**: PostgreSQL 15 (Port 5432).

## Database

The database data is persisted in a Docker volume `postgres_data`.

## Troubleshooting

- If the backend fails to connect to the DB, ensure the `db` service is healthy. The `entrypoint.sh` script waits for Postgres to be ready.
## Superuser Management

To manage the application (e.g., access the Django Admin interface), you need a superuser account.

### 1. Create Superuser
Execute the following command while the containers are running:
```bash
docker-compose exec backend python manage.py createsuperuser
```
Follow the prompts to set:
- **Username**: Choose a unique admin username.
- **Email**: Admin contact email.
- **Password**: Use a strong password (at least 12 characters, mixed case, numbers, symbols).

### 2. Verify Access
1. Navigate to [http://localhost:8000/admin/](http://localhost:8000/admin/)
2. Log in with your new credentials.
3. Confirm you can see the dashboard and manage models (Users, Profiles, Tasks).

### 3. Security Best Practices
- **Strong Passwords**: Ensure the password is complex and not reused.
- **Limit Access**: Only create superusers for authorized personnel.
- **Audit Logging**: Django's Admin interface automatically logs all actions (add, change, deletion) performed by superusers. You can view these logs in the "Recent actions" sidebar or the `LogEntry` table in the database.

### 4. Rollback / Deletion
If you need to revoke access or delete a superuser:
1. Log in as another superuser.
2. Go to the **Users** section in Admin.
3. Select the user and delete them, or uncheck "Superuser status" and "Staff status" permissions.

## Development

- The backend code is mounted as a volume, so changes in `backend/` will be reflected (requires restart if not using `runserver`, currently configured for `gunicorn`).
- To use `runserver` for auto-reload, change the `command` in `docker-compose.yml` to:
  `command: python manage.py runserver 0.0.0.0:8000`

