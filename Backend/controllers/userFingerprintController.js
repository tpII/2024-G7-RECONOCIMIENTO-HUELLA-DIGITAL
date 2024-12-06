import UserFingerprint from '../models/userFingerptintModel.js';
import { getEsp32Ip } from '../esp32Config.js';

async function getNextFingerprintId() {
    const fingerprints = await UserFingerprint.find({}, 'idFingerprint').sort('idFingerprint');
    const usedIds = fingerprints.map(f => f.idFingerprint);

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

// Get a specific name of user fingerprint (By FingerPrint ID)

export const getUsernameByFingerprintId = async (req, res) => {
    try {

        const userFingerprint = await UserFingerprint.findOne({ idFingerprint: req.params.id });
        if (userFingerprint) {
            res.status(200).send(userFingerprint.username);
        } else {
            res.status(404).send("NN");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}


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
        const esp32Ip = await getEsp32Ip();
        console.log(`esp32Ip: ${esp32Ip}`);


        const response = await fetch(`http://${esp32Ip}/sendData`, {
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
export const startDeleteFingerprint = async (req, res) => {
    try {
        const { idFingerprint } = req.body;

        const response = await fetch(`http://${esp32Ip}/deleteFingerprint`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idFingerprint })
        });

        if (response.ok) {
            res.status(200).json({ message: "Fingerprint ID sent to ESP32 for deletion", idFingerprint });
        } else {
            res.status(500).json({ message: "Failed to send data to ESP32" });
        }
    } catch (err) {
        res.status(500).send(err);
    }

};

export const confirmDeleteFingerprint = async (req, res) => {
    try {
        const { idFingerprint } = req.body;

        const result = await UserFingerprint.findOneAndDelete({ idFingerprint });
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("User fingerprint not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
