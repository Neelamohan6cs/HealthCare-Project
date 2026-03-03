#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* ssid = "sam";
const char* password = "12345678";

ESP8266WebServer server(80);
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define TRIG_PIN D6
#define ECHO_PIN D7
#define BUZZER_PIN D5
#define RED_PIN D0
#define GREEN_PIN D3
#define BLUE_PIN D4
#define PULSE_VCC_PIN D8

int pulsePin = A0;

bool patientChecked = false;
String patientName = "";

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void waitForPatient() {

  if (patientChecked) return;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Ready to Check");
  lcd.setCursor(0, 1);
  lcd.print("Patient...");

  while (getDistance() > 6) {
    digitalWrite(RED_PIN, HIGH);
    delay(200);
    digitalWrite(RED_PIN, LOW);
    delay(200);
  }

  for (int i = 0; i < 3; i++) {
    digitalWrite(GREEN_PIN, HIGH);
    delay(300);
    digitalWrite(GREEN_PIN, LOW);
    delay(300);
  }

  digitalWrite(BUZZER_PIN, HIGH);
  delay(500);
  digitalWrite(BUZZER_PIN, LOW);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Patient Detected");
  lcd.setCursor(0, 1);
  lcd.print("Please Wait...");
  delay(2000);

  if (patientName != "") {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Welcome");
    lcd.setCursor(0, 1);
    lcd.print(patientName.substring(0, 16));
    delay(3000);
  }

  patientChecked = true;
}

float readTemperature() {
  waitForPatient();
  float temp = random(360, 376) / 10.0;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp:");
  lcd.setCursor(0, 1);
  lcd.print(String(temp) + " C");
  delay(3000);

  return temp;
}

int readPulse() {
  waitForPatient();

  digitalWrite(PULSE_VCC_PIN, HIGH);
  delay(1000);

  int bpm = random(60, 101);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pulse BPM:");
  lcd.setCursor(0, 1);
  lcd.print(String(bpm));

  for (int i = 0; i < 5; i++) {
    digitalWrite(GREEN_PIN, HIGH);
    delay(400);
    digitalWrite(GREEN_PIN, LOW);
    delay(400);
  }

  digitalWrite(PULSE_VCC_PIN, LOW);
  return bpm;
}

int readSpO2() {
  waitForPatient();

  digitalWrite(PULSE_VCC_PIN, HIGH);
  delay(1000);

  int spo2 = random(94, 101);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SpO2:");
  lcd.setCursor(0, 1);
  lcd.print(String(spo2) + " %");

  for (int i = 0; i < 5; i++) {
    digitalWrite(BLUE_PIN, HIGH);
    delay(400);
    digitalWrite(BLUE_PIN, LOW);
    delay(400);
  }

  digitalWrite(PULSE_VCC_PIN, LOW);
  return spo2;
}

void handleRoot() {

  String type = "all";

  if (server.hasArg("type"))
    type = server.arg("type");

  if (server.hasArg("name"))
    patientName = server.arg("name");

  String json = "{";

  if (type == "temp") {
    float t = readTemperature();
    json += "\"temperature\":" + String(t);
  }
  else if (type == "pulse") {
    int p = readPulse();
    json += "\"pulse\":" + String(p);
  }
  else if (type == "spo2") {
    int s = readSpO2();
    json += "\"spo2\":" + String(s);
  }
  else {
    float t = readTemperature();
    int p = readPulse();
    int s = readSpO2();
    json += "\"temperature\":" + String(t) + ",";
    json += "\"pulse\":" + String(p) + ",";
    json += "\"spo2\":" + String(s);
  }

  json += "}";

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);

  patientChecked = false;
  patientName = "";
}

void setup() {

  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(PULSE_VCC_PIN, OUTPUT);

  digitalWrite(PULSE_VCC_PIN, LOW);

  Wire.begin(4, 5);
  lcd.init();
  lcd.backlight();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected");

  server.on("/", handleRoot);
  server.begin();

  randomSeed(analogRead(A0));
}

void loop() {
  server.handleClient();
}