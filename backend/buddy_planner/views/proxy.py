import requests
import json
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
