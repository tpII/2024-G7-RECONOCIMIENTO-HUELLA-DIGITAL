import express from "express";
import jwt from "jsonwebtoken";
import { AuthController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        let result = await AuthController.signup(req.body);
        res.send(result).status(201);
    } catch (err) {
        res.status(400).send(err.message);
    }
}
);

router.post("/login", async (req, res) => {
    try {
        const user = await AuthController.login(req.body);
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
        res
            .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 3600000 // 1 hour
            })
            .send({ user, token }).status(200);
    } catch (err) {
        res.status(401).send(err.message);
    }
}
);

router.get('/users', AuthController.getAllUsers);
router.get('/user-count', AuthController.getUserCount);
router.get('/check-auth', AuthController.checkAuth);

export default router;

