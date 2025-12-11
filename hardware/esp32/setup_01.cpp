void setup() {
  pinMode(2, OUTPUT); // Most ESP32 boards have LED on GPIO2
}

void loop() {
  digitalWrite(2, HIGH);
  delay(500);
  digitalWrite(2, LOW);
  delay(500);
}
