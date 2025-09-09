// === Yarrow Beta 3D Prototype ===
// Contrôle LED, ventilateur, pompe via ESP8266 + relais

// Broches des relais
#define RELAY_LED 5
#define RELAY_FAN 4
#define RELAY_PUMP 14

void setup() {
  // Initialisation des relais
  pinMode(RELAY_LED, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_PUMP, OUTPUT);

  // Tout éteint au démarrage
  digitalWrite(RELAY_LED, HIGH);
  digitalWrite(RELAY_FAN, HIGH);
  digitalWrite(RELAY_PUMP, HIGH);

  Serial.begin(115200);
  Serial.println("Systeme Beta 3D pret.");
}

void loop() {
  // Exemple de commandes via Serial Monitor (USB)
  if (Serial.available()) {
    char cmd = Serial.read();

    if (cmd == 'L') { digitalWrite(RELAY_LED, LOW); Serial.println("LED ON"); }
    if (cmd == 'l') { digitalWrite(RELAY_LED, HIGH); Serial.println("LED OFF"); }

    if (cmd == 'F') { digitalWrite(RELAY_FAN, LOW); Serial.println("FAN ON"); }
    if (cmd == 'f') { digitalWrite(RELAY_FAN, HIGH); Serial.println("FAN OFF"); }

    if (cmd == 'P') { digitalWrite(RELAY_PUMP, LOW); Serial.println("PUMP ON"); }
    if (cmd == 'p') { digitalWrite(RELAY_PUMP, HIGH); Serial.println("PUMP OFF"); }
  }
}
