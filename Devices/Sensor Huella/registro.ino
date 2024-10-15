#include <Adafruit_Fingerprint.h>

SoftwareSerial mySerial(2, 3);  // TX/RX

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t id;

void setup() {
  Serial.begin(9600);
  while (!Serial)
    ; 
  delay(100);
  Serial.println("\n\n Carga de huellas");

  // set the data rate for the sensor serial port
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Sensor conectado!");
  } else {
    Serial.println("No se encuentra conectado el sensor de huellas :(");
    while (1) { delay(1); }
  }
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

void loop()  // run over and over again
{
  Serial.println("Listo para registrar huella");
  Serial.println("Ingresar numero de ID # (1 a 127) para la huella a registrar, tener en cuenta que 0 no es un numero valido ");
  id = readnumber();
  if (id == 0) {  // ID 0 no valido
    return;
  }
  Serial.print("Cargando huella con ID #");
  Serial.println(id);

  while (!getFingerprintEnroll())
    ;
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

  Serial.println("Limpie el sensor e ingrese 1 luego de hacerlo");
  readnumber();
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
    delay(500);
  }
  Serial.print("ID ");
  Serial.println(id);
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

  Serial.print("ID ");
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
