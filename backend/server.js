const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Routes
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Use public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING!");
});

console.log("TEST ROUTE LOADED!");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
    res.send("Smart Campus Issue Tracking Backend is Running!");
});

// Database test route
app.get("/api/test-db", async (req, res) => {
    try {
        console.log("Database test started...");

        await mongoose.connection.db.admin().ping();

        console.log("MongoDB ping successful!");

        const userCount = await mongoose.connection.db
            .collection("users")
            .countDocuments();

        console.log("User count:", userCount);

        res.status(200).json({
            message: "MongoDB is working!",
            connectionState: mongoose.connection.readyState,
            userCount: userCount
        });

    } catch (error) {
        console.error("Database Test Error:", error.message);

        res.status(500).json({
            message: "MongoDB test failed",
            error: error.message
        });
    }
});

// MongoDB connection
mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        tls: true,
        family: 4
    })
    .then(() => {
        console.log("MongoDB connected successfully!");

        console.log(
            "MongoDB connection state:",
            mongoose.connection.readyState
        );
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

// MongoDB events
mongoose.connection.on("connected", () => {
    console.log("MongoDB EVENT: connected");
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB EVENT: disconnected");
});

mongoose.connection.on("error", (error) => {
    console.error(
        "MongoDB EVENT error:",
        error.message
    );
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});