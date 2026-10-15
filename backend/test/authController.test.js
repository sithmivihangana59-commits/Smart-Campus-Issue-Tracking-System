const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");
const { patchUser, createUser } = require("../controllers/userController");

const responseMock = () => ({
    statusCode: 200,
    body: null,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    }
});

test("public registration ignores the requested role and creates a Student", async () => {
    const originalFindOne = User.findOne;
    const originalSave = User.prototype.save;

    User.findOne = async () => null;
    User.prototype.save = async function () {
        return this;
    };

    try {
        const res = responseMock();
        await registerUser({
            body: {
                name: "New User",
                email: "new@example.com",
                password: "password123",
                role: "Admin"
            }
        }, res);

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.user.role, "Student");
        assert.equal(res.body.user.email, "new@example.com");
        assert.equal(Object.hasOwn(res.body.user, "password"), false);
    } finally {
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
    }
});

test("login returns the Admin role and never returns the password", async () => {
    const originalFindOne = User.findOne;
    const originalSecret = process.env.JWT_SECRET;
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 4);

    User.findOne = async () => ({
        _id: "507f1f77bcf86cd799439011",
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "Admin"
    });

    test("admin user creation rejects Student role", async () => {
        const res = responseMock();
        await createUser({
            body: {
                name: "Student User",
                email: "student@example.com",
                password: "password123",
                role: "Student"
            }
        }, res);

        assert.equal(res.statusCode, 400);
        assert.match(res.body.message, /Staff or Admin/);
    });

    test("an Admin cannot demote or deactivate their own account", async () => {
        for (const body of [{ role: "Staff" }, { isActive: false }]) {
            const res = responseMock();
            await patchUser({
                params: { id: "admin-id" },
                user: { userId: "admin-id", role: "Admin" },
                body
            }, res);

            assert.equal(res.statusCode, 400);
        }
    });
    process.env.JWT_SECRET = "test-secret";

    try {
        const res = responseMock();
        await loginUser({
            body: { email: "ADMIN@example.com", password }
        }, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.user.role, "Admin");
        assert.equal(Object.hasOwn(res.body.user, "password"), false);
        assert.equal(jwt.verify(res.body.token, process.env.JWT_SECRET).role, "Admin");
    } finally {
        User.findOne = originalFindOne;
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    }
});
