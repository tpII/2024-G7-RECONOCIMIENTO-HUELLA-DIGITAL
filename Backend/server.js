import express from 'express';
import cors from 'cors';
import logsRoutes from './routes/logsRoutes.js';

const PORT = process.env.PORT || 5050;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/logs", logsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});