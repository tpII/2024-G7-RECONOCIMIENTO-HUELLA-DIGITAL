#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);  // Definimos los pines TX/RX
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t p;
int fingerPresentCount = 0;  // Contador para verificar si realmente hay un dedo

void setup() {
  Serial.begin(9600);
  while (!Serial); // Espera a que se inicie la conexión serie
  delay(100);
  Serial.println("Inicializando sensor de huellas...");

  // Inicializa el sensor a 57600 baudios
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Sensor de huellas conectado correctamente.");
  } else {
    Serial.println("No se puede conectar con el sensor de huellas.");
    while (1) { delay(1); } // Espera indefinidamente si el sensor no se conecta
  }
}

void loop() {
  // Obtiene la imagen del dedo
  p = finger.getImage();
  
  if (p == FINGERPRINT_OK) {
    fingerPresentCount++; // Incrementa el contador cuando se detecta un dedo
    if (fingerPresentCount > 2) { // Si se detecta 3 veces consecutivas
      Serial.println("Dedo detectado.");
      fingerPresentCount = 0;  // Reinicia el contador
    }
  } else if (p == FINGERPRINT_NOFINGER) {
    fingerPresentCount = 0; // Reinicia el contador si no hay dedo
    Serial.println("No hay dedo presente.");
  } else {
    fingerPresentCount = 0; // Reinicia el contador en caso de error
    Serial.println("Error al leer el sensor.");
  }
  
  delay(500);  // Pausa corta entre lecturas
}