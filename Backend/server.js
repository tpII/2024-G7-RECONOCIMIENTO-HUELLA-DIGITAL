import express from 'express';
import cors from 'cors';
import logsRoutes from './routes/logsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userFingerprintRoutes from './routes/userFingerprintRoutes.js';
import webPushRotes from './routes/webPushRoutes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5050;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uri = process.env.ATLAS_URI || "";
mongoose.connect(uri, { useNewUrlParser: true });

app.use("/logs", logsRoutes);
app.use("/api/auth", authRoutes);
app.use("/usersFingerprint", userFingerprintRoutes);
app.use("/webPush", webPushRotes);

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});