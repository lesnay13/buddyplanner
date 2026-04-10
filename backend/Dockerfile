# Use an official Python runtime as a parent image
FROM python:3.11-slim-bookworm as builder

# Set work directory
WORKDIR /usr/src/app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev libpq-dev

# Install python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

# Final stage
FROM python:3.11-slim-bookworm

# Create directory for the app user
RUN mkdir -p /home/app

# Create the app user
RUN addgroup --system app && adduser --system --group app

# Create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev netcat-openbsd
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copy entrypoint.sh
COPY entrypoint.sh $APP_HOME
RUN chmod +x $APP_HOME/entrypoint.sh

# Copy project
COPY . $APP_HOME

# Ensure entrypoint is executable
RUN chmod +x $APP_HOME/entrypoint.sh

# Chown all the files to the app user
RUN chown -R app:app $APP_HOME

# Change to the app user
USER app

# Run entrypoint.sh
ENTRYPOINT ["/home/app/web/entrypoint.sh"]