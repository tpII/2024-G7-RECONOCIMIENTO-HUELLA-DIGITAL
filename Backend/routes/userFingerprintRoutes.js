import express from 'express';
import {
    getAllUserFingerprints,
    getUserFingerprintById,
    createUserFingerprint,
    deleteUserFingerprintById
} from '../controllers/userFingerprintController.js';

const router = express.Router();

// List of all user fingerprints
router.get("/", getAllUserFingerprints);

// Get a specific user fingerprint (By ID)
router.get("/:id", getUserFingerprintById);

// Create a new user fingerprint
router.post("/", createUserFingerprint);

// Delete a user fingerprint by ID
router.delete("/:id", deleteUserFingerprintById);

export default router;