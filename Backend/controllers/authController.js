import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {

    static async signup({ username, email, password }) {
        Validation.username(username);
        Validation.email(email);
        Validation.password(password);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        return savedUser;
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

    static logout(req, res) {
        res.clearCookie("access_token");
        res.status(200).json({ message: "Logged out" });
    }


    static async getAllUsers(req, res) {
        try {
            const users = await User.find({}, '-password'); // Excluir el campo password
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving users' });
        }
    }

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
            res.status(200).json({ message: "Authenticated", user: decoded });
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    }


    static async updateUser(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            if (updateData.password)
                updateData.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ message: 'Error updating user', error: err.message });
        }
    }


    static async deleteUser(req, res) {
        const { id } = req.params;

        try {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting user', error: err.message });
        }
    }

    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findById(id, '-password'); // Excluir el campo password
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving user', error: err.message });
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