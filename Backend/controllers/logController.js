// FILE: controllers/logsController.js
import Log from '../models/logModel.js';
import nodemailer from 'nodemailer';
import moment from "moment"; // Librería para manejar fechas (instala con npm install moment)
import { subscribe, sendNotification} from './webPushController.js';


//Configuracones VAPID y nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Send a test email
export const sendTestEmail = async (req, res) => {
  try {
    // Obtén la fecha y hora actual
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss"); // Formato: 2024-12-05 14:35:45

    const info = await transporter.sendMail({
      from: '"Sistema de Control de Acceso" <support@smitecodes.com>',
      to: "jeroratusny@gmail.com, rodriguezmesamariano@gmail.com",
      subject: "🚨 Alerta de Intento de Acceso No Autorizado 🚨",
      text: `Se ha detectado un intento de acceso no autorizado a su sistema el ${timestamp}. Si no reconoce esta actividad, por favor contacte a soporte técnico.`,
      html: `
            <h1 style="color: #d32f2f;">Alerta de Seguridad</h1>
            <p>Estimado usuario,</p>
            <p>
              Se ha detectado un intento de acceso no autorizado a su sistema el 
              <b>${timestamp}</b>.
            </p>
            <p>Si no reconoce esta actividad, por favor:</p>
            <ul>
              <li>Verifique sus credenciales y cámbielas si es necesario.</li>
              <li>Contacte a nuestro equipo de soporte técnico de inmediato.</li>
            </ul>
            <p>Atentamente,</p>
            <p><b>Sistema de Control de Acceso</b></p>
          `,
    });


    res.status(200).send(info);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};







// List of all logs
export const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find({});
        res.status(200).send(logs);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a specific log (By ID)
export const getLogById = async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (log) {
            res.status(200).send(log);
        } else {
            res.status(404).send("Log not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Create a new log
export const createLog = async (req, res) => {
    try {
        const log = new Log(req.body);
        console.log(req.body.success);
        const result = await log.save();

        // Send an email if the log is a failed attempt
       // if (!req.body.success) {
            const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
            const info = await transporter.sendMail({
                from: '"Sistema de Control de Acceso" <support@smitecodes.com>',
                to: "jeroratusny@gmail.com, rodriguezmesamariano@gmail.com",
                subject: "🚨 Alerta de Intento de Acceso No Autorizado 🚨",
                text: `Se ha detectado un intento de acceso no autorizado a su sistema el ${timestamp}. Si no reconoce esta actividad, por favor contacte a soporte técnico.`,
                html: `
                      <h1 style="color: #d32f2f;">Alerta de Seguridad</h1>
                      <p>Estimado usuario,</p>
                      <p>
                        Se ha detectado un intento de acceso no autorizado a su sistema el 
                        <b>${timestamp}</b>.
                      </p>
                      <p>Si no reconoce esta actividad, por favor:</p>
                      <ul>
                        <li>Verifique sus credenciales y cámbielas si es necesario.</li>
                        <li>Contacte a nuestro equipo de soporte técnico de inmediato.</li>
                      </ul>
                      <p>Atentamente,</p>
                      <p><b>Sistema de Control de Acceso</b></p>
                    `,
                  })
                  res.status(200).send(info);
        
                  //sendNotification();
             //   }
        

      //   else {
           // send not authorized http status
       //     res.status(201).send("Authorized access");
        // }




    } catch (err) {
        res.status(500).send(err);
    }
};

// Delete a log by ID
export const deleteLogById = async (req, res) => {
    try {
        const result = await Log.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("Log not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};