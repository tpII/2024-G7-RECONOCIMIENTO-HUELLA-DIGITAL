// esp32Config.js
let esp32Ip = ''; // Variable global para almacenar la dirección IP del ESP32

// Función para actualizar la dirección IP
export function setEsp32Ip(ip) {
    esp32Ip = ip;
}

// Función para obtener la dirección IP
export function getEsp32Ip() {
    return esp32Ip;
}
