#include <WiFi.h>
#include <HTTPClient.h>

// Definir el nombre y la contraseña de la red WiFi
const char* ssid = "";
const char* password = ""; 

// URL a la que se realizará el POST
const char* serverName = "http://192.168.198.144:5050/logs/";

void setup() {
  // Iniciar la comunicación serie para ver mensajes en el monitor serial
  Serial.begin(115200);

  // Conectar a la red WiFi
  Serial.println("Conectando a WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Intentando conectar...");
  }

  Serial.println("Conectado a WiFi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  // Hacer el POST después de conectarse al WiFi
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Iniciar la solicitud POST
    http.begin(serverName); // Especificar la URL
    http.addHeader("Content-Type", "application/json"); // Cabecera necesaria para el POST

    // Cuerpo del POST
    String postData = "{\"name\":\"Hola muchachitos de informatica\"}";

    // Enviar la solicitud POST
    int httpResponseCode = http.POST(postData);

    // Mostrar el código de respuesta
    if (httpResponseCode > 0) {
      Serial.print("Código de respuesta HTTP: ");
      Serial.println(httpResponseCode);
      
      // Mostrar la respuesta del servidor
      String response = http.getString();
      Serial.println("Respuesta del servidor:");
      Serial.println(response);
    } else {
      Serial.print("Error en la solicitud POST: ");
      Serial.println(httpResponseCode);
    }

    // Finalizar la conexión
    http.end();
  } else {
    Serial.println("Error de conexión WiFi");
  }
}

void loop() {
  // Tu código principal puede ir aquí
}