import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    success: { type: Boolean, required: true },
    message: { type: String, required: true },
    idUserFingerprint: { type: String },
});

const Log = mongoose.model("Log", registerSchema);

export default Register;