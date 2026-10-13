const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Verify JWT token
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.userId) {
            return res.status(401).json({
                message: "Invalid or expired token."
            });
        }

        const user = await User.findById(decoded.userId).select("_id role isActive");
        if (!user || user.isActive === false) {
            return res.status(401).json({
                message: "Invalid or expired token."
            });
        }

        req.user = {
            userId: user._id,
            role: user.role
        };

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};


// Check user role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission."
            });
        }

        next();
    };
};


module.exports = {
    protect,
    authorizeRoles
};