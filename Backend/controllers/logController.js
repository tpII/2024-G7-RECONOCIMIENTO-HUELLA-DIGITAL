// FILE: controllers/logsController.js
import Log from '../models/logModel.js';
import nodemailer from 'nodemailer';
import moment from "moment";
import { subscribe, sendNotification } from './webPushController.js';
import { updateEmailStore, getEmailStore } from "./emailStore.js";
import { getUsernameByFingerprintIdFunction } from './userFingerprintController.js';



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
    console.log(log);
    //if (log.success) {
    //  console.log("Entro");
      log.username = await getUsernameByFingerprintIdFunction(req.body.idUserFingerprint);
    //}
    console.log(req.body.success);
    const result = await log.save();

    console.log("Salio");

    if (!Number(req.body.success)) {
      const notificationResult = await sendNotification();
      if (!notificationResult.success) {
        console.error(notificationResult.message);
      }

      // Obtener correos electrónicos desde la variable global
      const emailAddresses = getEmailStore().email.join(", ");

      // Send an email if the log is a failed attempt
      const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
      const info = await transporter.sendMail({
        from: '"Sistema de Control de Acceso" <support@smitecodes.com>',
        to: emailAddresses,
        subject: "🚨 Alerta de Intento de Acceso No Autorizado 🚨",
        text: `Se ha detectado un intento de acceso no autorizado a su sistema el ${timestamp}. Si no reconoce esta actividad, por favor contacte a soporte técnico.`,
        html: `
          <h1 style="color: #d32f2f;">Alerta de Seguridad</h1>
          <p>Estimado usuario,</p>
          <p>
            Se ha detectado un intento de acceso no autorizado a su sistema el
            ${timestamp}. Si no reconoce esta actividad, por favor contacte a soporte técnico.
          </p>
        `,
      });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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