import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    success: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
    idUserFingerprint: { type: String },
    username: { type: String },
});

const Log = mongoose.model("Log", logSchema);

export default Log;