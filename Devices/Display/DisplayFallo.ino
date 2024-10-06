#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

const int colorR = 150;
const int colorG = 0;
const int colorB = 0;
const int tamDisplay = 16;
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

void setup() 
{
    lcd.begin(16, 2);  // Inicializa el LCD
    lcd.setRGB(colorR, colorG, colorB);  // Establece el color del fondo
    lcd.createChar(0,neg);

}

void loop() 
{
  lcd.setCursor(0, 0);  
  lcd.print("ACCESO DENEGADO");  
  lcd.setCursor(7, 1);  
  lcd.write(byte(0));  
  delay(350);  
}
