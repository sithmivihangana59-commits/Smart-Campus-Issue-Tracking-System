const User = require("../models/User");
const Issue = require("../models/Issue");
const bcrypt = require("bcryptjs");

const validRoles = ["Student", "Staff", "Admin"];

// =====================================================
// GET CURRENT USER PROFILE
// =====================================================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile retrieved successfully!",
            user: user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        res.status(500).json({
            message: "Failed to retrieve profile",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE CURRENT USER PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL STAFF MEMBERS (Admin use - for assigning)
// =====================================================

const getStaffList = async (req, res) => {
    try {
        const staffList = await User.find({ role: "Staff" }).select(
            "-password"
        );

        res.status(200).json({
            message: "Staff list retrieved successfully!",
            count: staffList.length,
            staff: staffList
        });

    } catch (error) {
        console.error("Get Staff List Error:", error);

        res.status(500).json({
            message: "Failed to retrieve staff list",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL USERS (Admin only)
// =====================================================

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Users retrieved successfully!",
            count: users.length,
            users: users
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        res.status(500).json({
            message: "Failed to retrieve users",
            error: error.message
        });
    }
};

// =====================================================
// CREATE USER (Admin only; public registration stays Student-only)
// =====================================================

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof password !== "string" || password.length < 6 ||
            !role
        ) {
            return res.status(400).json({
                message: "Valid name, email, role and a password of at least 6 characters are required"
            });
        }

        if (!["Staff", "Admin"].includes(role)) {
            return res.status(400).json({
                message: "Role must be Staff or Admin"
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: await bcrypt.hash(password, 10),
            role
        });

        res.status(201).json({
            message: "User created successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(error.code === 11000 ? 409 : 500).json({
            message: error.code === 11000
                ? "User with this email already exists"
                : "Failed to create user"
        });
    }
};

// =====================================================
// UPDATE USER (Admin only)
// =====================================================

const updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (email !== undefined) {
            if (typeof email !== "string" || !email.trim()) {
                return res.status(400).json({ message: "A valid email is required" });
            }
            updates.email = email.trim().toLowerCase();
        }
        if (role !== undefined) {
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid user role" });
            }
            if (
                String(req.params.id) === String(req.user.userId) &&
                role !== "Admin"
            ) {
                return res.status(400).json({
                    message: "You cannot demote your own Admin account"
                });
            }
            updates.role = role;
        }
        if (password !== undefined) {
            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long"
                });
            }
            updates.password = await bcrypt.hash(password, 10);
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "At least one field is required" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully!",
            user
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(error.code === 11000 ? 409 : 500).json({
            message: error.code === 11000
                ? "User with this email already exists"
                : "Failed to update user"
        });
    }
};

// =====================================================
// PATCH USER ROLE / ACTIVE STATUS (Admin only)
// =====================================================

const patchUser = async (req, res) => {
    try {
        const allowedFields = ["role", "isActive"];
        const receivedFields = Object.keys(req.body || {});
        if (
            receivedFields.length === 0 ||
            receivedFields.some((field) => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                message: "Only role and isActive may be updated"
            });
        }

        if (
            req.body.role !== undefined &&
            !validRoles.includes(req.body.role)
        ) {
            return res.status(400).json({ message: "Invalid user role" });
        }
        if (
            req.body.isActive !== undefined &&
            typeof req.body.isActive !== "boolean"
        ) {
            return res.status(400).json({
                message: "isActive must be a boolean"
            });
        }

        const isSelf = String(req.params.id) === String(req.user.userId);
        if (isSelf && req.body.role !== undefined && req.body.role !== "Admin") {
            return res.status(400).json({
                message: "You cannot demote your own Admin account"
            });
        }
        if (isSelf && req.body.isActive === false) {
            return res.status(400).json({
                message: "You cannot deactivate your own account"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully!",
            user
        });
    } catch (error) {
        console.error("Patch User Error:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};


// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

const getDashboardStats = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const pendingIssues = await Issue.countDocuments({
            status: "Pending"
        });
        const inProgressIssues = await Issue.countDocuments({
            status: "In Progress"
        });
        const resolvedIssues = await Issue.countDocuments({
            status: "Resolved"
        });
        const rejectedIssues = await Issue.countDocuments({
            status: "Rejected"
        });

        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({
            role: "Student"
        });
        const totalStaff = await User.countDocuments({ role: "Staff" });
        const totalAdmins = await User.countDocuments({ role: "Admin" });

        // Recent 5 issues
        const recentIssues = await Issue.find()
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            message: "Dashboard stats retrieved successfully!",
            stats: {
                issues: {
                    total: totalIssues,
                    pending: pendingIssues,
                    inProgress: inProgressIssues,
                    resolved: resolvedIssues,
                    rejected: rejectedIssues
                },
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    staff: totalStaff,
                    admins: totalAdmins
                }
            },
            recentIssues: recentIssues
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        res.status(500).json({
            message: "Failed to retrieve dashboard stats",
            error: error.message
        });
    }
};

// =====================================================
// ADMIN OVERVIEW CONTRACT
// =====================================================

const getAdminOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            totalStudents,
            totalStaff,
            totalAdmins,
            activeUsers,
            inactiveUsers,
            totalIssues,
            pendingIssues,
            inProgressIssues,
            resolvedIssues,
            rejectedIssues,
            users,
            issues
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "Student" }),
            User.countDocuments({ role: "Staff" }),
            User.countDocuments({ role: "Admin" }),
            User.countDocuments({ isActive: { $ne: false } }),
            User.countDocuments({ isActive: false }),
            Issue.countDocuments(),
            Issue.countDocuments({ status: "Pending" }),
            Issue.countDocuments({ status: "In Progress" }),
            Issue.countDocuments({ status: "Resolved" }),
            Issue.countDocuments({ status: "Rejected" }),
            User.find().select("-password").sort({ createdAt: -1 }),
            Issue.find()
                .populate("reportedBy", "name email role")
                .populate("assignedTo", "name email role")
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        res.status(200).json({
            stats: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    staff: totalStaff,
                    admins: totalAdmins,
                    active: activeUsers,
                    inactive: inactiveUsers
                },
                issues: {
                    total: totalIssues,
                    pending: pendingIssues,
                    inProgress: inProgressIssues,
                    resolved: resolvedIssues,
                    rejected: rejectedIssues
                }
            },
            users,
            issues
        });
    } catch (error) {
        console.error("Admin Overview Error:", error);
        res.status(500).json({ message: "Failed to retrieve admin overview" });
    }
};


// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
    getProfile,
    updateProfile,
    getStaffList,
    getAllUsers,
    getDashboardStats,
    createUser,
    updateUser,
    patchUser,
    getAdminOverview
};
