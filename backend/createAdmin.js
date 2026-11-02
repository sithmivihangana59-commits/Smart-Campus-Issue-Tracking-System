const dns = require("dns");

// Use the DNS server that successfully resolves your MongoDB SRV record
dns.setServers(["10.215.136.60"]);

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        // Admin account details
        const adminEmail = "admin@campuscare.com";
        const adminPassword = "Admin@12345";

        // Check whether Admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            console.log("=================================");
            console.log("Admin account already exists!");
            console.log("Email:", existingAdmin.email);
            console.log("Role:", existingAdmin.role);
            console.log("=================================");

            await mongoose.disconnect();
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create Admin user
        const admin = new User({
            name: "CampusCare Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "Admin",
            isActive: true
        });

        // Save Admin to MongoDB
        await admin.save();

        console.log("=================================");
        console.log("Admin account created successfully!");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);
        console.log("Role:", admin.role);
        console.log("=================================");

        await mongoose.disconnect();

    } catch (error) {
        console.error("=================================");
        console.error("Error creating admin:", error);
        console.error("=================================");

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error("MongoDB disconnect error:", disconnectError);
        }

        process.exit(1);
    }
};

createAdmin();