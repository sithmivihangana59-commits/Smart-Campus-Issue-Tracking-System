const mongoose = require("mongoose");

const issueUpdateSchema = new mongoose.Schema(
    {
        issue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const IssueUpdate = mongoose.model(
    "IssueUpdate",
    issueUpdateSchema
);

module.exports = IssueUpdate;