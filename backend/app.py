from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, base64, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

load_dotenv()

app = Flask(
    __name__,
    static_folder="../assets",
    static_url_path="/assets"
)

CORS(app)



app = Flask(__name__)
CORS(app)

PLANT_ID_KEY = os.getenv("PLANT_ID_KEY")
PLANTNET_API_KEY = os.getenv("PLANTNET_KEY")


# =========================
# PLANT IDENTIFICATION
# =========================
@app.route("/identify", methods=["POST"])
def identify():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]

    url = f"https://my-api.plantnet.org/v2/identify/all?api-key={PLANTNET_API_KEY}"

    files = [
        ("images", (image.filename, image.stream, image.mimetype))
    ]

    data = {"organs": "auto"}

    response = requests.post(url, files=files, data=data)

    return jsonify(response.json())


# =========================
# PLANT DISEASE ANALYSIS
# =========================
@app.route("/analyze", methods=["POST"])
def analyze():
    image = request.files["image"]
    img_base64 = base64.b64encode(image.read()).decode("utf-8")

    url = "https://api.plant.id/v2/health_assessment"

    headers = {
        "Api-Key": PLANT_ID_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "images": [img_base64],
        "modifiers": ["crops_fast"],
        "disease_details": ["description", "treatment"]
    }

    try:
        res = requests.post(url, json=payload, headers=headers, timeout=15)
        data = res.json()

        if "health_assessment" in data:
            diseases = data["health_assessment"].get("diseases", [])
            if diseases:
                d = diseases[0]

                return jsonify({
                    "name": d["name"],
                    "description": d["disease_details"]["description"],
                    "treatment": "Use neem oil or fungicide",
                    "confidence": round(d["probability"] * 100, 2)
                })

    except Exception as e:
        print(e)

    return jsonify({
        "name": "Common Leaf Disease",
        "description": "Leaf shows signs of infection",
        "treatment": "Use neem oil spray",
        "confidence": 60
    })


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Serve assets (CSS, JS)
@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), filename)


# Homepage
# @app.route('/')
# def home():
#     return send_from_directory(BASE_DIR, 'index.html')


# Plant Identity page
# @app.route('/plant-identity')
# def plant_identity():
#     return send_from_directory(BASE_DIR, 'plant-identity.html')


# Plant Disease page
# @app.route('/plant-disease')
# def plant_disease():
#     return send_from_directory(BASE_DIR, 'plant-disease.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
