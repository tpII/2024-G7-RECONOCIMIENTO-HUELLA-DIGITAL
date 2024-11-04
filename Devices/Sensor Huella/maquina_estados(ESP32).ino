#include <Adafruit_Fingerprint.h>
#include "pitches.h"
#include <Wire.h>
#include "rgb_lcd.h"

HardwareSerial mySerial(2);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
// VARIABLES DEL PROGRAMA

// LED /////////////////////////////////////
#define RGB_GREEN 15
#define RGB_BLUE 4
#define RGB_RED 25

#define espera 300
#define duracion 500  // 5 segundos
// BUZZER //////////////////////////////////
#define BUZZZER_PIN  5

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
uint8_t p=0;
uint8_t fingerPresentCount = 0;  // Contador para verificar si realmente hay un dedo
uint8_t estado = 1;  // Estado inicial (1: Lectura constante)
uint8_t id;
uint8_t nuevoEstado=0;
uint8_t aux = 1;
///////////////////////////////////////////

void apagarRGB() {
  pinMode(RGB_RED, 255);
  pinMode(RGB_GREEN,255);
  pinMode(RGB_BLUE, 255);
  delay(200);
}

void setup() {
  // LED SETUP
  pinMode(RGB_RED, OUTPUT);
  pinMode(RGB_GREEN, OUTPUT);
  pinMode(RGB_BLUE, OUTPUT);
  // LCD SETUP
  lcd.begin(16, 2);  // Inicializa el LCD
  lcd.setRGB(colorR, colorG, colorB);  // Establece el color del fondo
  lcd.createChar(0,check);
  lcd.createChar(1,neg);

  // Fijar el texto en la segunda fila
  lcd.setCursor(6, 1);  // Coloca el cursor en la segunda fila
  continuoLCD();
  
  // HUELLA Y SERIAL SETUP
  Serial.begin(115200);
  while(!Serial);
  delay(1000);
  Serial.println("Inicializando sensor de huellas...");
  mySerial.begin(57600, SERIAL_8N1, 16, 17);
  delay(100);
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
  if (Serial.available() > 0){
    aux = Serial.parseInt();
  }
  if (aux != estado) {  
    nuevoEstado = aux;
    if (nuevoEstado >= 1 && nuevoEstado <= 5) {
      estado = nuevoEstado;  
      Serial.print("Cambiando al estado: ");
      Serial.println(estado);
    }
  } 
  // Máquina de estados
  switch (estado) {
    case 1:
      LecturaConstante();
      estado = 1;
      break;
    case 2:
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
  delay(1000);  
}

uint8_t LecturaConstante() {
  continuoLCD();
  p = finger.getImage();
  if (p == FINGERPRINT_OK) {
    p = finger.image2Tz();  // Convertir imagen a plantilla
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Imagen convertida en plantilla");
        break;
      case FINGERPRINT_IMAGEMESS:
        Serial.println("La imagen tomada no es buena");
        return p;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Error de comunicación");
        return p;
      case FINGERPRINT_FEATUREFAIL:
        Serial.println("No hay dedo presente");
        return p;
      case FINGERPRINT_INVALIDIMAGE:
        Serial.println("No hay dedo presente");
        return p;
      default:
        Serial.println("Error desconocido");
        return p;
    }
      p = finger.fingerFastSearch();  // Buscar la huella en la base de datos
      if (p == FINGERPRINT_OK) {
        huellaEncontrada();
      } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
        Serial.println("Error de comunicacion");
        return p;
      } else if (p == FINGERPRINT_NOTFOUND) {
        huellaNoEncontrada(); 
        return p;
      } else {
        Serial.println("Error desconocido");
        return p;
      } 
  } else if (p == FINGERPRINT_NOFINGER) {
    Serial.println("No hay dedo presente.");
  } else {
    Serial.println("Error al leer el sensor.");
  }
}

void huellaEncontrada() {
  casoEXITO();
  Serial.println("Huella encontrada en la base de datos.");
  Serial.print("ID: ");
  Serial.println(finger.fingerID);
  Serial.print("Confiabilidad de "); 
  Serial.println(finger.confidence);
}

void huellaNoEncontrada() {
  casoFALLO();
  Serial.println("Huella no encontrada.");
}

uint8_t RegistrarHuella() {
  int p = -1;
  id = CantidadHuellas();
  Serial.print("Guardando huella con numero de ID #");
  Serial.println(id);
  while (p != FINGERPRINT_OK) {
    Serial.println("Apoye el dedo e ingrese 1");
    readnumber();
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
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Imagen convertida en plantilla!");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("La imagen tomada no es buena");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Error de comunicación");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    default:
      Serial.println("Error de comunicación");
      return p;
  }
  delay(500);
  p = -1;
  Serial.println("Coloque el mismo dedo de nuevo e ingrese 1");
  readnumber();
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Imagen tomada");
        break;
      case FINGERPRINT_NOFINGER:
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Error de comunicacion");
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Error de imagen");
        break;
      default:
        Serial.println("Error desconocido");
        break;
    }
  }
  // OK success!
  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Imagen convertida en plantilla!");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("La imagen tomada no es buena");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Error de comunicación");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    default:
      Serial.println("Error desconocido");
      return p;
  }
  Serial.print("Creando modelo para la huella con ID: #");
  Serial.println(id);
  delay(250);
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Las huellas coinciden!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Error de comunicación");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Las huellas NO coiciden :(");
    return p;
  } else {
    Serial.println("Error desconocido");
    return p;
  }
  Serial.print("ID:");
  Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("La huella se almacenó correctamente");
    id++; // Si la huella se almaceno correctamente se incrementa el ID
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Error de comunicación");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("No se pudo guardar la huella, error en localización");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("No se pudo guardar la huella, error escribiendo la huella en memoria");
    return p;
  } else {
    Serial.println("Error desconocido");
    return p;
  }
}

void BorrarHuella() {
  Serial.print("Ingrese el ID de la huella a borrar, la huella 0 no se puede borrar: "); 
  uint16_t id = readnumber();  
  borrarHuellaEspecifica(id);  
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

uint8_t CantidadHuellas(){
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
  colorB = 255;
  lcd.setRGB(colorR, colorG, colorB);
  lcd.setCursor(0, 0);  
  lcd.print(" Ingrese huella ");  
  lcd.setCursor(7, 1);  
  lcd.write("HORA");  
  delay(350); 
}

void casoEXITO(){
  int greenIntensity = 0; 
  int blueIntensity = 255;     
  int redIntensity = 255;      
  colorR = 0;
  colorG = 150;
  colorB = 0;
  
  // Establecer los colores
  analogWrite(RGB_GREEN, greenIntensity);
  analogWrite(RGB_BLUE, blueIntensity);
  analogWrite(RGB_RED, redIntensity);

  lcd.setRGB(colorR, colorG, colorB);
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

void casoFALLO(){
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
  lcd.setCursor(0, 0);  
  lcd.print("ACCESO DENEGADO");  
  lcd.setCursor(7, 1);  
  lcd.print("               "); 
  lcd.setCursor(7, 1); 
  lcd.write(byte(1));  
  delay(300);

  // Reproduce la melodía
  for (int thisNote = 0; thisNote < 4; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZZER_PIN, melodiaDenegado[thisNote], noteDuration);
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
  }
  apagarRGB();
}
