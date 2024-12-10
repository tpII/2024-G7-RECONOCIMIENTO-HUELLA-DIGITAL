#!/bin/bash

# Función para manejar la señal de interrupción y cerrar ambos servidores
cleanup() {
    echo -e "\nStopping servers..."
    kill $(jobs -p) 2>/dev/null
    wait
    exit 0
}

# Capturar las señales de interrupción (Ctrl+C) y terminación
trap cleanup SIGINT SIGTERM

# Navegar a la carpeta del backend y ejecutar el servidor en modo watch
cd Backend
pnpm start &

# Guardar el PID del proceso del backend
BACKEND_PID=$!

# Navegar a la carpeta del frontend y ejecutar el servidor en modo watch
cd ../Frontend
pnpm run dev &

# Guardar el PID del proceso del frontend
FRONTEND_PID=$!

# Esperar a que los procesos hijos terminen
wait $BACKEND_PID
wait $FRONTEND_PID