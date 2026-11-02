const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    getStaffList,
    getAllUsers,
    getDashboardStats,
    createUser,
    updateUser,
    patchUser,
    getAdminOverview
} = require("../controllers/userController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// GET MY PROFILE
// =====================================================

router.get(
    "/profile",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    getProfile
);


// =====================================================
// UPDATE MY PROFILE
// =====================================================

router.put(
    "/profile",
    protect,
    authorizeRoles("Student", "Staff", "Admin"),
    updateProfile
);


// =====================================================
// GET ALL STAFF (for assigning issues)
// =====================================================

router.get(
    "/staff",
    protect,
    authorizeRoles("Admin", "Staff"),
    getStaffList
);


// =====================================================
// GET ALL USERS (Admin only)
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles("Admin"),
    getAllUsers
);

// =====================================================
// CREATE USERS (Admin only)
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles("Admin"),
    createUser
);

// =====================================================
// ADMIN OVERVIEW
// =====================================================

router.get(
    "/admin/overview",
    protect,
    authorizeRoles("Admin"),
    getAdminOverview
);

// =====================================================
// PATCH USER ROLE / ACTIVE STATUS (Admin only)
// =====================================================

router.patch(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    patchUser
);

// =====================================================
// UPDATE USERS (Admin only)
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    updateUser
);

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

router.get(
    "/dashboard/stats",
    protect,
    authorizeRoles("Admin"),
    getDashboardStats
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
