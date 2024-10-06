#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

const int colorR = 0;
const int colorG = 150;
const int colorB = 0;
const int tamDisplay = 16;
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

void setup() 
{
    lcd.begin(16, 2);  // Inicializa el LCD
    lcd.setRGB(colorR, colorG, colorB);  // Establece el color del fondo
    lcd.createChar(0,check);

}

void loop() 
{
  lcd.setCursor(0, 0);  
  lcd.print("ACCESO CORRECTO");  
  lcd.setCursor(7, 1);  
  lcd.write(byte(0));
  delay(350);  
}
