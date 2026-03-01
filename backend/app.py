import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app) 

def generate_random_sensor(sensor_type):
    if sensor_type == "temp":
        return round(random.uniform(36.0, 39.5), 1)
    if sensor_type == "pulse":
        return random.randint(60, 120)
    if sensor_type == "spo2":
        return random.randint(94, 100)
    return None


@app.route("/", methods=["GET"])
def get_sensor():
    sensor_type = request.args.get("type")
    value = generate_random_sensor(sensor_type)
    if value is None:
        return jsonify({"error": "Invalid sensor type"}), 400
    if sensor_type == "temp":
        return jsonify({"temperature": value})
    if sensor_type == "pulse":
        return jsonify({"pulse": value})
    if sensor_type == "spo2":
        return jsonify({"spo2": value})


@app.route("/temperature", methods=["POST"])
def temperature_post():
    data = request.get_json()
    if not data or data.get("name") is None:
        return jsonify({"error": "Name is required"}), 400

    name = data.get("name")
    temp_value = round(random.uniform(36.0, 37.5), 1)
    return jsonify({
        "name": name,
        "temperature": temp_value
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    temperature = data.get("temperature")
    pulse = data.get("pulse")
    spo2 = data.get("spo2")

    prediction = "Normal"
    accuracy = "96%"

    if temperature and temperature > 38:
        prediction = "Fever Detected"
        accuracy = "94%"
    elif pulse and pulse > 110:
        prediction = "High Pulse Rate"
        accuracy = "93%"
    elif spo2 and spo2 < 95:
        prediction = "Low SpO2 Detected"
        accuracy = "92%"

    return jsonify({
        "prediction": prediction,
        "accuracy": accuracy,
        "timestamp": datetime.now().isoformat()
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)