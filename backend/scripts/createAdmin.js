const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

const createFirstAdmin = async () => {
    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (
        !MONGO_URI ||
        !ADMIN_NAME ||
        !ADMIN_NAME.trim() ||
        !ADMIN_EMAIL ||
        !ADMIN_EMAIL.trim() ||
        !ADMIN_PASSWORD
    ) {
        throw new Error(
            "MONGO_URI, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
        );
    }
    if (ADMIN_PASSWORD.length < 6) {
        throw new Error("ADMIN_PASSWORD must be at least 6 characters long");
    }

    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        tls: true
    });

    if (await User.exists({ role: "Admin" })) {
        throw new Error("An Admin already exists; refusing to create another first admin");
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();
    if (await User.exists({ email })) {
        throw new Error("ADMIN_EMAIL is already registered");
    }

    await User.create({
        name: ADMIN_NAME.trim(),
        email,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: "Admin"
    });
    console.log("First Admin account created.");
};

createFirstAdmin()
    .catch((error) => {
        console.error(`Admin setup failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
