const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const Issue = require("../models/Issue");
const User = require("../models/User");
const issueRoutes = require("../routes/issueRoutes");

test("multipart issue uploads accept supported images, serve them, and enforce upload limits", async () => {
    const originalSecret = process.env.JWT_SECRET;
    const originalFindById = User.findById;
    const originalSave = Issue.prototype.save;
    const userId = "507f1f77bcf86cd799439011";
    const uploadDirectory = path.join(__dirname, "..", "uploads");
    const savedFiles = [];
    const app = express();
    const server = app.listen(0, "127.0.0.1");

    process.env.JWT_SECRET = "issue-upload-test-secret";
    User.findById = () => ({
        select: async () => ({ _id: userId, role: "Student", isActive: true })
    });
    Issue.prototype.save = async function () {
        return this;
    };
    app.use("/api/issues", issueRoutes);
    app.use("/uploads", express.static(uploadDirectory));

    try {
        await new Promise((resolve) => server.once("listening", resolve));
        const baseUrl = `http://127.0.0.1:${server.address().port}`;
        const token = jwt.sign({ userId, role: "Student" }, process.env.JWT_SECRET);

        for (const image of [
            { filename: "issue.png", type: "image/png" },
            { filename: "issue.jpg", type: "image/jpeg" },
            { filename: "issue.jpeg", type: "image/jpeg" },
            { filename: "issue.webp", type: "image/webp" }
        ]) {
            const bytes = Buffer.from(`image-${image.filename}`);
            const form = new FormData();
            form.append("category", "maintenance");
            form.append("building", "Library");
            form.append("title", "Photo upload test");
            form.append("description", "Testing photo evidence");
            form.append("priority", "Medium");
            form.append("image", new Blob([bytes], { type: image.type }), image.filename);

            const response = await fetch(`${baseUrl}/api/issues`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form
            });
            const result = await response.json();

            assert.equal(response.status, 201);
            assert.match(result.issue.image, /^\/uploads\/.+/);
            const filename = path.basename(result.issue.image);
            savedFiles.push(filename);

            const imageResponse = await fetch(`${baseUrl}${result.issue.image}`);
            assert.equal(imageResponse.status, 200);
            assert.deepEqual(Buffer.from(await imageResponse.arrayBuffer()), bytes);
        }

        const invalidForm = new FormData();
        invalidForm.append("category", "maintenance");
        invalidForm.append("building", "Library");
        invalidForm.append("title", "Invalid photo test");
        invalidForm.append("description", "Unsupported photo type");
        invalidForm.append("image", new Blob(["not an image"], { type: "image/gif" }), "issue.gif");
        const invalidResponse = await fetch(`${baseUrl}/api/issues`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: invalidForm
        });
        assert.equal(invalidResponse.status, 400);
        assert.match((await invalidResponse.json()).message, /PNG, JPG, JPEG or WEBP/i);

        const oversizedForm = new FormData();
        oversizedForm.append("category", "maintenance");
        oversizedForm.append("building", "Library");
        oversizedForm.append("title", "Oversized photo test");
        oversizedForm.append("description", "Photo exceeds the upload limit");
        oversizedForm.append(
            "image",
            new Blob([Buffer.alloc(10 * 1024 * 1024 + 1)], { type: "image/png" }),
            "large.png"
        );
        const oversizedResponse = await fetch(`${baseUrl}/api/issues`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: oversizedForm
        });
        assert.equal(oversizedResponse.status, 413);
        assert.match((await oversizedResponse.json()).message, /10MB or smaller/i);
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        for (const filename of savedFiles) {
            await fs.promises.unlink(path.join(uploadDirectory, filename));
        }
        User.findById = originalFindById;
        Issue.prototype.save = originalSave;
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    }
});
