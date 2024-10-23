import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {

    static async signup({ username, email, password }) {
        Validation.username(username);
        Validation.email(email);
        Validation.password(password);

        const newUser = await User.findOne({ email });
        if (newUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        new User({
            username,
            email,
            password: hashedPassword
        }).save();
    }

    static async login({ email, password }) {
        Validation.email(email);
        Validation.password(password);

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }

        const publicUser = {
            _id: user._id,
            username: user.username,
            email: user.email
        }
        return publicUser;
    }

    // Método para recuperar todos los usuarios
    static async getAllUsers(req, res) {
        try {
            const users = await User.find({}, '-password'); // Excluir el campo password
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving users' });
        }
    }

    // Método para devolver el número de usuarios en la base de datos
    static async getUserCount(req, res) {
        try {
            const userCount = await User.countDocuments();
            res.json({ userCount });
        } catch (err) {
            res.status(500).json({ message: 'Error counting users' });
        }
    }

    static checkAuth(req, res) {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req = decoded;
            res.status(200).json({ message: "Authenticated" });
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    }

}

class Validation {
    static username(username) {
        if (typeof username !== "string") {
            throw new Error("Invalid input");
        }
        if (username.length < 3) {
            throw new Error("Username must be at least 3 characters long");
        }
    }

    static email(email) {
        if (typeof email !== "string") {
            throw new Error("Invalid input");
        }
    }

    static password(password) {
        if (typeof password !== "string") {
            throw new Error("Invalid input");
        }
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
    }
}