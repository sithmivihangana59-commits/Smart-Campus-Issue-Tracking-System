const test = require("node:test");
const assert = require("node:assert/strict");
const Issue = require("../models/Issue");
const User = require("../models/User");
const IssueUpdate = require("../models/IssueUpdate");
const {
    assignIssue,
    createIssue,
    getAllIssues,
    updateIssue
} = require("../controllers/issueController");
const {
    addIssueUpdate,
    getIssueUpdates
} = require("../controllers/issueUpdateController");

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

const populatedQuery = (value) => ({
    populate() {
        return this;
    },
    then(resolve, reject) {
        return Promise.resolve(value).then(resolve, reject);
    }
});

test("student issue creation keeps reporter, priority, pending status and optional room", async () => {
    const originalSave = Issue.prototype.save;
    Issue.prototype.save = async function () {
        return this;
    };

    try {
        const res = responseMock();
        await createIssue({
            body: {
                category: "maintenance",
                building: "Library",
                title: "Broken light",
                description: "The light is out",
                priority: "High"
            },
            user: {
                userId: "507f1f77bcf86cd799439011",
                role: "Student"
            }
        }, res);

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.issue.reportedBy.toString(), "507f1f77bcf86cd799439011");
        assert.equal(res.body.issue.assignedTo, null);
        assert.equal(res.body.issue.room, "");
        assert.equal(res.body.issue.priority, "High");
        assert.equal(res.body.issue.status, "Pending");
        assert.equal(Issue.schema.options.timestamps, true);
    } finally {
        Issue.prototype.save = originalSave;
    }
});

test("GET all issues returns unassigned student issues to Staff and limits Students to their own", async () => {
    const originalFind = Issue.find;
    const unassignedIssue = { _id: "issue-id", assignedTo: null };
    let queryFilter;

    Issue.find = (filter) => {
        queryFilter = filter;
        return {
            populate() {
                return this;
            },
            sort() {
                return Promise.resolve([unassignedIssue]);
            }
        };
    };

    try {
        const staffResponse = responseMock();
        await getAllIssues({ user: { userId: "staff-id", role: "Staff" } }, staffResponse);

        assert.deepEqual(queryFilter, {});
        assert.deepEqual(staffResponse.body.issues, [unassignedIssue]);

        const studentResponse = responseMock();
        await getAllIssues({ user: { userId: "student-id", role: "Student" } }, studentResponse);

        assert.deepEqual(queryFilter, { reportedBy: "student-id" });
    } finally {
        Issue.find = originalFind;
    }
});

test("Staff can assign an unassigned issue and update its status", async () => {
    const originalFindById = Issue.findById;
    const originalUserFindById = User.findById;
    const issue = {
        _id: "issue-id",
        assignedTo: null,
        status: "Pending",
        async save() {
            return this;
        }
    };
    let findByIdCall = 0;

    Issue.findById = () => {
        findByIdCall += 1;
        return findByIdCall % 2 === 1 ? issue : populatedQuery(issue);
    };
    User.findById = async () => ({ role: "Staff" });

    try {
        const assignmentResponse = responseMock();
        await assignIssue({
            params: { id: issue._id },
            body: { staffId: "staff-id" },
            user: { userId: "other-staff-id", role: "Staff" }
        }, assignmentResponse);

        assert.equal(assignmentResponse.statusCode, 200);
        assert.equal(issue.assignedTo, "staff-id");

        const statusResponse = responseMock();
        await updateIssue({
            params: { id: issue._id },
            body: { status: "In Progress" },
            user: { userId: "other-staff-id", role: "Staff" }
        }, statusResponse);

        assert.equal(statusResponse.statusCode, 200);
        assert.equal(issue.status, "In Progress");
    } finally {
        Issue.findById = originalFindById;
        User.findById = originalUserFindById;
    }
});

test("Staff can add updates and read history for an unassigned issue", async () => {
    const originalIssueFindById = Issue.findById;
    const originalUpdateSave = IssueUpdate.prototype.save;
    const originalUpdateFind = IssueUpdate.find;
    const issue = {
        _id: "issue-id",
        assignedTo: null,
        status: "Pending",
        async save() {
            return this;
        }
    };
    const savedUpdate = { issue: issue._id, status: "Pending", message: "Reviewed" };
    const updates = [savedUpdate];

    Issue.findById = async () => issue;
    IssueUpdate.prototype.save = async function () {
        return savedUpdate;
    };
    IssueUpdate.find = () => ({
        populate() {
            return this;
        },
        sort() {
            return Promise.resolve(updates);
        }
    });

    try {
        const addResponse = responseMock();
        await addIssueUpdate({
            params: { id: issue._id },
            body: { status: "Pending", message: "Reviewed" },
            user: { userId: "staff-id", role: "Staff" }
        }, addResponse);

        assert.equal(addResponse.statusCode, 201);
        assert.equal(issue.status, "Pending");

        const historyResponse = responseMock();
        await getIssueUpdates({
            params: { id: issue._id },
            user: { userId: "staff-id", role: "Staff" }
        }, historyResponse);

        assert.equal(historyResponse.statusCode, 200);
        assert.deepEqual(historyResponse.body.updates, updates);
    } finally {
        Issue.findById = originalIssueFindById;
        IssueUpdate.prototype.save = originalUpdateSave;
        IssueUpdate.find = originalUpdateFind;
    }
});
