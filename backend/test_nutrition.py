import os
import sys

import requests

APP_ID = os.getenv("EDAMAM_NUTRITION_APP_ID") or (sys.argv[1] if len(sys.argv) > 1 else None)
APP_KEY = os.getenv("EDAMAM_NUTRITION_APP_KEY") or (sys.argv[2] if len(sys.argv) > 2 else None)

if not APP_ID or not APP_KEY:
    print("Missing credentials.")
    print("Usage:")
    print("  EDAMAM_NUTRITION_APP_ID=... EDAMAM_NUTRITION_APP_KEY=... python3 backend/test_nutrition.py")
    print("  python3 backend/test_nutrition.py <APP_ID> <APP_KEY>")
    raise SystemExit(2)

url = f"https://api.edamam.com/api/nutrition-details?app_id={APP_ID}&app_key={APP_KEY}"

headers = {"Content-Type": "application/json"}

data = {"title": "Test Recipe", "ingr": ["1 cup rice", "10 oz chicken"]}

print(f"Testing URL: {url}")
response = requests.post(url, json=data, headers=headers)
print(f"Status Code: {response.status_code}")
print("Response Body:")
print(response.text)