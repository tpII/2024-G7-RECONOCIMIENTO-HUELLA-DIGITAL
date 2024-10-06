#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

const int colorR = 0;
const int colorG = 0;
const int colorB = 255;
const int tamDisplay = 16;


String mensaje = "Ingrese su huella - ";  // Mensaje - 24 caracteres
int longitud_mensaje;

void setup() 
{
    lcd.begin(16, 2);  // Inicializa el LCD
    lcd.setRGB(colorR, colorG, colorB);  // Establece el color del fondo

    // Fijar el texto en la segunda fila
    lcd.setCursor(6, 1);  // Coloca el cursor en la segunda fila
    lcd.print("09:12");  // Imprime la hora fija

    longitud_mensaje = mensaje.length();  // Longitud del mensaje a desplazar
}

void loop() 
{
    // Desplazar el mensaje de la primera fila manualmente
    for (int i = 0; i < longitud_mensaje; i++) {
        lcd.setCursor(0, 0);  // Coloca el cursor en la primera fila
        if ((i+tamDisplay)>(longitud_mensaje-1)){
          lcd.print(mensaje.substring(i, (longitud_mensaje)));  // Imprime una ventana del mensaje
          lcd.setCursor(longitud_mensaje - i,0);
          lcd.print(mensaje.substring(0, tamDisplay));  // Imprime una ventana del mensaje
        }
        else{
          lcd.print(mensaje.substring(i, i + tamDisplay));  // Imprime una ventana del mensaje
        }
        
        
        delay(350);  // Controla la velocidad del desplazamiento

        // Asegúrate de que la hora sigue visible en la segunda fila
        lcd.setCursor(6, 1);  // Coloca el cursor en la segunda fila
        lcd.print("09:12");  // Vuelve a imprimir la hora fija
    }
}
