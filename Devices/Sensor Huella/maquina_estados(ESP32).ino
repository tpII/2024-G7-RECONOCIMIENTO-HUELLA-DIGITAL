#include <Adafruit_Fingerprint.h>
#include "pitches.h"
#include <Wire.h>
#include <rgb_lcd.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

HardwareSerial mySerial(2);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
// VARIABLES DEL PROGRAMA

// LED /////////////////////////////////////
#define RGB_GREEN 25
#define RGB_BLUE 4
#define RGB_RED 15

#define espera 300
#define duracion 500  // 5 segundos
// BUZZER //////////////////////////////////
#define BUZZZER_PIN 5

// LCD /////////////////////////////////////
rgb_lcd lcd;
int colorR = 0;
int colorG = 0;
int colorB = 255;
int tamDisplay = 16;

byte check[8] = {
  B00000,
  B00001,
  B00001,
  B00010,
  B00010,
  B00100,
  B10100,
  B01000,
};

byte neg[8] = {
  B00000,
  B10001,
  B01010,
  B00100,
  B00100,
  B01010,
  B10001,
  B00000,
};


// HUELLA DACTILAR /////////////////////////
uint8_t p = 0;
uint8_t fingerPresentCount = 0;  // Contador para verificar si realmente hay un dedo
uint8_t estado = 1;              // Estado inicial (1: Lectura constante)
uint8_t nuevoEstado = 0;
uint8_t aux = 1;
///////////////////////////////////////////

// WIFI ////////////////////////////////

// Configuración de la red WiFi
//const char* ssid = "Marian's Room";
//const char* password = "Mariansexo1551";
const char* ssid = "Milo J 2.4GHz";
const char* password = "01444650814";


// Crear el servidor HTTP en el puerto 80
WebServer server(80);

// Configuración del broadcast
WiFiUDP udp;
const int broadcastPort = 12345; // Puerto para el broadcast
const char* broadcastMessage = "DISCOVER_BACKEND"; // Mensaje de descubrimiento

// Variable global para guardar la dirección IP del backend
String backendIP = "";

// Recibidos en Peticiones
String username;
int fingerprintId;
////////////////////////////////////////


void apagarRGB() {
  pinMode(RGB_RED, 255);
  pinMode(RGB_GREEN, 255);
  pinMode(RGB_BLUE, 255);
  delay(200);
}

