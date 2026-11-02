# Backend administration

## Create the first Admin

The public `/api/auth/register` endpoint always creates a `Student`; it ignores
any role included in the request. To bootstrap the first administrator, set
`MONGO_URI`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the process
environment (or the backend's existing `.env` file), then run:

```powershell
npm run create-admin
```

The setup command hashes the password and refuses to run if an Admin already
exists. It does not print credentials.

## Admin API contracts

All routes below require `Authorization: Bearer <token>` for an active Admin.
All user responses omit `password`.

- `GET /api/users` returns `{ message, count, users }`; `users` is newest first
  and contains user documents with `_id`, `name`, `email`, `role`, `isActive`,
  and timestamps.
- `POST /api/users` accepts `{ name, email, password, role }`. `role` must be
  `Staff` or `Admin`. Returns HTTP 201 with
  `{ message, user: { id, name, email, role, isActive } }`.
- `PATCH /api/users/:id` accepts only `{ role?, isActive? }` (at least one
  field). `role` must be `Student`, `Staff`, or `Admin`; `isActive` must be a
  boolean. Returns `{ message, user }`, where `user` is the updated
  password-redacted user document. An Admin cannot demote or deactivate their
  own account.
- `GET /api/users/admin/overview` returns:

  ```json
  {
    "stats": {
      "users": {
        "total": 0, "students": 0, "staff": 0, "admins": 0,
        "active": 0, "inactive": 0
      },
      "issues": {
        "total": 0, "pending": 0, "inProgress": 0,
        "resolved": 0, "rejected": 0
      }
    },
    "users": [],
    "issues": []
  }
  ```

  `users` contains all password-redacted users newest first. `issues` contains
  the ten newest issues, with `reportedBy` and `assignedTo` populated.

The existing `PUT /api/users/:id` remains available for name, email, password,
or role administration; it also prevents self-demotion. Existing issue APIs
remain the mechanism for listing/updating/assigning issues and issue updates.

## Authorization

- Admins can access all issues, manage users, and read dashboard stats.
- Staff can list and access only issues assigned to them; they can update status
  or priority and post updates only on assigned issues.
- Students can list/read issues and updates only for issues they reported.
- Profile endpoints are available to each authenticated role. Staff-list access
  remains available to Admins and Staff.

Run the backend tests with `npm test`.
