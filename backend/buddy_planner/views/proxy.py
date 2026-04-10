import os
import random
import requests
import json
from pathlib import Path
from dotenv import dotenv_values
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def proxy_edamam_api(request):
    if request.method == "GET":
        query = request.GET.get("q", "")
        app_id = request.GET.get("app_id", "")
        app_key = request.GET.get("app_key", "")

        # Forward the request to Edamam API
        edamam_url = f"https://api.edamam.com/api/recipes/v2?type=public&q={query}&app_id={app_id}&app_key={app_key}"

        # Add User ID header for apps with Active User Tracking enabled
        headers = {"Edamam-Account-User": "buddy_user"}

        try:
            response = requests.get(edamam_url, headers=headers)
            return JsonResponse(response.json(), status=response.status_code)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def resolve_zenserp_api_key():
    direct_key = (
        os.getenv("ZENSERP_API_KEY")
        or os.getenv("VITE_ZENSERP_API_KEY")
        or os.getenv("VITE_REACT_APP_ZENSERP_API_KEY")
        or ""
    ).strip()
    if direct_key:
        return direct_key

    base_dir = Path(__file__).resolve().parents[3]
    frontend_env = base_dir / "frontend" / ".env"
    if frontend_env.exists():
        values = dotenv_values(frontend_env)
        return (
            values.get("ZENSERP_API_KEY")
            or values.get("VITE_ZENSERP_API_KEY")
            or values.get("VITE_REACT_APP_ZENSERP_API_KEY")
            or ""
        ).strip()
    return ""


@csrf_exempt
def proxy_zenserp_quote(request):
    api_key = resolve_zenserp_api_key()

    if api_key:
        try:
            response = requests.get(
                "https://app.zenserp.com/api/v2/search",
                headers={"apikey": api_key},
                params={"q": "motivational quote", "hl": "en", "gl": "us", "num": 20},
                timeout=10,
            )
            payload = response.json() if response.content else {}
            organic = payload.get("organic", []) if isinstance(payload, dict) else []

            candidates = []
            for item in organic:
                snippet = (item.get("snippet") or "").strip()
                title = (item.get("title") or "").strip()
                if snippet:
                    candidates.append(snippet)
                elif title:
                    candidates.append(title)

            if candidates:
                return JsonResponse({"quote": random.choice(candidates), "source": "zenserp"}, status=200)
        except Exception:
            pass

    try:
        quote_response = requests.get("https://zenquotes.io/api/random", timeout=10)
        quote_payload = quote_response.json() if quote_response.content else []
        if isinstance(quote_payload, list) and quote_payload:
            quote_item = quote_payload[0] if isinstance(quote_payload[0], dict) else {}
            quote_text = (quote_item.get("q") or "").strip()
            author = (quote_item.get("a") or "").strip()
            if quote_text:
                full_quote = f"{quote_text} — {author}" if author else quote_text
                return JsonResponse({"quote": full_quote, "source": "zenquotes"}, status=200)
    except Exception:
        pass

    return JsonResponse({"error": "Unable to fetch an internet quote right now."}, status=503)


@csrf_exempt
def proxy_edamam_nutrition(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            app_id = request.GET.get("app_id", "")
            app_key = request.GET.get("app_key", "")

            # Edamam Nutrition Analysis API endpoint
            edamam_url = f"https://api.edamam.com/api/nutrition-details?app_id={app_id}&app_key={app_key}"

            headers = {"Content-Type": "application/json"}

            response = requests.post(edamam_url, json=data, headers=headers)

            return JsonResponse(response.json(), status=response.status_code)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)