void setup() {

  // LED SETUP
  pinMode(RGB_RED, OUTPUT);
  pinMode(RGB_GREEN, OUTPUT);
  pinMode(RGB_BLUE, OUTPUT);
  // LCD SETUP
  lcd.begin(16, 2);                    // Inicializa el LCD
  lcd.setRGB(colorR, colorG, colorB);  // Establece el color del fondo
  lcd.createChar(0, check);
  lcd.createChar(1, neg);

  // Fijar el texto en la segunda fila
  lcd.setCursor(6, 1);  // Coloca el cursor en la segunda fila
  continuoLCD();

  // HUELLA Y SERIAL SETUP
  Serial.begin(115200);
  while (!Serial)
    ;
  delay(500);
  Serial.println("Inicializando sensor de huellas...");
  mySerial.begin(57600, SERIAL_8N1, 16, 17);
  delay(250);
  if (finger.verifyPassword()) {
    Serial.println(F("Sensor de huellas conectado correctamente."));
    // Cambiar el estado según la entrada recibida (0, 1, 2, o 3)
    Serial.println("Ingrese un estado: ");
    Serial.println("1: Lectura constante");
    Serial.println("2: Registrar huella");
    Serial.println("3: Borrar una huella en particular");
    Serial.println("4: Borrar toda la base de datos");
    Serial.println("5: Cantidad de huellas almacenadas en la base de datos");
  } else {
    Serial.println("No se puede conectar con el sensor de huellas.");
    while (1) { delay(1); }  // Espera indefinidamente si el sensor no se conecta
  }

  // WIFI Setup
  WiFi.begin(ssid, password);
  Serial.println("Estableciendo conexión a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nConectado a la red con IP: ");
  Serial.println(WiFi.localIP());

  // Inicializar el cliente UDP
  udp.begin(broadcastPort);

  // Enviar mensaje de broadcast
  sendBroadcast();

  // Endpoints
  server.on("/sendData", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      String body = server.arg("plain");

      // Parseo del JSON
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, body);
      if (error) {
        server.send(400, "application/json", "{\"message\":\"Invalid JSON\"}");
        Serial.println("Error al parsear JSON");
        return;
      }

      // Asignar valores de JSON a variables
      username = doc["username"].as<String>();
      fingerprintId = doc["idFingerprint"].as<int>();

      Serial.println("Datos recibidos:");
      Serial.println("Username: " + username);
      Serial.print("ID de Huella: ");
      Serial.println(fingerprintId);

      // Cambiar estado para iniciar el proceso de registro de huella
      estado = 2;

      server.send(200, "text/plain", "Datos recibidos y procesados en ESP32");

    } else {
      server.send(400, "application/json", "{\"message\":\"No JSON data found\"}");
    }
  });

  server.on("/deleteFingerprint", HTTP_DELETE, []() {
     if (server.hasArg("plain")) {
      String body = server.arg("plain");

      // Parseo del JSON
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, body);
      if (error) {
        server.send(400, "application/json", "{\"message\":\"Invalid JSON\"}");
        Serial.println("Error al parsear JSON");
        return;
      }

      // Asignar valores de JSON a variables
      fingerprintId = doc["idFingerprint"].as<int>();

      Serial.println("Datos recibidos para borrar la huella:");
      Serial.print("ID de Huella: ");
      Serial.println(fingerprintId);

      estado = 3;

    server.send(200, "text/plain", "Delete recibido en ESP32");
    Serial.println("Delete Recibido");
  }
});

  server.on("/deleteBD", HTTP_POST, []() {
    estado = 4;
    server.send(200, "text/plain", "Delete BD recibido en ESP32");
    Serial.println("Delete BD Recibido");
  });

  

  server.on("/contHuellas", HTTP_POST, []() {
    estado = 5;
    server.send(200, "text/plain", "CantHuellas");
    Serial.println("CantHuellas recibido");
  });

  // Iniciar el servidor
  server.begin();
}

void sendBroadcast() {
    Serial.println("Enviando mensaje de broadcast...");
    udp.beginPacket("255.255.255.255", broadcastPort); // Broadcast a toda la red
    udp.write((const uint8_t*)broadcastMessage, strlen(broadcastMessage));
    udp.endPacket();
    Serial.println("Mensaje de broadcast enviado");
}

void listenForResponse() {
    int packetSize = udp.parsePacket();
    if (packetSize) {
        char incomingPacket[255];
        int len = udp.read(incomingPacket, 255);
        if (len > 0) {
            incomingPacket[len] = '\0';
        }

        Serial.print("Respuesta recibida: ");
        Serial.println(incomingPacket);

        // Procesar respuesta para extraer la dirección IP del backend
        if (strstr(incomingPacket, "BACKEND_IP:") != nullptr) {
            backendIP = String(incomingPacket).substring(11); // Extraer la IP del backend
            Serial.print("Dirección IP del backend almacenada: ");
            Serial.println(backendIP);

        }
    }
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  while (num == 0) {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
    Serial.flush();
  }
  return num;
}

void loop() {
  server.handleClient();  // Manejar peticiones de los clientes

  // Escuchar respuestas del servidor backend
  listenForResponse();

  // Máquina de estados
  switch (estado) {
    case 1:
      continuoLCD();
      LecturaConstante();
      estado = 1;
      break;
    case 2:
      registrarHuellaLCD();
      RegistrarHuella();
      estado = 1;
      break;
    case 3:
      BorrarHuella();
      estado = 1;
      break;
    case 4:
      BorrarBaseDeDatos();
      estado = 1;
      break;
    case 5:
      CantidadHuellas();
      estado = 1;
      break;
    default:
      estado = 1;
      break;
  }
  delay(500);
}

uint8_t detectarHuella() {
  p = finger.getImage();  // Captura la imagen de la huella

  if (p == FINGERPRINT_OK) {
    p = finger.image2Tz();  // Convierte la imagen a plantilla

    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Imagen convertida en plantilla");
        return FINGERPRINT_OK;  // Retornar OK si la plantilla se creó correctamente
      case FINGERPRINT_IMAGEMESS:
        Serial.println("La imagen tomada no es buena");
        return p;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Error de comunicación");
        return p;
      case FINGERPRINT_FEATUREFAIL:
      case FINGERPRINT_INVALIDIMAGE:
        //Serial.println("No hay dedo presente o imagen inválida");
        return p;
      default:
        Serial.println("Error desconocido");
        return p;
    }
  } else if (p == FINGERPRINT_NOFINGER) {
    //Serial.println("No hay dedo presente.");
    return p;
  } else {
    Serial.println("Error al leer el sensor.");
    return p;
  }
}

