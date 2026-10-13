const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");


// =====================================================
// MULTER SETUP (Image Upload)
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG and PNG images are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});


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
    upload.single("image"),
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