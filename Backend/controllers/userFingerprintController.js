import UserFingerprint from '../models/userFingerptintModel.js';

async function getNextFingerprintId() {
    const fingerprints = await UserFingerprint.find({}, 'idFingerprint').sort('idFingerprint');
    const usedIds = fingerprints.map(f => f.idFingerprint);
    console.log("Used IDs:", usedIds);

    for (let i = 0; i < 128; i++) {
        if (!usedIds.includes(i)) return i;
    }

    throw new Error("No available fingerprint IDs");
}

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

export const startFingerprintRegistration = async (req, res) => {
    try {
        const username = req.body.username;
        const idFingerprint = await getNextFingerprintId();

        console.log("ID Fingerprint:", idFingerprint);

        const response = await fetch('http://192.168.68.114/sendData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, idFingerprint })
        });

        if (response.ok) {
            res.status(200).json({ message: "Fingerprint ID assigned and sent to ESP32", idFingerprint });
        } else {
            res.status(500).json({ message: "Failed to send data to ESP32" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user fingerprint
export const confirmFingerprintRegistration = async (req, res) => {
    try {
        const { idFingerprint, username } = req.body;

        const newFingerprint = new UserFingerprint({
            username,
            idFingerprint
        });

        await newFingerprint.save();
        res.status(201).json({ message: "Fingerprint registered successfully", newFingerprint });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

