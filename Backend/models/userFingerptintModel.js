import mongoose from 'mongoose';

//This is the schema for the user model for webApp
const userFingerprintSchema = new mongoose.Schema({
    username: { type: String, required: true },
    idFingerprint: { type: String, required: true },
});

const UserFingerprint = mongoose.model('UserFingerprint', userFingerprintSchema);

export default UserFingerprint;