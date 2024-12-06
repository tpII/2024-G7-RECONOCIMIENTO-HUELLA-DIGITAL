import express from 'express';
import cors from 'cors';
import logsRoutes from './routes/logsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userFingerprintRoutes from './routes/userFingerprintRoutes.js';
import webPushRotes from './routes/webPushRoutes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dgram from 'dgram';
import { setEsp32Ip } from './esp32Config.js';
import os from 'os';

const PORT = process.env.PORT || 5050;
const BROADCAST_PORT = 12345; // Puerto para el broadcast

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uri = process.env.ATLAS_URI || "";
mongoose.connect(uri, { useNewUrlParser: true });

app.use("/logs", logsRoutes);
app.use("/api/auth", authRoutes);
app.use("/usersFingerprint", userFingerprintRoutes);
app.use("/webPush", webPushRotes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Obtener la IP local
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    let localIp = '';

    for (const interfaceName in interfaces) {
        for (const net of interfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                break;
            }
        }
        if (localIp) break;
    }

    return localIp;
}

const backendIp = getLocalIp(); // Dirección IP del servidor backend

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Configurar el servidor UDP para responder al broadcast
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    const message = msg.toString();
    console.log(`Mensaje recibido: ${message} de ${rinfo.address}:${rinfo.port}`);

    if (message === 'DISCOVER_BACKEND') {
        // Actualizar la IP del ESP32 usando la función
        setEsp32Ip(rinfo.address);

        const response = `BACKEND_IP:${backendIp}`;
        udpServer.send(response, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error("Error enviando respuesta:", err);
            } else {
                console.log(`Respuesta enviada a ${rinfo.address}:${rinfo.port}`);
            }
        });
    }
});

udpServer.on('error', (err) => {
    console.error(`Error en el servidor UDP: ${err.message}`);
    udpServer.close();
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`Servidor UDP escuchando en ${address.address}:${address.port}`);
});

// Iniciar el servidor UDP
udpServer.bind(BROADCAST_PORT, () => {
    console.log(`Servidor UDP listo para recibir mensajes en el puerto ${BROADCAST_PORT}`);
});
