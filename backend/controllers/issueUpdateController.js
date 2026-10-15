const Issue = require("../models/Issue");
const IssueUpdate = require("../models/IssueUpdate");

// Add an update to an issue
const addIssueUpdate = async (req, res) => {
    try {
        const { status, message } = req.body;
        const issueId = req.params.id;

        // Check whether issue exists
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // Check required fields
        if (!status || !message) {
            return res.status(400).json({
                message: "Status and message are required"
            });
        }

        // Create issue update
        const newUpdate = new IssueUpdate({
            issue: issueId,
            status: status,
            message: message,
            updatedBy: req.user.userId
        });

        const savedUpdate = await newUpdate.save();

        // Update current issue status
        issue.status = status;
        await issue.save();

        res.status(201).json({
            message: "Issue update added successfully!",
            update: savedUpdate
        });

    } catch (error) {
        console.error("Add Issue Update Error:", error);

        res.status(500).json({
            message: "Failed to add issue update",
            error: error.message
        });
    }
};


// Get all updates of an issue
const getIssueUpdates = async (req, res) => {
    try {
        const issueId = req.params.id;

        // Check whether issue exists
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (
            req.user.role === "Student" &&
            issue.reportedBy.toString() !== req.user.userId.toString()
        ) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // Get issue updates
        const updates = await IssueUpdate.find({
            issue: issueId
        })
            .populate("updatedBy", "name email role")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Issue updates retrieved successfully!",
            count: updates.length,
            updates: updates
        });

    } catch (error) {
        console.error("Get Issue Updates Error:", error);

        res.status(500).json({
            message: "Failed to retrieve issue updates",
            error: error.message
        });
    }
};


module.exports = {
    addIssueUpdate,
    getIssueUpdates
};