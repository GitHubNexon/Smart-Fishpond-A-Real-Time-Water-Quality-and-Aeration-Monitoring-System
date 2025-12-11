#include <WiFi.h>

const char* ssid = "Jayem";
const char* password = "00000000";

void setup() {
  Serial.begin(115200);
  Serial.println("Connecting to WiFi...");

  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  const unsigned long timeout = 15000; // 15 seconds

  while (WiFi.status() != WL_CONNECTED &&
         millis() - startAttemptTime < timeout) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();

  // Check final status
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } 
  else if (WiFi.status() == WL_NO_SSID_AVAIL) {
    Serial.println("❌ Failed: WiFi network not found!");
  } 
  else if (WiFi.status() == WL_CONNECT_FAILED) {
    Serial.println("❌ Failed: Incorrect password!");
  } 
  else {
    Serial.println("❌ Failed: Connection timeout!");
  }
}

void loop() {}
