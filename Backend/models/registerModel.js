import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    success: { type: Boolean, required: true },
    message: { type: String, required: true },
});

const Register = mongoose.model("Register", registerSchema);

export default Register;