// Función para buscar la huella en la base de datos
uint8_t buscarHuella() {
  p = finger.fingerFastSearch();  // Busca la huella en la base de datos

  if (p == FINGERPRINT_OK) {
    huellaEncontrada();  // Llama a la función que maneja la huella encontrada
    return FINGERPRINT_OK;
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Error de comunicación");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    huellaNoEncontrada();  // Llama a la función que maneja la huella no encontrada
    return p;
  } else {
    Serial.println("Error desconocido");
    return p;
  }
}

void LecturaConstante() {
  uint8_t resultado = detectarHuella();

  if (resultado == FINGERPRINT_OK) {
    // Si se detectó y convirtió correctamente la huella, procede a buscarla
    Serial.println("Huella detectada y convertida a plantilla, intentando búsqueda en BD...");
    buscarHuella();
  } else {
    Serial.println("No se pudo detectar una huella válida.");
  }
}


void sendEmail(int success, int idUserFingerprint) {
  // Enviar datos al servidor backend
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String serverURL = "http://" + backendIP + ":5050/logs/";
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");

        // Crear el cuerpo de la solicitud con JSON
        int id = -1;
        String jsonPayload = "{\"success\":\"" + String(success) + "\",\"idUserFingerprint\":" + String(idUserFingerprint) + "}";

        // Enviar solicitud POST
        int httpResponseCode = http.POST(jsonPayload);
        Serial.println(httpResponseCode);

        // Revisar el código de respuesta
        if (httpResponseCode > 0) {
          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode);
          Serial.println("Datos enviados correctamente al servidor");
        } else {
          Serial.print("Error al enviar datos: ");
          Serial.println(http.errorToString(httpResponseCode).c_str());
        }

        // Finalizar solicitud
        http.end();
      } else {
        Serial.println("Error: No hay conexión Wi-Fi");
      }
}



void huellaEncontrada() {
  casoEXITO();
  Serial.println("Huella encontrada en la base de datos.");
  Serial.print("ID: ");
  Serial.println(finger.fingerID);

  // Enviar datos al servidor backend 
  sendEmail(1, finger.fingerID);
}


void huellaNoEncontrada() {
  casoFALLO();

   sendEmail(0, -1);
  
  Serial.println("Huella no encontrada.");
}



uint8_t RegistrarHuella() {
  int p = -1;
  Serial.print("Guardando huella con numero de ID #");
  Serial.println(fingerprintId);

  // Captura inicial de huella
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Imagen capturada!");
        break;
      case FINGERPRINT_NOFINGER:
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Error de comunicación");
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        break;
      default:
        Serial.println("Error desconocido");
        break;
    }
  }

  Serial.println("Momento de convertir la imagen");
  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) return p;  // Retorna si falla la conversión de imagen
  
  delay(500);
  p = -1;

  // Segunda captura de huella
  Serial.println("Coloque el mismo dedo de nuevo e ingrese 1");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) Serial.println("Imagen tomada");
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) return p;  // Retorna si falla la conversión de imagen
  
  Serial.print("Creando modelo para la huella con ID: #");
  Serial.println(fingerprintId);

  p = finger.createModel();
  if (p != FINGERPRINT_OK) return p;  // Retorna si las huellas no coinciden

  p = finger.storeModel(fingerprintId);
  if (p == FINGERPRINT_OK) {
    Serial.println("La huella se almacenó correctamente");

    // Enviar datos al servidor backend
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String serverURL = "http://" + backendIP + ":5050/usersFingerprint/confirmRegistration"; 
      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");

      // Crear el cuerpo de la solicitud con JSON
      String jsonPayload = "{\"username\":\"" + username + "\",\"idFingerprint\":" + String(fingerprintId) + "}";

      // Enviar solicitud POST
      int httpResponseCode = http.POST(jsonPayload);

      // Revisar el código de respuesta
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.println("Datos enviados correctamente al servidor");
      } else {
        Serial.print("Error al enviar datos: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }

      // Finalizar solicitud
      http.end();
    } else {
      Serial.println("Error: No hay conexión Wi-Fi");
    }
  } else {
    Serial.println("Error al almacenar la huella");
  }

  return p;
}

