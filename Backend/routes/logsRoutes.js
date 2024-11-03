import express from 'express';
import {
    getAllLogs,
    getLogById,
    createLog,
    deleteLogById
} from '../controllers/logController.js';

const router = express.Router();

// List of all logs
router.get("/", getAllLogs);

// Get a specific log (By ID)
router.get("/:id", getLogById);

// Create a new log
router.post("/", createLog);

// Delete a log by ID
router.delete("/:id", deleteLogById);

export default router;