#include <Adafruit_Fingerprint.h>

HardwareSerial mySerial(2);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t p=0;
uint8_t fingerPresentCount = 0;  // Contador para verificar si realmente hay un dedo
uint8_t estado = 1;  // Estado inicial (1: Lectura constante)
uint8_t id;
uint8_t nuevoEstado=0;
uint8_t aux = 1;

void setup() {
  Serial.begin(115200);
  while(!Serial);
  delay(1000);
  Serial.println("Inicializando sensor de huellas...");
  // RX2 con TX sensor de huellas
  // TX2 con RX sensor de huellas 
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
  Serial.println("Huella encontrada en la base de datos.");
  Serial.print("ID: ");
  Serial.println(finger.fingerID);
  Serial.print("Confiabilidad de "); 
  Serial.println(finger.confidence);
}

void huellaNoEncontrada() {
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
