// FILE: controllers/logsController.js
import Log from '../models/logModel.js';

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
        const result = await log.save();
        res.status(201).send(result);
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