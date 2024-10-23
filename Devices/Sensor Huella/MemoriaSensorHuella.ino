#include <Adafruit_Fingerprint.h>
SoftwareSerial mySerial(4, 5);  // TX/RX
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
uint8_t id;

// Template en formato hexadecimal como array de bytes
uint8_t templateData[] = {
  0xEF, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0x02, 0x00, 0x82, 0x03, 0x03, 0x58, 0x1B, 0x04, 0x01, 0x25,
  0x01, 0x6F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x13, 0x00, 0x01, 0x00, 0x7B, 0x00, 0xB9, 0x35,
  0x6D, 0x00, 0x2D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xFF, 0x55,
  0x00, 0x00, 0x00, 0x0C, 0xAD, 0x14, 0xA9, 0xF6, 0x95, 0xCF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00
};

// Tamaño del template
const uint16_t templateSize = sizeof(templateData) / sizeof(templateData[0]);



void setup() {
  Serial.begin(9600);
  while (!Serial)
    ;
  delay(250);
  Serial.println("\n\n Carga de huellas");
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("Sensor conectado!");
  } else {
    Serial.println("No se encuentra conectado el sensor de huellas :(");
    while (1) { delay(1); }
  }
  finger.getTemplateCount();
  Serial.print("El sensor contiene: ");
  Serial.print(finger.templateCount);
  Serial.println(" templates");
  Serial.println("Listo para registrar huella");
  finger.emptyDatabase();
  // Lee los templates almacenados
  imprimirTemplates();
  Serial.println("2222");
  
  

  imprimirTemplates();
  Serial.println("2222");

  finger.loadModel(1);

  finger.emptyDatabase();
  imprimirTemplates();
  Serial.println("2222");

  finger.storeModel(1);
  imprimirTemplates();
  Serial.println("2222");


}

void loop()  // run over and over again
{
  //if (finger.)
  //  Serial.println("Ingresar numero de ID # (1 a 127) para la huella a registrar, tener en cuenta que 0 no es un numero valido ");
  //id = readnumber();
  //if (id == 0) {  // ID 0 no valido
  //  return;
  //}
  //Serial.print("Cargando huella con ID #");
  //Serial.println(id);
  // REGISTRA UNA HUELLA
  //getFingerprintEnroll();
  // VERIFICA SI LA HUELLA INGRESADA SE ENCUENTRA EN LA BASE DE DATOS Y DEVUELVE EL ID CORRESPONDIENTE
  //getFingerprintID();

  // Lee los templates almacenados
  //imprimirTemplates();
}

void subirYGuardarTemplate() {
  // Subir template al buffer de la huella
  Serial.println("Subiendo template al buffer del sensor...");
  if (subirTemplate() == FINGERPRINT_OK) {
    Serial.println("Template subido con éxito al buffer!");

    // Guardar el template en la posición ID 1
    if (finger.storeModel(1) == FINGERPRINT_OK) {
      Serial.println("Template guardado con éxito en la posición 1!");
    } else {
      Serial.println("Error al guardar el template en la memoria flash.");
    }
  } else {
    Serial.println("Error al subir el template.");
  }
}

uint8_t subirTemplate() {
  // Enviar los datos del template por la UART (el puerto serial donde está el sensor)
  mySerial.write(templateData, templateSize);

  // Esperar la respuesta del sensor
  if (mySerial.available()) {
    uint8_t respuesta = mySerial.read();
    if (respuesta == FINGERPRINT_OK) {
      return FINGERPRINT_OK;
    } else {
      return FINGERPRINT_PACKETRECIEVEERR;
    }
  }

  return FINGERPRINT_PACKETRECIEVEERR; // En caso de error
}

void imprimirTemplates() {
  uint16_t templateCount = finger.getTemplateCount();

  if (finger.templateCount == 0) {
    Serial.println("No se han encontrado templates guardados.");
  } else {
    Serial.print("Se encontraron ");
    Serial.print(finger.templateCount);
    Serial.println(" templates guardados:");

    // Iterar a través de los posibles IDs de templates
    for (int i = 1; i <= finger.templateCount; i++) {
      if (finger.loadModel(i) == FINGERPRINT_OK) {
        Serial.print("Template encontrado en ID: ");
        Serial.println(i);

        // Template de Buffer a UART
        if (finger.getModel() == FINGERPRINT_OK) {
          Serial.println("Template cargado con éxito. Imprimiendo:");
          leerYMostrarDatosUART();
        } else {
          Serial.println("Error al cargar el template.");
        }
      }
    }
  }
}

void leerYMostrarDatosUART() {
  // Lee los datos enviados por la UART (enviados por el sensor)
  while (mySerial.available()) {
    uint8_t dato = mySerial.read();
    if (dato < 0x10) {
      Serial.print("0");
    }
    Serial.print(dato, HEX);
    Serial.print(" ");

    // Salto de línea después de 16 bytes
    static int contador = 0;
    contador++;
    if (contador % 16 == 0) {
      Serial.println();
    }
  }
}

void imprimirTemplate(uint8_t *templateData, uint16_t size) {
  // Imprimir el template en formato hexadecimal
  for (uint16_t i = 0; i < size; i++) {
    if (templateData[i] < 0x10) {
      Serial.print("0");
    }
    Serial.print(templateData[i], HEX);
    Serial.print(" ");

    // Salto de línea después de 16 bytes
    if ((i + 1) % 16 == 0) {
      Serial.println();
    }
  }
  Serial.println();
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  while (num == 0) {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
  }
  return num;
}

uint8_t getFingerprintEnroll() {
  int p = -1;
  Serial.print("Apoyar el dedo en el sensor para guardarlo como #");
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
// Buscar ID de huella
uint8_t getFingerprintID() {
  Serial.println("Coloque su dedo e ingrese 1 para buscarlo en la memoria");
  readnumber();
  uint8_t p = finger.getImage();
  delay(250);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Imagen tomada");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No se detecto dedo en el sensor");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Error de comunicacion");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Error de imagen");
      return p;
    default:
      Serial.println("Error desconocido");
      return p;
  }
  // OK success!
  p = finger.image2Tz();
  delay(250);
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
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("No se pudieron encontrar las caracteristicas de esta huella");
      return p;
    default:
      Serial.println("Error desconocido");
      return p;
  }
  // OK converted!
  p = finger.fingerFastSearch();
  delay(250);
  if (p == FINGERPRINT_OK) {
    Serial.println("Se encontró una huella igual en la base de datos!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Error de comunicacion");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("No se encontró una huella igual en la base de datos");
    return p;
  } else {
    Serial.println("Error desconocido");
    return p;
  }
  // found a match!
  Serial.println("Se encontró el ID: #");
  Serial.println(finger.fingerID);
  Serial.println(" Confiabilidad de ");
  Serial.println(finger.confidence);

  return finger.fingerID;
}
