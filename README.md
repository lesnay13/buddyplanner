# Buddy Planner

Buddy Planner is a comprehensive application for tracking daily activities, eating habits, and more. It consists of a Django backend and a React (Vite) frontend.
Buddy Planner is a website planner where you can track your daily life, eating habits and mestrual cycles. 
It allows your to share events with friends and create a blog for sharinf experiences. 

## Prerequisites

-   **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
-   **Node.js (v18+) and npm**: [Download Node.js](https://nodejs.org/)

## Project Structure

-   `backend/`: Django backend.
-   `frontend/`: React frontend (Vite).

-------------------------------------------------------------

## 1. Backend Setup (Django)

### Step 1: Navigate to the backend directory
```bash
cd backend
```

### Step 2: Create and Activate Virtual Environment
It is recommended to use a virtual environment to manage dependencies.

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `frontend` directory (same level as `readme.md`) by copying the mock file:

```bash
cp .env.example .env
```

Set at least these values:

```ini
DEBUG=True
SECRET_KEY=django-insecure-dev-key
ZENSERP_API_KEY=your_zenserp_api_key
```

### Step 5: Apply Migrations
Initialize the database:
```bash
python3 manage.py migrate
```

### Step 6: Create a User
You can create a superuser for the admin panel:
```bash
python3 manage.py createsuperuser
```
*Alternatively, use the custom command to create a default user (`admin`/`admin123`):*
```bash
python3 manage.py create_default_user --force
```

### Step 7: Run the Server
```bash
python3 manage.py runserver
```
The backend API will be running at `http://localhost:8000`.

---

## 2. Frontend Setup (React + Vite)

### Step 1: Navigate to the frontend directory
Open a **new terminal** and navigate to `frontend`:
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in `frontend/` by copying the mock file:

```bash
cp .env.example .env
```

Set your frontend variables for API access:
- `VITE_API_URL` for backend base URL
- `VITE_REACT_APP_EDAMAM_API_ID` and `VITE_REACT_APP_EDAMAM_API_KEY` for Recipe Search
- `VITE_REACT_APP_EDAMAM_NUTRITION_ID` and `VITE_REACT_APP_EDAMAM_NUTRITION_KEY` for Nutrition Analysis (or reuse recipe keys if your Edamam app supports both)
- `VITE_REACT_APP_EDAMAM_API_URL` set to `https://api.edamam.com`

### Step 4: Run the Development Server
```bash
npm run dev
```
The frontend will be running at `http://localhost:5173`.

---

## 3. Accessing the App

-   **Frontend**: [http://localhost:5173](http://localhost:5173)
-   **Backend API**: [http://localhost:8000](http://localhost:8000)
-   **Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin)

## API Setup Reference

- Zenserp (Quote of the Day): create key at `https://app.zenserp.com/documentation` and set one of these keys: `ZENSERP_API_KEY` (preferred, `backend/.env`), `VITE_ZENSERP_API_KEY`, or `VITE_REACT_APP_ZENSERP_API_KEY` (supported from existing `frontend/.env`).
- Edamam Recipe API: create key at `https://developer.edamam.com/` and put `VITE_REACT_APP_EDAMAM_API_ID` and `VITE_REACT_APP_EDAMAM_API_KEY` in `frontend/.env`.
- Edamam Nutrition Analysis API: put `VITE_REACT_APP_EDAMAM_NUTRITION_ID` and `VITE_REACT_APP_EDAMAM_NUTRITION_KEY` in `frontend/.env`.

## Current Features

- Home dashboard for authenticated users with containers for this week’s tasks, journal entry, and quote of the day.
- Profile page with separated title styling consistent with other pages.
- Profile picture upload on Profile page, stored via backend `UserProfile.profile_picture`.
- Nutrition page title and shared container styles aligned with dark mode theme variables.

## Troubleshooting

-   **CORS Errors**: The backend is configured to allow requests from `http://localhost:5173` and `http://localhost:3000`. If you use a different port, update `CORS_ALLOWED_ORIGINS` in `buddy/settings.py`.
-   **Port Conflicts**: If port 8000 is busy, Django may fail to start. If port 5173 is busy, Vite will switch to the next available port.