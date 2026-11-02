const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "..", "uploads");

// =====================================================
// MULTER SETUP (Image Upload)
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir(uploadDirectory, { recursive: true }, (error) => {
            cb(error, uploadDirectory);
        });
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Only PNG, JPG, JPEG and WEBP images are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

const uploadIssueImage = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
            const message = error.code === "LIMIT_FILE_SIZE"
                ? "Photo evidence must be 10MB or smaller."
                : "Unable to process the uploaded photo.";
            return res.status(status).json({ message });
        }

        if (error.message === "Only PNG, JPG, JPEG and WEBP images are allowed") {
            return res.status(400).json({
                message: "Choose a PNG, JPG, JPEG or WEBP image."
            });
        }

        console.error("Issue photo upload error:", error);
        return res.status(500).json({
            message: "Unable to save photo evidence. Please try again."
        });
    });
};


// =====================================================
// ISSUE CONTROLLER
// =====================================================

const {
    createIssue,
    getAllIssues,
    getMyIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    getAssignedIssues
} = require("../controllers/issueController");


// =====================================================
// ISSUE UPDATE CONTROLLER
// =====================================================

const {
    addIssueUpdate,
    getIssueUpdates
} = require("../controllers/issueUpdateController");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// CREATE ISSUE (with optional image upload)
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    uploadIssueImage,
    createIssue
);


// =====================================================
// GET MY ISSUES
// =====================================================

router.get(
    "/my",
    protect,
    authorizeRoles("Student"),
    getMyIssues
);


// =====================================================
// GET ASSIGNED ISSUES (Staff)
// =====================================================

router.get(
    "/assigned",
    protect,
    authorizeRoles("Staff"),
    getAssignedIssues
);


// =====================================================
// GET ALL ISSUES
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    getAllIssues
);


// =====================================================
// GET ONE ISSUE
// =====================================================

router.get(
    "/:id",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    getIssueById
);


// =====================================================
// UPDATE ISSUE
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("Staff", "Admin"),
    updateIssue
);


// =====================================================
// ASSIGN ISSUE TO STAFF
// =====================================================

router.put(
    "/:id/assign",
    protect,
    authorizeRoles("Admin", "Staff"),
    assignIssue
);


// =====================================================
// DELETE ISSUE
// =====================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    deleteIssue
);


// =====================================================
// ADD ISSUE UPDATE
// =====================================================

router.post(
    "/:id/updates",
    protect,
    authorizeRoles("Staff", "Admin"),
    addIssueUpdate
);


// =====================================================
// GET ISSUE UPDATES
// =====================================================

router.get(
    "/:id/updates",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    getIssueUpdates
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;