import mongoose from 'mongoose';

const userFingerprintSchema = new mongoose.Schema({
    username: { type: String, required: true },
    idFingerprint: { type: Number, required: true, unique: true },
});

const UserFingerprint = mongoose.model('UserFingerprint', userFingerprintSchema);

export default UserFingerprint;