<template>
  <q-page class="admin-page">
    <div class="admin-shell">
      <header class="admin-header">
        <div class="brand">
          <div class="brand-mark"><q-icon name="school" size="21px" /></div>
          <div>
            <div class="brand-name">CAMPUSCARE</div>
            <div class="brand-caption">Administration Portal</div>
          </div>
        </div>
        <div class="admin-identity">
          <div class="identity-copy">
            <strong>{{ currentUser.name || 'Administrator' }}</strong>
            <span>{{ currentUser.email }}</span>
            <span class="admin-role">Admin</span>
          </div>
          <q-btn flat no-caps icon="logout" label="Sign Out" @click="signOut" />
        </div>
      </header>

      <section class="page-heading">
        <div class="eyebrow"><q-icon name="admin_panel_settings" /> CAMPUSCARE ADMINISTRATION</div>
        <h1>Admin Dashboard</h1>
        <p>System overview and campus issue management</p>
      </section>

      <nav class="section-nav" aria-label="Admin dashboard sections">
        <a href="#overview">Overview</a>
        <a href="#users">User Management</a>
        <a href="#staff">Staff Management</a>
        <a href="#issues">Issue Management</a>
      </nav>

      <div v-if="usersError || issuesError" class="page-error" role="alert">
        <q-icon name="error_outline" />
        <span>{{ usersError || issuesError }}</span>
        <button @click="loadDashboard">Retry</button>
      </div>
      <div v-if="issueNotice" class="issue-notice" role="status">
        <q-icon name="check_circle" />
        <span>{{ issueNotice }}</span>
        <button aria-label="Dismiss notification" @click="issueNotice = ''">Dismiss</button>
      </div>

      <section id="overview" class="dashboard-section">
        <div class="section-heading">
          <div>
            <h2>System Overview</h2>
            <p>Live counts from CampusCare records</p>
          </div>
          <q-btn flat round icon="refresh" aria-label="Refresh dashboard" :loading="refreshing" @click="loadDashboard" />
        </div>

        <div v-if="initialLoading" class="loading-card">
          <q-spinner color="primary" size="32px" />
          <span>Loading system data...</span>
        </div>

        <div v-else class="stat-grid">
          <article v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-icon" :class="stat.tone"><q-icon :name="stat.icon" size="20px" /></div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </article>
        </div>
      </section>

      <section v-if="!initialLoading" class="overview-grid">
        <article class="panel overview-panel">
          <div class="panel-heading">
            <div><h2>Issues by Status</h2><p>Current workflow distribution</p></div>
          </div>
          <div class="bar-list">
            <div v-for="item in statusOverview" :key="item.label" class="bar-item">
              <div class="bar-label"><span>{{ item.label }}</span><strong>{{ item.count }}</strong></div>
              <div class="bar-track"><span :class="item.tone" :style="{ width: barWidth(item.count, statusOverview) }"></span></div>
            </div>
          </div>
        </article>

        <article class="panel overview-panel">
          <div class="panel-heading">
            <div><h2>Issues by Priority</h2><p>Reported urgency levels</p></div>
          </div>
          <div class="bar-list">
            <div v-for="item in priorityOverview" :key="item.label" class="bar-item">
              <div class="bar-label"><span>{{ item.label }}</span><strong>{{ item.count }}</strong></div>
              <div class="bar-track"><span :class="item.tone" :style="{ width: barWidth(item.count, priorityOverview) }"></span></div>
            </div>
          </div>
        </article>

        <article class="panel category-panel">
          <div class="panel-heading">
            <div><h2>Issues by Category</h2><p>Based on categories used in issue reporting</p></div>
          </div>
          <div class="category-chips">
            <div v-for="item in categoryOverview" :key="item.label" class="category-chip">
              <span>{{ item.label }}</span><strong>{{ item.count }}</strong>
            </div>
          </div>
        </article>
      </section>

      <section id="users" class="dashboard-section panel">
        <div class="section-heading">
          <div><h2>User Management</h2><p>Review accounts and manage roles</p></div>
          <q-btn unelevated no-caps icon="person_add" label="Create Staff / Admin" class="primary-action" @click="openCreateUser" />
        </div>
        <div class="toolbar">
          <label class="search-box">
            <q-icon name="search" />
            <input v-model="userSearch" type="search" placeholder="Search name or email" />
          </label>
          <select v-model="userRoleFilter" aria-label="Filter users by role">
            <option value="">All roles</option>
            <option>Student</option><option>Staff</option><option>Admin</option>
          </select>
        </div>

        <div v-if="usersLoading" class="loading-card compact"><q-spinner color="primary" /> Loading users...</div>
        <div v-else-if="filteredUsers.length === 0" class="empty-state">No users match this search.</div>
        <div v-else class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Account</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="userId(user)">
                <td data-label="User"><strong>{{ user.name || '—' }}</strong><small>{{ userId(user) }}</small></td>
                <td data-label="Email">{{ user.email || '—' }}</td>
                <td data-label="Role">
                  <select :value="user.role" :disabled="isCurrentUser(user) || busyUsers.has(userId(user))" aria-label="Change user role" @change="changeRole(user, $event.target.value)">
                    <option>Student</option><option>Staff</option><option>Admin</option>
                  </select>
                </td>
                <td data-label="Account">
                  <span class="account-state" :class="{ inactive: !isActive(user) }">
                    {{ isActive(user) ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td data-label="Actions">
                  <button class="table-action" :disabled="isCurrentUser(user) || busyUsers.has(userId(user))" @click="toggleActive(user)">
                    {{ isActive(user) ? 'Deactivate' : 'Activate' }}
                  </button>
                  <span v-if="isCurrentUser(user)" class="self-note">Current account</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="staff" class="dashboard-section panel">
        <div class="section-heading">
          <div><h2>Staff Management</h2><p>Assigned workload and resolution counts</p></div>
        </div>
        <div v-if="staffWorkload.length === 0" class="empty-state">No staff accounts found.</div>
        <div v-else class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Staff Member</th><th>Email</th><th>Active Assigned</th><th>Resolved</th></tr></thead>
            <tbody>
              <tr v-for="staff in staffWorkload" :key="userId(staff)">
                <td data-label="Staff Member"><strong>{{ staff.name || '—' }}</strong></td>
                <td data-label="Email">{{ staff.email || '—' }}</td>
                <td data-label="Active Assigned"><span class="count-badge">{{ activeWorkload(staff) }}</span></td>
                <td data-label="Resolved"><span class="count-badge resolved-count">{{ resolvedWorkload(staff) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="issues" class="dashboard-section panel">
        <div class="section-heading">
          <div><h2>Issue Management</h2><p>Search, filter, review and manage reported issues</p></div>
          <q-btn flat round icon="refresh" aria-label="Refresh issues" :loading="issuesLoading" @click="loadIssues" />
        </div>
        <div class="toolbar issue-toolbar">
          <label class="search-box">
            <q-icon name="search" />
            <input v-model="issueSearch" type="search" placeholder="Search issue, reporter or location" />
          </label>
          <select v-model="issueStatusFilter" aria-label="Filter issues by status">
            <option value="">All statuses</option>
            <option>Pending</option><option>In Progress</option><option>Resolved</option><option>Rejected</option>
          </select>
          <select v-model="issuePriorityFilter" aria-label="Filter issues by priority">
            <option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select v-model="issueCategoryFilter" aria-label="Filter issues by category">
            <option value="">All categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div v-if="issuesLoading" class="loading-card compact"><q-spinner color="primary" /> Loading issues...</div>
        <div v-else-if="filteredIssues.length === 0" class="empty-state">No issues match these filters.</div>
        <div v-else class="table-scroll">
          <table class="admin-table issue-table">
            <thead><tr><th>Issue</th><th>Category</th><th>Location</th><th>Priority</th><th>Status</th><th>Reported By</th><th>Assigned To</th><th>Date</th><th></th></tr></thead>
            <tbody>
              <tr v-for="issue in filteredIssues" :key="issue._id">
                <td data-label="Issue"><strong>{{ issue.title }}</strong><small>#{{ shortId(issue._id) }}</small></td>
                <td data-label="Category">{{ issue.category || '—' }}</td>
                <td data-label="Location">{{ issue.building || '—' }}<small v-if="issue.room">{{ issue.room }}</small></td>
                <td data-label="Priority"><span class="priority-tag">{{ issue.priority || 'Medium' }}</span></td>
                <td data-label="Status"><span class="status-tag" :class="statusTone(issue.status)">{{ issue.status || 'Pending' }}</span></td>
                <td data-label="Reported By">{{ issue.reportedBy?.name || '—' }}</td>
                <td data-label="Assigned To">{{ issue.assignedTo?.name || 'Unassigned' }}</td>
                <td data-label="Date">{{ formatDate(issue.createdAt) }}</td>
                <td data-label="Details"><button class="table-action" @click="openIssue(issue)">View / Manage</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <q-dialog v-model="createUserOpen">
        <q-card class="dialog-card">
          <q-card-section class="dialog-heading">
            <div><h3>Create Staff / Admin Account</h3><p>Accounts created here are managed by the system administrator.</p></div>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-card-section>
          <q-card-section>
            <form class="dialog-form" @submit.prevent="createUser">
              <label>Full name<input v-model.trim="newUser.name" required autocomplete="name" /></label>
              <label>Email address<input v-model.trim="newUser.email" type="email" required autocomplete="email" /></label>
              <label>Temporary password<input v-model="newUser.password" type="password" required minlength="8" autocomplete="new-password" /></label>
              <label>Role<select v-model="newUser.role"><option>Staff</option><option>Admin</option></select></label>
              <div v-if="createUserError" class="inline-error">{{ createUserError }}</div>
              <q-card-actions align="right">
                <q-btn flat no-caps label="Cancel" v-close-popup />
                <q-btn unelevated no-caps type="submit" label="Create Account" class="primary-action" :loading="creatingUser" />
              </q-card-actions>
            </form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="issueDialogOpen" :maximized="$q.screen.lt.md">
        <q-card v-if="selectedIssue" class="dialog-card issue-dialog">
          <q-card-section class="dialog-heading">
            <div><div class="dialog-kicker">ISSUE #{{ shortId(selectedIssue._id) }}</div><h3>{{ selectedIssue.title }}</h3></div>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-card-section>
          <q-card-section class="issue-detail-content">
            <div class="detail-facts">
              <div><span>Category</span><strong>{{ selectedIssue.category || '—' }}</strong></div>
              <div><span>Location</span><strong>{{ selectedIssue.building || '—' }} {{ selectedIssue.room }}</strong></div>
              <div><span>Priority</span><strong>{{ selectedIssue.priority || 'Medium' }}</strong></div>
              <div><span>Reported by</span><strong>{{ selectedIssue.reportedBy?.name || '—' }}</strong></div>
              <div><span>Reported on</span><strong>{{ formatDate(selectedIssue.createdAt) }}</strong></div>
            </div>
            <p class="issue-description">{{ selectedIssue.description || 'No description provided.' }}</p>

            <div class="manage-grid">
              <label>Status
                <select v-model="selectedStatus">
                  <option>Pending</option><option>In Progress</option><option>Resolved</option><option>Rejected</option>
                </select>
                <button class="primary-action small-action" :disabled="savingIssue || selectedStatus === selectedIssue.status" @click="saveIssueStatus">Update Status</button>
              </label>
              <label>Assigned staff
                <select v-model="selectedStaffId">
                  <option value="">Unassigned</option>
                  <option v-for="staff in staffWorkload" :key="userId(staff)" :value="userId(staff)">{{ staff.name }} · {{ staff.email }}</option>
                </select>
                <button class="primary-action small-action" :disabled="savingIssue" @click="saveIssueAssignment">Save Assignment</button>
              </label>
            </div>
            <div v-if="issueActionError" class="inline-error">{{ issueActionError }}</div>
            <div v-if="issueActionSuccess" class="inline-success">{{ issueActionSuccess }}</div>

            <div class="history-block">
              <div class="history-title">Update History</div>
              <div v-if="historyLoading" class="empty-state">Loading update history...</div>
              <div v-else-if="historyError" class="inline-error">{{ historyError }}</div>
              <div v-else-if="issueHistory.length === 0" class="empty-state">No updates have been added.</div>
              <article v-for="entry in issueHistory" :key="entry._id" class="history-entry">
                <div><strong>{{ entry.status || 'Update' }}</strong><time>{{ formatDate(entry.createdAt) }}</time></div>
                <p>{{ entry.message }}</p>
                <small>By {{ entry.updatedBy?.name || 'CampusCare staff' }}</small>
              </article>
            </div>
            <label class="update-message">Add issue update
              <textarea v-model="updateMessage" rows="3" placeholder="Share a progress update..."></textarea>
            </label>
            <div class="dialog-footer">
              <span v-if="addUpdateError" class="inline-error">{{ addUpdateError }}</span>
              <q-btn unelevated no-caps icon="add_comment" label="Add Update" class="primary-action" :loading="addingUpdate" :disable="!updateMessage.trim()" @click="addIssueNote" />
            </div>
            <div v-if="currentUser.role === 'Admin'" class="delete-issue-action">
              <q-btn
                outline
                no-caps
                color="negative"
                icon="delete_outline"
                label="Delete Issue"
                :loading="deletingIssue"
                :disable="deletingIssue"
                @click="deleteConfirmOpen = true"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="deleteConfirmOpen" persistent>
        <q-card class="dialog-card delete-confirm-dialog">
          <q-card-section class="dialog-heading">
            <div>
              <div class="dialog-kicker">PERMANENT ACTION</div>
              <h3>Delete Issue?</h3>
            </div>
            <q-btn flat round dense icon="close" aria-label="Close confirmation" :disable="deletingIssue" @click="deleteConfirmOpen = false" />
          </q-card-section>
          <q-card-section class="delete-confirm-content">
            <p>Are you sure you want to permanently delete this issue? This action cannot be undone.</p>
            <div class="delete-confirm-actions">
              <q-btn flat no-caps label="Cancel" :disable="deletingIssue" @click="deleteConfirmOpen = false" />
              <q-btn unelevated no-caps color="negative" icon="delete_outline" label="Delete Issue" :loading="deletingIssue" @click="confirmDeleteIssue" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { assignIssue, getAllIssues, getIssueUpdates, addIssueUpdate, updateIssue, deleteIssue } from '@/services/issueService'
import { createManagedUser, getAdminUsers, updateManagedUser } from '@/services/adminService'

const router = useRouter()
const currentUser = ref({})
const users = ref([])
const issues = ref([])
const initialLoading = ref(true)
const refreshing = ref(false)
const usersLoading = ref(false)
const issuesLoading = ref(false)
const usersError = ref('')
const issuesError = ref('')
const userSearch = ref('')
const userRoleFilter = ref('')
const issueSearch = ref('')
const issueStatusFilter = ref('')
const issuePriorityFilter = ref('')
const issueCategoryFilter = ref('')
const busyUsers = ref(new Set())
const createUserOpen = ref(false)
const creatingUser = ref(false)
const createUserError = ref('')
const newUser = reactive({ name: '', email: '', password: '', role: 'Staff' })
const issueDialogOpen = ref(false)
const deleteConfirmOpen = ref(false)
const deletingIssue = ref(false)
const issueNotice = ref('')
const selectedIssue = ref(null)
const selectedStatus = ref('')
const selectedStaffId = ref('')
const savingIssue = ref(false)
const issueActionError = ref('')
const issueActionSuccess = ref('')
const issueHistory = ref([])
const historyLoading = ref(false)
const historyError = ref('')
const updateMessage = ref('')
const addingUpdate = ref(false)
const addUpdateError = ref('')
const categories = ['Maintenance', 'IT / Tech', 'Facility', 'Safety', 'Cleaning', 'Other']
const statuses = [
  { label: 'Pending', tone: 'blue' },
  { label: 'In Progress', tone: 'indigo' },
  { label: 'Resolved', tone: 'green' },
  { label: 'Rejected', tone: 'red' }
]
const priorities = [
  { label: 'Low', tone: 'blue' },
  { label: 'Medium', tone: 'indigo' },
  { label: 'High', tone: 'amber' }
]

const studentCount = computed(() => users.value.filter(user => user.role === 'Student').length)
const staffWorkload = computed(() => users.value.filter(user => user.role === 'Staff'))
const stats = computed(() => [
  { label: 'Total Users', value: users.value.length, icon: 'groups', tone: 'blue' },
  { label: 'Students', value: studentCount.value, icon: 'school', tone: 'indigo' },
  { label: 'Staff', value: staffWorkload.value.length, icon: 'support_agent', tone: 'teal' },
  { label: 'Total Issues', value: issues.value.length, icon: 'assignment', tone: 'blue' },
  { label: 'Pending', value: countStatus('Pending'), icon: 'schedule', tone: 'amber' },
  { label: 'In Progress', value: countStatus('In Progress'), icon: 'autorenew', tone: 'indigo' },
  { label: 'Resolved', value: countStatus('Resolved'), icon: 'task_alt', tone: 'green' },
  { label: 'Rejected', value: countStatus('Rejected'), icon: 'block', tone: 'red' }
])
const statusOverview = computed(() => statuses.map(item => ({
  ...item, count: countStatus(item.label)
})))
const priorityOverview = computed(() => priorities.map(item => ({
  ...item, count: issues.value.filter(issue => issue.priority === item.label).length
})))
const categoryOverview = computed(() => categories.map(label => ({
  label, count: issues.value.filter(issue => issue.category === label).length
})))
const filteredUsers = computed(() => users.value.filter(user => {
  const query = userSearch.value.trim().toLowerCase()
  const matchesQuery = !query || `${user.name || ''} ${user.email || ''}`.toLowerCase().includes(query)
  return matchesQuery && (!userRoleFilter.value || user.role === userRoleFilter.value)
}))
const filteredIssues = computed(() => [...issues.value]
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  .filter(issue => {
    const query = issueSearch.value.trim().toLowerCase()
    const matchesQuery = !query || [
      issue.title, issue.category, issue.building, issue.room, issue.reportedBy?.name, issue.assignedTo?.name
    ].some(value => value?.toLowerCase().includes(query))
    return matchesQuery &&
      (!issueStatusFilter.value || issue.status === issueStatusFilter.value) &&
      (!issuePriorityFilter.value || issue.priority === issuePriorityFilter.value) &&
      (!issueCategoryFilter.value || issue.category === issueCategoryFilter.value)
  }))

onMounted(() => {
  try {
    currentUser.value = JSON.parse(localStorage.getItem('user') || '{}')
  } catch (err) {
    console.error('Could not read the signed-in admin profile.', err)
  }
  loadDashboard()
})

function unwrapList (data, key) {
  if (Array.isArray(data)) return data
  return Array.isArray(data?.[key]) ? data[key] : []
}

async function loadDashboard () {
  refreshing.value = true
  await Promise.all([loadUsers(), loadIssues()])
  initialLoading.value = false
  refreshing.value = false
}

async function loadUsers () {
  usersLoading.value = true
  usersError.value = ''
  try {
    users.value = unwrapList(await getAdminUsers(), 'users')
  } catch (err) {
    usersError.value = err.response?.data?.message || err.response?.data?.error || 'Could not load user accounts.'
  } finally {
    usersLoading.value = false
  }
}

async function loadIssues () {
  issuesLoading.value = true
  issuesError.value = ''
  try {
    issues.value = unwrapList(await getAllIssues(), 'issues')
  } catch (err) {
    issuesError.value = err.response?.data?.message || err.response?.data?.error || 'Could not load campus issues.'
  } finally {
    issuesLoading.value = false
  }
}

function countStatus (status) {
  return issues.value.filter(issue => issue.status === status).length
}

function barWidth (count, items) {
  const max = Math.max(1, ...items.map(item => item.count))
  return `${count === 0 ? 0 : Math.max(5, count / max * 100)}%`
}

function userId (user) {
  return user?._id || user?.id || ''
}

function isCurrentUser (user) {
  return userId(user) === (currentUser.value._id || currentUser.value.id)
}

function isActive (user) {
  return user.isActive !== false
}

function setBusy (id, value) {
  const next = new Set(busyUsers.value)
  if (value) next.add(id)
  else next.delete(id)
  busyUsers.value = next
}

async function changeRole (user, role) {
  if (!role || role === user.role || isCurrentUser(user)) return
  const id = userId(user)
  setBusy(id, true)
  usersError.value = ''
  try {
    await updateManagedUser(id, { role })
    user.role = role
  } catch (err) {
    usersError.value = err.response?.data?.message || err.response?.data?.error || 'Could not update this user role.'
  } finally {
    setBusy(id, false)
  }
}

async function toggleActive (user) {
  if (isCurrentUser(user)) return
  const id = userId(user)
  setBusy(id, true)
  usersError.value = ''
  try {
    const isActiveNext = !isActive(user)
    await updateManagedUser(id, { isActive: isActiveNext })
    user.isActive = isActiveNext
  } catch (err) {
    usersError.value = err.response?.data?.message || err.response?.data?.error || 'Could not update this account.'
  } finally {
    setBusy(id, false)
  }
}

function openCreateUser () {
  Object.assign(newUser, { name: '', email: '', password: '', role: 'Staff' })
  createUserError.value = ''
  createUserOpen.value = true
}

async function createUser () {
  creatingUser.value = true
  createUserError.value = ''
  try {
    await createManagedUser({ ...newUser })
    createUserOpen.value = false
    await loadUsers()
  } catch (err) {
    createUserError.value = err.response?.data?.message || err.response?.data?.error || 'Could not create this account.'
  } finally {
    creatingUser.value = false
  }
}

function activeWorkload (staff) {
  const id = userId(staff)
  return issues.value.filter(issue =>
    (issue.assignedTo?._id || issue.assignedTo?.id) === id &&
    !['Resolved', 'Rejected'].includes(issue.status)
  ).length
}

function resolvedWorkload (staff) {
  const id = userId(staff)
  return issues.value.filter(issue =>
    (issue.assignedTo?._id || issue.assignedTo?.id) === id &&
    issue.status === 'Resolved'
  ).length
}

async function openIssue (issue) {
  selectedIssue.value = { ...issue }
  selectedStatus.value = issue.status || 'Pending'
  selectedStaffId.value = issue.assignedTo?._id || issue.assignedTo?.id || ''
  issueActionError.value = ''
  issueActionSuccess.value = ''
  updateMessage.value = ''
  addUpdateError.value = ''
  issueDialogOpen.value = true
  await loadHistory()
}

async function loadHistory () {
  if (!selectedIssue.value?._id) return
  historyLoading.value = true
  historyError.value = ''
  try {
    issueHistory.value = unwrapList(await getIssueUpdates(selectedIssue.value._id), 'updates')
  } catch (err) {
    historyError.value = err.response?.data?.message || err.response?.data?.error || 'Could not load update history.'
  } finally {
    historyLoading.value = false
  }
}

async function saveIssueStatus () {
  if (!selectedIssue.value || !selectedStatus.value) return
  savingIssue.value = true
  issueActionError.value = ''
  issueActionSuccess.value = ''
  try {
    const data = await updateIssue(selectedIssue.value._id, { status: selectedStatus.value })
    const updated = data.issue || data
    selectedIssue.value = { ...selectedIssue.value, ...updated, status: updated.status || selectedStatus.value }
    replaceIssue(selectedIssue.value)
    issueActionSuccess.value = 'Issue status updated.'
    await loadHistory()
  } catch (err) {
    issueActionError.value = err.response?.data?.message || err.response?.data?.error || 'Could not update issue status.'
  } finally {
    savingIssue.value = false
  }
}

async function saveIssueAssignment () {
  if (!selectedIssue.value) return
  savingIssue.value = true
  issueActionError.value = ''
  issueActionSuccess.value = ''
  try {
    let result
    if (selectedStaffId.value) {
      result = await assignIssue(selectedIssue.value._id, selectedStaffId.value)
    } else {
      result = await updateIssue(selectedIssue.value._id, { assignedTo: null })
    }
    const updated = result.issue || result
    const staff = staffWorkload.value.find(user => userId(user) === selectedStaffId.value)
    selectedIssue.value = {
      ...selectedIssue.value,
      ...updated,
      assignedTo: updated.assignedTo || staff || null
    }
    replaceIssue(selectedIssue.value)
    issueActionSuccess.value = 'Issue assignment updated.'
  } catch (err) {
    issueActionError.value = err.response?.data?.message || err.response?.data?.error || 'Could not update issue assignment.'
  } finally {
    savingIssue.value = false
  }
}

async function addIssueNote () {
  if (!selectedIssue.value || !updateMessage.value.trim()) return
  addingUpdate.value = true
  addUpdateError.value = ''
  try {
    await addIssueUpdate(selectedIssue.value._id, {
      status: selectedIssue.value.status || 'Pending',
      message: updateMessage.value.trim()
    })
    updateMessage.value = ''
    await loadHistory()
  } catch (err) {
    addUpdateError.value = err.response?.data?.message || err.response?.data?.error || 'Could not add the issue update.'
  } finally {
    addingUpdate.value = false
  }
}

async function confirmDeleteIssue () {
  if (currentUser.value.role !== 'Admin' || !selectedIssue.value?._id) return

  deletingIssue.value = true
  issueActionError.value = ''
  try {
    await deleteIssue(selectedIssue.value._id)
    issues.value = issues.value.filter(issue => issue._id !== selectedIssue.value._id)
    deleteConfirmOpen.value = false
    issueDialogOpen.value = false
    selectedIssue.value = null
    await loadIssues()
    issueNotice.value = 'Issue deleted successfully.'
  } catch (err) {
    deleteConfirmOpen.value = false
    issueActionError.value = err.response?.data?.message || err.response?.data?.error || 'Could not delete the issue. Please try again.'
  } finally {
    deletingIssue.value = false
  }
}

function replaceIssue (issue) {
  const index = issues.value.findIndex(item => item._id === issue._id)
  if (index !== -1) issues.value[index] = issue
}

function shortId (id) {
  return id ? id.slice(-8).toUpperCase() : '—'
}

function formatDate (value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusTone (status) {
  return {
    Pending: 'blue',
    'In Progress': 'indigo',
    Resolved: 'green',
    Rejected: 'red'
  }[status] || 'blue'
}

function signOut () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 0 24px 64px;
  color: #17243c;
  background: #f4f7fc;
  font-family: Inter, 'Segoe UI', sans-serif;
}

.admin-shell {
  width: min(1360px, 100%);
  margin: 0 auto;
}

.admin-header,
.brand,
.admin-identity,
.section-heading,
.panel-heading,
.toolbar,
.dialog-heading,
.dialog-footer {
  display: flex;
  align-items: center;
}

.admin-header {
  justify-content: space-between;
  min-height: 78px;
  border-bottom: 1px solid #e3eaf4;
}

.brand { gap: 11px; }
.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(140deg, #144ce4, #2382fa);
  box-shadow: 0 8px 18px #2563eb30;
}
.brand-name { font-size: 15px; font-weight: 850; letter-spacing: 1.2px; }
.brand-caption { margin-top: 2px; color: #73819a; font-size: 11px; }
.admin-identity { gap: 18px; }
.identity-copy { display: grid; gap: 2px; text-align: right; }
.identity-copy strong { font-size: 13px; }
.identity-copy span { color: #77859c; font-size: 11px; }
.identity-copy .admin-role { color: #2459d9; font-weight: 700; }

.page-heading { padding: 32px 0 22px; }
.eyebrow { display: flex; align-items: center; gap: 7px; color: #2864dd; font-size: 11px; font-weight: 800; letter-spacing: 1px; }
.page-heading h1 { margin: 10px 0 5px; font-size: clamp(28px, 4vw, 36px); letter-spacing: -1px; }
.page-heading p,.section-heading p,.panel-heading p { margin: 0; color: #75839a; font-size: 13px; }
.section-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.section-nav a { padding: 9px 13px; color: #53637d; background: white; border: 1px solid #e3eaf4; border-radius: 9px; text-decoration: none; font-size: 12px; font-weight: 650; }
.section-nav a:hover { border-color: #b8cdfb; color: #2058dd; }

.dashboard-section { margin: 24px 0; scroll-margin-top: 20px; }
.section-heading { justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.section-heading h2,.panel-heading h2 { margin: 0 0 4px; font-size: 17px; letter-spacing: -.2px; }
.panel { padding: 22px; border: 1px solid #e6ecf5; border-radius: 16px; background: #fff; box-shadow: 0 9px 28px #243b6208; }
.stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
.stat-card { min-height: 108px; padding: 16px; border: 1px solid #e7edf6; border-radius: 14px; background: #fff; box-shadow: 0 8px 24px #263c6008; }
.stat-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; }
.stat-icon.blue { color: #2563eb; background: #e9f1ff; }
.stat-icon.indigo { color: #5049cf; background: #efedff; }
.stat-icon.teal { color: #0b8d88; background: #e3f8f5; }
.stat-icon.amber { color: #b77910; background: #fff4da; }
.stat-icon.green { color: #12805c; background: #e2f7ef; }
.stat-icon.red { color: #c4434d; background: #ffebed; }
.stat-value { margin-top: 10px; font-size: 25px; font-weight: 800; line-height: 1; }
.stat-label { margin-top: 5px; color: #73819a; font-size: 12px; }

.overview-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-bottom: 26px; }
.overview-panel,.category-panel { min-height: 225px; }
.category-panel { grid-column: 1 / -1; min-height: auto; }
.panel-heading { justify-content: space-between; margin-bottom: 18px; }
.bar-list { display: grid; gap: 13px; }
.bar-label { display: flex; justify-content: space-between; margin-bottom: 6px; color: #475873; font-size: 12px; }
.bar-label strong { color: #192842; }
.bar-track { height: 8px; overflow: hidden; border-radius: 99px; background: #eef2f8; }
.bar-track span { display: block; height: 100%; min-width: 0; border-radius: inherit; transition: width .2s ease; }
.bar-track .blue { background: #3477ed; }.bar-track .indigo { background: #665bd8; }.bar-track .green { background: #19a77c; }.bar-track .red { background: #e16b70; }.bar-track .amber { background: #e9a72b; }
.category-chips { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 10px; }
.category-chip { display: flex; justify-content: space-between; gap: 8px; padding: 13px 12px; border: 1px solid #e8edf5; border-radius: 10px; color: #566681; font-size: 12px; }
.category-chip strong { color: #1d3150; }

.toolbar { gap: 10px; margin: 4px 0 16px; }
.search-box { display: flex; flex: 1; min-width: 180px; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border: 1px solid #dfe7f2; border-radius: 9px; color: #8a98ad; }
.search-box:focus-within { border-color: #79a4f6; box-shadow: 0 0 0 3px #3574ed18; }
.search-box input { width: 100%; border: 0; outline: 0; color: #233650; background: transparent; font: inherit; font-size: 12px; }
.toolbar select,.admin-table select,.dialog-form input,.dialog-form select,.manage-grid select { min-width: 125px; height: 40px; padding: 0 11px; border: 1px solid #dfe7f2; border-radius: 9px; outline-color: #4c83ee; color: #34445d; background: #fff; font: inherit; font-size: 12px; }
.primary-action { color: #fff !important; background: linear-gradient(110deg,#1555e8,#2780f4) !important; border-radius: 9px !important; font-size: 12px !important; font-weight: 700 !important; }
.page-error,.inline-error { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border: 1px solid #fecaca; border-radius: 9px; color: #b4232d; background: #fff3f3; font-size: 12px; }
.page-error { margin-bottom: 16px; }
.page-error button { margin-left: auto; border: 0; color: #1c58db; background: transparent; cursor: pointer; font-weight: 700; }
.issue-notice { display: flex; align-items: center; gap: 9px; margin-bottom: 16px; padding: 11px 14px; border: 1px solid #b7e5d2; border-radius: 9px; color: #167454; background: #effbf5; font-size: 12px; }
.issue-notice button { margin-left: auto; border: 0; color: #167454; background: transparent; cursor: pointer; font: inherit; font-weight: 700; }
.loading-card,.empty-state { display: flex; min-height: 105px; align-items: center; justify-content: center; gap: 11px; color: #71809a; font-size: 13px; }
.loading-card.compact { min-height: 72px; }
.table-scroll { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; }
.admin-table th { padding: 12px 10px; border-bottom: 1px solid #e8edf5; color: #78869d; font-size: 10px; font-weight: 750; letter-spacing: .45px; text-transform: uppercase; white-space: nowrap; }
.admin-table td { padding: 12px 10px; border-bottom: 1px solid #eff2f7; color: #52627b; vertical-align: middle; }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.admin-table td strong { display: block; max-width: 210px; overflow: hidden; color: #21324c; text-overflow: ellipsis; white-space: nowrap; }
.admin-table td small { display: block; margin-top: 4px; color: #929eb0; font-size: 10px; }
.admin-table select { min-width: 95px; height: 34px; }
.admin-table select:disabled,.table-action:disabled { opacity: .55; cursor: not-allowed; }
.account-state,.status-tag,.priority-tag,.count-badge { display: inline-flex; align-items: center; padding: 5px 9px; border-radius: 99px; background: #eaf2ff; color: #275fce; font-size: 10px; font-weight: 750; white-space: nowrap; }
.account-state.inactive { color: #a33c45; background: #fff0f0; }
.status-tag.indigo { color: #554bc4; background: #efedff; }.status-tag.green { color: #187957; background: #e6f7ef; }.status-tag.red { color: #ae3c45; background: #fff0f1; }
.priority-tag { color: #4e51bb; background: #f0efff; }
.count-badge.resolved-count { color: #187957; background: #e6f7ef; }
.table-action { padding: 6px 9px; border: 0; border-radius: 7px; color: #215bd7; background: #eff5ff; cursor: pointer; font: inherit; font-size: 10px; font-weight: 700; white-space: nowrap; }
.table-action:hover { background: #e1ecff; }
.self-note { display: block; margin-top: 4px; color: #929eb0; font-size: 10px; }
.issue-table { min-width: 1040px; }
.issue-table td:first-child { max-width: 190px; }

.dialog-card { width: min(560px,94vw); max-height: 90vh; overflow-y: auto; border-radius: 16px; }
.dialog-heading { justify-content: space-between; gap: 12px; padding: 20px 22px 14px; border-bottom: 1px solid #edf1f7; }
.dialog-heading h3 { margin: 0; color: #1d2d47; font-size: 18px; }
.dialog-heading p { margin: 5px 0 0; color: #7e8aa0; font-size: 11px; }
.dialog-kicker { margin-bottom: 5px; color: #3872df; font-size: 10px; font-weight: 800; letter-spacing: .6px; }
.dialog-form { display: grid; gap: 14px; padding: 2px 4px 8px; }
.dialog-form label,.manage-grid label,.update-message { display: grid; gap: 7px; color: #4d5e77; font-size: 12px; font-weight: 650; }
.dialog-form input,.dialog-form select,.manage-grid select { width: 100%; box-sizing: border-box; }
.dialog-form .q-card__actions { margin: 4px -8px -8px; padding-right: 0; }
.issue-dialog { width: min(760px,96vw); }
.issue-detail-content { display: grid; gap: 16px; padding: 18px 22px 22px; }
.detail-facts { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
.detail-facts > div { display: grid; gap: 4px; padding: 11px; border: 1px solid #e9eef6; border-radius: 9px; }
.detail-facts span { color: #8793a7; font-size: 10px; }.detail-facts strong { color: #34445e; font-size: 12px; }
.issue-description { margin: 0; padding: 13px; border-radius: 9px; color: #596983; background: #f7f9fc; font-size: 12px; line-height: 1.65; white-space: pre-wrap; }
.manage-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 13px; }
.small-action { justify-self: start; min-height: 34px; padding: 0 12px; border: 0; cursor: pointer; }
.small-action:disabled { opacity: .45; cursor: not-allowed; }
.inline-success { color: #167454; font-size: 12px; }
.history-block { display: grid; gap: 9px; padding-top: 4px; }
.history-title { color: #273955; font-size: 13px; font-weight: 750; }
.history-entry { padding: 11px 12px; border: 1px solid #e9eef6; border-radius: 9px; }
.history-entry > div { display: flex; justify-content: space-between; gap: 10px; color: #435570; font-size: 11px; }
.history-entry time,.history-entry small { color: #8895a9; font-size: 10px; }
.history-entry p { margin: 7px 0; color: #566680; font-size: 12px; white-space: pre-wrap; }
.update-message textarea { padding: 10px; border: 1px solid #dfe7f2; border-radius: 9px; resize: vertical; font: inherit; font-size: 12px; }
.dialog-footer { justify-content: space-between; gap: 12px; }
.delete-issue-action { display: flex; justify-content: flex-end; padding-top: 14px; border-top: 1px solid #edf1f7; }
.delete-confirm-dialog { width: min(440px,94vw); }
.delete-confirm-content { display: grid; gap: 18px; padding: 18px 22px 22px; }
.delete-confirm-content p { margin: 0; color: #596983; font-size: 13px; line-height: 1.6; }
.delete-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }

@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .category-chips { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .issue-toolbar { flex-wrap: wrap; }
  .issue-toolbar .search-box { flex-basis: 100%; }
  .admin-table:not(.issue-table) thead { display: none; }
  .admin-table:not(.issue-table) tr { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; padding: 12px 4px; border-bottom: 1px solid #edf1f7; }
  .admin-table:not(.issue-table) td { display: grid; gap: 4px; padding: 5px; border: 0; }
  .admin-table:not(.issue-table) td::before { content: attr(data-label); color: #8a97aa; font-size: 9px; font-weight: 750; text-transform: uppercase; }
}

@media (max-width: 600px) {
  .admin-page { padding: 0 14px 40px; }
  .admin-header { min-height: 68px; }
  .brand-mark { width: 36px; height: 36px; }
  .brand-name { font-size: 12px; }
  .brand-caption { font-size: 9px; }
  .admin-identity { gap: 4px; }
  .identity-copy { display: none; }
  .admin-identity :deep(.q-btn) { font-size: 11px; }
  .page-heading { padding: 26px 0 18px; }
  .dashboard-section { margin: 18px 0; }
  .panel { padding: 16px 13px; border-radius: 13px; }
  .section-heading { align-items: flex-start; }
  .section-heading h2,.panel-heading h2 { font-size: 15px; }
  .section-heading p,.panel-heading p { font-size: 11px; }
  .section-heading .primary-action { max-width: 145px; white-space: normal; }
  .stat-grid { gap: 9px; }
  .stat-card { min-height: 96px; padding: 12px; }
  .stat-value { font-size: 22px; }
  .overview-grid { grid-template-columns: 1fr; gap: 12px; }
  .category-panel { grid-column: auto; }
  .category-chips { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .toolbar { flex-wrap: wrap; }
  .toolbar select { flex: 1; }
  .detail-facts { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .manage-grid { grid-template-columns: 1fr; }
  .dialog-heading { padding: 16px; }
  .issue-detail-content { padding: 14px 16px 18px; }
}
</style>
