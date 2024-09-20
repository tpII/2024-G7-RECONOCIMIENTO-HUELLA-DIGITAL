// Código que repite en loop los sonidos de éxito y error para 
// usar luego en el código
// Usar en Arduino IDE eligiendo Lily Go-T Display para cargar en ESP32
#include "pitches.h"
#define BUZZZER_PIN  18 // ESP32 pin GPIO18 conectado al buzzer piezo

// Caso Exito
int successMelody[] = {
  NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5
};

// Caso Fallo
int errorMelody[] = {
  NOTE_C4, NOTE_C4, NOTE_C4, NOTE_C4
};

// Duraciones de las notas 
int noteDurations[] = {
  4, 4, 4, 4
};

void playSuccessSound() {
  // Reproduce la melodía
  for (int thisNote = 0; thisNote < 4; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZZER_PIN, successMelody[thisNote], noteDuration);

    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(BUZZZER_PIN);
  }
}

void playErrorSound() {
  // Reproduce la melodía de error
  for (int thisNote = 0; thisNote < 4; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZZER_PIN, errorMelody[thisNote], noteDuration);
  }
}

void setup() {
  // No se necesita código en el setup
}

void loop() {
  // Reproducir sonido de exito
  playSuccessSound();
  
  // Esperar 5 segundos antes de reproducir el siguiente sonido - Solo para probar -> Despues ubicarlo donde va
  delay(5000);

  // Reproducir sonido de error
  playErrorSound();

  // Esperar 5 segundos antes de volver a iniciar el ciclo
  delay(5000);
}