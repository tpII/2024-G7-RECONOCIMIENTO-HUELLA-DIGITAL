import express from 'express';
import {
    getAllUserFingerprints,
    getUserFingerprintById,
    startFingerprintRegistration,
    confirmFingerprintRegistration,
    startDeleteFingerprint,
    confirmDeleteFingerprint,
    getUsernameByFingerprintId,
    updateUserFingerprintUsername
} from '../controllers/userFingerprintController.js';
import { get } from 'mongoose';

const router = express.Router();

// List of all user fingerprints
router.get("/", getAllUserFingerprints);

// Get a specific user fingerprint (By ID)
router.get("/:id", getUserFingerprintById);

// Get a specific user fingerprint (By ID)
router.get("/getName/:id", getUsernameByFingerprintId);

// Start fingerprint deletion
router.delete("/startDelete", startDeleteFingerprint);

// Confirm fingerprint deletion
router.post("/confirmDelete", confirmDeleteFingerprint)

// Create a new user fingerprint (Send data to ESP32)
router.post('/startRegistration', startFingerprintRegistration);

// Confirm fingerprint registration (Save to database)
router.post('/confirmRegistration', confirmFingerprintRegistration);

router.put('/:id', updateUserFingerprintUsername);

export default router;