const Issue = require("../models/Issue");
const fs = require("fs/promises");

const removeUploadedFile = async (file) => {
    if (!file?.path) return;

    try {
        await fs.unlink(file.path);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Failed to remove unassociated issue photo:", error);
        }
    }
};

// =====================================================
// CREATE A NEW ISSUE
// =====================================================

const createIssue = async (req, res) => {
    try {
        const {
            category,
            building,
            room,
            title,
            description,
            priority
        } = req.body;

        if (
            !category ||
            !building ||
            !title ||
            !description
        ) {
            await removeUploadedFile(req.file);
            return res.status(400).json({
                message:
                    "Category, building, title and description are required"
            });
        }

        // Handle optional image upload
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newIssue = new Issue({
            category,
            building,
            room,
            title,
            description,
            priority,
            reportedBy: req.user.userId,
            assignedTo: req.user.role === "Staff" ? req.user.userId : null,
            image: imagePath
        });

        const savedIssue = await newIssue.save();

        res.status(201).json({
            message: "Issue created successfully!",
            issue: savedIssue
        });
    } catch (error) {
        console.error("Create Issue Error:", error);
        await removeUploadedFile(req.file);

        res.status(500).json({
            message: "Failed to create issue"
        });
    }
};


// =====================================================
// GET ALL ISSUES
// =====================================================

const getAllIssues = async (req, res) => {
    try {
        const filter = req.user.role === "Student"
            ? { reportedBy: req.user.userId }
            : {};

        const issues = await Issue
            .find(filter)
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Issues retrieved successfully!",
            count: issues.length,
            issues: issues
        });
    } catch (error) {
        console.error("Get Issues Error:", error);

        res.status(500).json({
            message: "Failed to retrieve issues",
            error: error.message
        });
    }
};


// =====================================================
// GET MY ISSUES
// =====================================================

const getMyIssues = async (req, res) => {
    try {
        const userId = req.user.userId;

        const issues = await Issue
            .find({ reportedBy: userId })
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your issues retrieved successfully!",
            count: issues.length,
            issues: issues
        });
    } catch (error) {
        console.error("Get My Issues Error:", error);

        res.status(500).json({
            message: "Failed to retrieve your issues",
            error: error.message
        });
    }
};


// =====================================================
// GET ONE ISSUE BY ID
// =====================================================

const getIssueById = async (req, res) => {
    try {
        const issue =
            await Issue.findById(req.params.id)
                .populate("reportedBy", "name email role")
                .populate("assignedTo", "name email role");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (
            req.user.role === "Student" &&
            issue.reportedBy._id.toString() !== req.user.userId.toString()
        ) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({
            message: "Issue retrieved successfully!",
            issue: issue
        });
    } catch (error) {
        console.error("Get Issue Error:", error);

        res.status(500).json({
            message: "Failed to retrieve issue",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE AN ISSUE
// =====================================================

const updateIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const staffEditableFields = ["status", "priority"];
        const adminEditableFields = [
            "category",
            "building",
            "room",
            "title",
            "description",
            "priority",
            "status",
            "assignedTo",
            "image"
        ];
        const editableFields = req.user.role === "Admin"
            ? adminEditableFields
            : staffEditableFields;

        for (const field of editableFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                issue[field] = req.body[field];
            }
        }

        await issue.save();
        const updatedIssue = await Issue.findById(issue._id)
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role");

        res.status(200).json({
            message: "Issue updated successfully!",
            issue: updatedIssue
        });
    } catch (error) {
        console.error("Update Issue Error:", error);

        res.status(500).json({
            message: "Failed to update issue",
            error: error.message
        });
    }
};


// =====================================================
// DELETE AN ISSUE
// =====================================================

const deleteIssue = async (req, res) => {
    try {
        const deletedIssue =
            await Issue.findByIdAndDelete(req.params.id);

        if (!deletedIssue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.status(200).json({
            message: "Issue deleted successfully!",
            issue: deletedIssue
        });
    } catch (error) {
        console.error("Delete Issue Error:", error);

        res.status(500).json({
            message: "Failed to delete issue",
            error: error.message
        });
    }
};


// =====================================================
// ASSIGN ISSUE TO STAFF
// =====================================================

const assignIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const { staffId } = req.body;

        // Check Staff ID
        if (!staffId) {
            return res.status(400).json({
                message: "Staff ID is required"
            });
        }

        // Find issue
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // Import User model
        const User = require("../models/User");

        // Find staff user
        const staff = await User.findById(staffId);

        if (!staff) {
            return res.status(404).json({
                message: "Staff user not found"
            });
        }

        // Check user role
        if (staff.role !== "Staff") {
            return res.status(400).json({
                message: "Selected user is not a Staff member"
            });
        }

        // Assign staff
        issue.assignedTo = staffId;

        await issue.save();

        // Get updated issue with user details
        const updatedIssue = await Issue
            .findById(issueId)
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role");

        res.status(200).json({
            message: "Issue assigned successfully!",
            issue: updatedIssue
        });

    } catch (error) {
        console.error("Assign Issue Error:", error);

        res.status(500).json({
            message: "Failed to assign issue",
            error: error.message
        });
    }
};


// =====================================================
// GET ISSUES ASSIGNED TO CURRENT STAFF MEMBER
// =====================================================

const getAssignedIssues = async (req, res) => {
    try {
        const userId = req.user.userId;

        const issues = await Issue
            .find({ assignedTo: userId })
            .populate("reportedBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Assigned issues retrieved successfully!",
            count: issues.length,
            issues: issues
        });
    } catch (error) {
        console.error("Get Assigned Issues Error:", error);

        res.status(500).json({
            message: "Failed to retrieve assigned issues",
            error: error.message
        });
    }
};


// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
    createIssue,
    getAllIssues,
    getMyIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    getAssignedIssues
};