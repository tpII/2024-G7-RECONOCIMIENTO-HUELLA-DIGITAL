import UserFingerprint from '../models/userFingerptintModel.js';

// List of all user fingerprints
export const getAllUserFingerprints = async (req, res) => {
    try {
        const userFingerprints = await UserFingerprint.find({});
        res.status(200).send(userFingerprints);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a specific user fingerprint (By ID)
export const getUserFingerprintById = async (req, res) => {
    try {
        const userFingerprint = await UserFingerprint.findById(req.params.id);
        if (userFingerprint) {
            res.status(200).send(userFingerprint);
        } else {
            res.status(404).send("User fingerprint not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Create a new user fingerprint
export const createUserFingerprint = async (req, res) => {
    try {
        const userFingerprint = new UserFingerprint(req.body);
        const result = await userFingerprint.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Delete a user fingerprint by ID
export const deleteUserFingerprintById = async (req, res) => {
    try {
        const result = await UserFingerprint.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("User fingerprint not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};