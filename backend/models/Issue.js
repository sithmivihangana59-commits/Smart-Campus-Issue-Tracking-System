const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true
        },

        building: {
            type: String,
            required: true
        },

        room: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending"
        },

        // Student who reported the issue
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Staff member assigned to handle the issue
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // Optional image attached to the issue
        image: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;