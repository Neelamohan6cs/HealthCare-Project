import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)


datas = pd.read_excel("health.xlsx")


le = LabelEncoder()
datas["Gender"] = le.fit_transform(datas["Gender"])


X = datas[["Gender", "Age", "Temperature_C", "Pulse_BPM", "SpO2_%"]]
y = datas["Health_Status"].map({"Normal": 1, "Not Normal": 0})


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

accuracy = round(model.score(X_test, y_test) * 100, 2)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    age = data.get("age")
    pulse = data.get("pulse", 0)
    spo2 = data.get("spo2", 98)
    temperature = data.get("temperature", 36.6)
    gender = data.get("gender", "Male")

    if age is None:
        return jsonify({"error": "Age is required"}), 400

    gender_enc = 1 if gender == "Male" else 0

    input_data = pd.DataFrame([[
        gender_enc,
        age,
        temperature,
        pulse,
        spo2
    ]], columns=["Gender", "Age", "Temperature_C", "Pulse_BPM", "SpO2_%"])

    prediction = model.predict(input_data)[0]
    result = "Normal" if prediction == 1 else "Not Normal"

    return jsonify({
        "prediction": result,
        "accuracy": f"{accuracy}%"
    })

if __name__ == "__main__":
    app.run(debug=True)