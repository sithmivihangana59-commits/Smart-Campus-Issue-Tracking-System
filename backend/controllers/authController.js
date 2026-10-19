const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        const normalizedName = typeof name === "string" ? name.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered. Please sign in instead."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            role: "Student"
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered. Please sign in instead."
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Please check the registration details and try again."
            });
        }

        console.error("Register Error:", error);

        res.status(500).json({
            message: "Unable to create your account right now. Please try again."
        });
    }
};


// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: String(email).trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "This account has been deactivated"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Failed to login",
            error: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};