void BorrarHuella() {
  borrarHuellaEspecifica(fingerprintId);

    if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverURL = "http://"+ backendIP +":5050/usersFingerprint/confirmDelete";  // Cambia a la IP de tu backend
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");

    // Crear el cuerpo de la solicitud con JSON
    String jsonPayload = "{\"idFingerprint\":" + String(fingerprintId) + "}";

    // Enviar solicitud POST
    int httpResponseCode = http.POST(jsonPayload);

    // Revisar el código de respuesta
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println("Datos enviados correctamente al servidor");
    } else {
      Serial.print("Error al enviar datos: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    // Finalizar solicitud
    http.end();
  } else {
    Serial.println("Error: No hay conexión Wi-Fi");
  }
}

void borrarHuellaEspecifica(uint8_t id) {
  Serial.print("Intentando borrar huella con ID: ");
  Serial.println(id);

  uint8_t p = finger.deleteModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Huella borrada correctamente.");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Error de comunicación con el sensor.");
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("ID fuera del rango permitido.");
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error al borrar huella de la memoria.");
  } else {
    Serial.println("Error desconocido.");
  }
}

void BorrarBaseDeDatos() {
  finger.emptyDatabase();
}

uint8_t CantidadHuellas() {
  uint8_t p = finger.getTemplateCount();
  if (p == FINGERPRINT_OK) {
    Serial.print("Cantidad de huellas almacenadas: ");
    Serial.println(finger.templateCount);  // Muestra el total de huellas
    return finger.templateCount;
  } else {
    Serial.println("Error al contar las huellas almacenadas.");
  }
}


int melodiaCorrecto[] = {
  NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5
};

// Caso LED
int melodiaDenegado[] = {
  NOTE_B1, NOTE_B1, NOTE_B1, NOTE_B1
};

// Duraciones de las notas
int noteDurations[] = {
  4, 4, 4, 6
};

void continuoLCD() {
  apagarRGB();
  colorR = 0;
  colorG = 0;
  colorB = 50;
  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.setCursor(4, 0);
  lcd.print(" Ingrese ");
  lcd.setCursor(6, 1);
  lcd.write("Huella ");
  delay(250);
}

void registrarHuellaLCD() {
  apagarRGB();
  colorR = 150;
  colorG = 0;
  colorB = 150;
  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.setCursor(6, 0);
  lcd.print("Apoye");
  lcd.setCursor(6, 1);
  lcd.write("Huella");
  delay(250);
}

void casoEXITO() {
  int greenIntensity = 255;
  int blueIntensity = 255;
  int redIntensity = 255;
  colorR = 0;
  colorG = 150;
  colorB = 0;

  // Establecer los colores
  analogWrite(RGB_RED, greenIntensity);
  analogWrite(RGB_BLUE, blueIntensity);
  analogWrite(RGB_GREEN, redIntensity);

  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("ACCESO CORRECTO");
  lcd.setCursor(7, 1);
  lcd.print("               ");
  lcd.setCursor(7, 1);
  lcd.write(byte(0));

  // Reproduce la melodía
  for (int thisNote = 0; thisNote < 4; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZZER_PIN, melodiaCorrecto[thisNote], noteDuration);

    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(BUZZZER_PIN);
  }
  apagarRGB();
}

void casoFALLO() {
  int greenIntensity = 255;
  int blueIntensity = 255;
  int redIntensity = 0;
  colorR = 150;
  colorG = 0;
  colorB = 0;

  // Establecer los colores
  analogWrite(RGB_GREEN, greenIntensity);
  analogWrite(RGB_BLUE, blueIntensity);
  analogWrite(RGB_RED, redIntensity);

  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("ACCESO DENEGADO");
  lcd.setCursor(7, 1);
  lcd.write(byte(1));
  delay(250);

  // Reproduce la melodía
  for (int thisNote = 0; thisNote < 4; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZZER_PIN, melodiaDenegado[thisNote], noteDuration);
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
  }
  apagarRGB();
}