<template>
  <q-page class="staff-dashboard-page">
    <!-- BACKGROUND -->
    <div class="dash-bg">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
    </div>

    <div class="dash-wrapper">
      <!-- HEADER -->
      <div class="dash-header">
        <div class="dash-header-left">
          <div class="dash-brand" @click="goHome">
            <div class="brand-icon">
              <q-icon name="school" size="20px" />
            </div>
            <div class="brand-text">
              <div class="brand-name">CAMPUSCARE</div>
              <div class="brand-sub">Staff Portal</div>
            </div>
          </div>
        </div>

        <div class="dash-header-right">
          <div class="user-chip">
            <q-icon name="badge" size="16px" />
            <span>{{ currentUser.name || 'Staff' }}</span>
            <span class="role-badge">{{ currentUser.role }}</span>
          </div>
          <q-btn
            flat
            no-caps
            icon="logout"
            label="Sign Out"
            class="signout-btn"
            @click="signOut"
          />
        </div>
      </div>

      <!-- PAGE TITLE -->
      <div class="dash-title-block">
        <div class="title-badge">
          <q-icon name="dashboard" size="15px" />
          Staff Dashboard
        </div>
        <h1 class="dash-title">Manage Campus Issues</h1>
        <p class="dash-subtitle">
          View and manage all reported campus issues. Use the filters below to
          find specific issues quickly.
        </p>
      </div>

      <!-- STATS ROW -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon pending-icon">
            <q-icon name="hourglass_empty" size="20px" />
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ countByStatus('Pending') }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon inprogress-icon">
            <q-icon name="autorenew" size="20px" />
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ countByStatus('In Progress') }}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon resolved-icon">
            <q-icon name="check_circle" size="20px" />
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ countByStatus('Resolved') }}</div>
            <div class="stat-label">Resolved</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon total-icon">
            <q-icon name="list_alt" size="20px" />
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ issues.length }}</div>
            <div class="stat-label">Total Issues</div>
          </div>
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-bar">
        <div class="search-wrap">
          <q-icon name="search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, category or building..."
            class="search-input"
          />
        </div>

        <div class="filter-selects">
          <select v-model="filterStatus" class="filter-select">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select v-model="filterPriority" class="filter-select">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button class="refresh-btn" :disabled="loading" @click="loadIssues">
            <q-icon name="refresh" size="16px" :class="{ spinning: loading }" />
            Refresh
          </button>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="state-box">
        <q-spinner size="36px" color="primary" />
        <p>Loading campus issues...</p>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="error" class="state-box error-state">
        <q-icon name="error_outline" size="40px" color="negative" />
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadIssues">Try Again</button>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="filteredIssues.length === 0" class="state-box">
        <q-icon name="inbox" size="48px" color="grey-5" />
        <p v-if="issues.length === 0">No issues have been reported yet.</p>
        <p v-else>No issues match your current filters.</p>
        <button
          v-if="issues.length > 0"
          class="retry-btn"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>

      <!-- ISSUES LIST -->
      <div v-else class="issues-list">
        <div
          v-for="issue in filteredIssues"
          :key="issue._id"
          class="issue-card"
          @click="openDetail(issue)"
        >
          <!-- CARD LEFT -->
          <div class="card-left">
            <div class="card-top-row">
              <div class="issue-ref"
                >#{{ issue._id.slice(-8).toUpperCase() }}</div
              >
              <div class="status-pill" :class="statusClass(issue.status)">
                <span class="status-dot"></span>
                {{ issue.status }}
              </div>
              <div class="priority-pill" :class="priorityClass(issue.priority)">
                {{ issue.priority }}
              </div>
            </div>

            <h3 class="issue-title">{{ issue.title }}</h3>

            <div class="issue-meta">
              <span>
                <q-icon name="category" size="13px" />
                {{ issue.category }}
              </span>
              <span>
                <q-icon name="location_on" size="13px" />
                {{ issue.building }}{{ issue.room ? ' – ' + issue.room : '' }}
              </span>
              <span>
                <q-icon name="schedule" size="13px" />
                {{ formatDate(issue.createdAt) }}
              </span>
              <span v-if="issue.reportedBy?.name">
                <q-icon name="person" size="13px" />
                {{ issue.reportedBy.name }}
              </span>
              <span v-if="issue.assignedTo?.name" class="assigned-badge">
                <q-icon name="engineering" size="13px" />
                Assigned: {{ issue.assignedTo.name }}
              </span>
            </div>

            <p class="issue-desc">{{ truncate(issue.description, 120) }}</p>
          </div>

          <!-- CARD RIGHT -->
          <div class="card-right">
            <button class="view-btn" @click.stop="openDetail(issue)">
              <q-icon name="visibility" size="15px" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DETAIL MODAL ===== -->
    <q-dialog v-model="detailOpen" backdrop-filter="blur(10px)">
      <div v-if="selectedIssue" class="detail-modal">
        <!-- MODAL HEADER -->
        <div class="detail-header">
          <div>
            <div class="detail-ref"
              >#{{ selectedIssue._id.slice(-8).toUpperCase() }}</div
            >
            <h3 class="detail-title">{{ selectedIssue.title }}</h3>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            class="modal-close"
          />
        </div>

        <!-- STATUS + PRIORITY PILLS -->
        <div class="detail-pills">
          <div class="status-pill" :class="statusClass(selectedIssue.status)">
            <span class="status-dot"></span>
            {{ selectedIssue.status }}
          </div>
          <div
            class="priority-pill"
            :class="priorityClass(selectedIssue.priority)"
          >
            {{ selectedIssue.priority }} Priority
          </div>
        </div>

        <!-- ISSUE FIELDS GRID -->
        <div class="detail-grid">
          <div class="detail-field">
            <div class="field-label">Category</div>
            <div class="field-val">{{
              selectedIssue.category || 'Not available'
            }}</div>
          </div>

          <div class="detail-field">
            <div class="field-label">Building</div>
            <div class="field-val">{{
              selectedIssue.building || 'Not available'
            }}</div>
          </div>

          <div class="detail-field">
            <div class="field-label">Room / Floor</div>
            <div class="field-val">{{
              selectedIssue.room || 'Not available'
            }}</div>
          </div>

          <div class="detail-field">
            <div class="field-label">Priority</div>
            <div class="field-val">{{
              selectedIssue.priority || 'Not available'
            }}</div>
          </div>

          <div class="detail-field">
            <div class="field-label">Reported By</div>
            <div class="field-val">
              {{ selectedIssue.reportedBy?.name || 'Not available' }}
            </div>
          </div>

          <div class="detail-field">
            <div class="field-label">Reporter Email</div>
            <div class="field-val">
              {{ selectedIssue.reportedBy?.email || 'Not available' }}
            </div>
          </div>

          <div class="detail-field">
            <div class="field-label">Reported On</div>
            <div class="field-val">{{
              formatDate(selectedIssue.createdAt)
            }}</div>
          </div>

          <div class="detail-field">
            <div class="field-label">Last Updated</div>
            <div class="field-val">{{
              formatDate(selectedIssue.updatedAt)
            }}</div>
          </div>

          <div class="detail-field full-width">
            <div class="field-label">Currently Assigned To</div>
            <div class="field-val">
              <span v-if="selectedIssue.assignedTo?.name" class="assigned-name">
                <q-icon name="engineering" size="15px" color="primary" />
                {{ selectedIssue.assignedTo.name }}
                <span
                  class="assigned-email"
                  v-if="selectedIssue.assignedTo.email"
                >
                  ({{ selectedIssue.assignedTo.email }})
                </span>
              </span>
              <span v-else class="not-assigned">Not assigned</span>
            </div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="detail-desc-block">
          <div class="field-label">Description</div>
          <p class="detail-desc-text">{{
            selectedIssue.description || 'No description provided.'
          }}</p>
        </div>

        <div v-if="issueImageUrl(selectedIssue.image)" class="detail-evidence">
          <div class="field-label">Photo Evidence</div>
          <a
            :href="issueImageUrl(selectedIssue.image)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="issueImageUrl(selectedIssue.image)"
              alt="Student-provided issue photo evidence"
            />
            <span>Open photo in a new tab</span>
          </a>
        </div>

        <!-- ── UPDATE STATUS SECTION ── -->
        <div class="assign-section">
          <div class="assign-section-title">
            <q-icon name="published_with_changes" size="17px" color="primary" />
            Update Issue Status
          </div>

          <div class="assign-controls">
            <select v-model="selectedStatus" class="staff-select">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <!-- Status update result messages -->
            <div v-if="updateStatusSuccess" class="assign-success">
              <q-icon name="check_circle" size="16px" />
              Issue status updated successfully!
            </div>
            <div v-if="updateStatusError" class="assign-error-msg">
              <q-icon name="error_outline" size="16px" />
              {{ updateStatusError }}
            </div>

            <button
              class="assign-btn"
              :disabled="
                updatingStatus || selectedStatus === selectedIssue.status
              "
              @click="doUpdateStatus"
            >
              <q-spinner v-if="updatingStatus" size="16px" />
              <q-icon v-else name="save" size="16px" />
              {{ updatingStatus ? 'Updating...' : 'Update Status' }}
            </button>
          </div>
        </div>

        <!-- ── ASSIGN SECTION ── -->
        <div class="assign-section">
          <div class="assign-section-title">
            <q-icon name="person_add" size="17px" color="primary" />
            Assign Issue to Staff
          </div>

          <!-- Staff list loading -->
          <div v-if="staffLoading" class="assign-loading">
            <q-spinner size="20px" color="primary" />
            <span>Loading staff members...</span>
          </div>

          <!-- Staff list error -->
          <div v-else-if="staffError" class="assign-error">
            <q-icon name="error_outline" size="16px" />
            {{ staffError }}
            <button class="link-btn" @click="loadStaff">Retry</button>
          </div>

          <!-- No staff available -->
          <div v-else-if="staffList.length === 0" class="assign-empty">
            No Staff members found in the system.
          </div>

          <!-- Assignment controls -->
          <div v-else class="assign-controls">
            <select v-model="selectedStaffId" class="staff-select">
              <option value="">— Select a Staff member —</option>
              <option
                v-for="staff in staffList"
                :key="staff._id"
                :value="staff._id"
              >
                {{ staff.name }} ({{ staff.email }})
              </option>
            </select>

            <!-- Assignment result messages -->
            <div v-if="assignSuccess" class="assign-success">
              <q-icon name="check_circle" size="16px" />
              Issue assigned successfully!
            </div>
            <div v-if="assignError" class="assign-error-msg">
              <q-icon name="error_outline" size="16px" />
              {{ assignError }}
            </div>

            <button
              class="assign-btn"
              :disabled="!selectedStaffId || assigning"
              @click="doAssign"
            >
              <q-spinner v-if="assigning" size="16px" />
              <q-icon v-else name="assignment_ind" size="16px" />
              {{ assigning ? 'Assigning...' : 'Assign Issue' }}
            </button>
          </div>
        </div>

        <!-- ── ADD ISSUE UPDATE SECTION ── -->
        <div class="assign-section">
          <div class="assign-section-title">
            <q-icon name="add_comment" size="17px" color="primary" />
            Add Issue Update
          </div>

          <div class="assign-controls">
            <textarea
              v-model="updateMessage"
              rows="3"
              placeholder="Enter an update about this issue..."
              class="update-textarea"
            ></textarea>

            <div v-if="addUpdateSuccess" class="assign-success">
              <q-icon name="check_circle" size="16px" />
              Issue update added successfully!
            </div>
            <div v-if="addUpdateError" class="assign-error-msg">
              <q-icon name="error_outline" size="16px" />
              {{ addUpdateError }}
            </div>

            <button
              class="assign-btn"
              :disabled="addingUpdate || !updateMessage.trim()"
              @click="doAddUpdate"
            >
              <q-spinner v-if="addingUpdate" size="16px" />
              <q-icon v-else name="send" size="16px" />
              {{ addingUpdate ? 'Adding...' : 'Add Update' }}
            </button>
          </div>
        </div>

        <!-- ── UPDATE HISTORY SECTION ── -->
        <div class="assign-section">
          <div class="assign-section-title">
            <q-icon name="history" size="17px" color="primary" />
            Update History
          </div>

          <div v-if="historyLoading" class="assign-loading">
            <q-spinner size="20px" color="primary" />
            <span>Loading update history...</span>
          </div>

          <div v-else-if="historyError" class="assign-error">
            <q-icon name="error_outline" size="16px" />
            {{ historyError }}
            <button class="link-btn" @click="loadHistory">Retry</button>
          </div>

          <div v-else-if="issueUpdates.length === 0" class="assign-empty">
            No updates yet.
          </div>

          <div v-else class="history-list">
            <div v-for="up in issueUpdates" :key="up._id" class="history-item">
              <div class="history-header">
                <div class="status-pill" :class="statusClass(up.status)">
                  <span class="status-dot"></span>
                  {{ up.status }}
                </div>
                <div class="history-time">{{ formatDate(up.createdAt) }}</div>
              </div>
              <div class="history-msg">{{ up.message }}</div>
              <div class="history-author">
                <q-icon name="person" size="13px" />
                Updated by {{ up.updatedBy?.name || 'Staff User' }}
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="detail-actions">
          <q-btn
            flat
            no-caps
            label="Close"
            v-close-popup
            class="modal-dismiss-btn"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAllIssues,
  getIssueImageUrl,
  assignIssue,
  getStaffList,
  updateIssue,
  addIssueUpdate,
  getIssueUpdates
} from '@/services/issueService'

const router = useRouter()

// ─── Auth / Role Guard ────────────────────────────────────────────────────────
const currentUser = ref({ name: '', role: '' })

onMounted(() => {
  const stored = localStorage.getItem('user')
  if (!stored) {
    router.push('/')
    return
  }
  try {
    const user = JSON.parse(stored)
    currentUser.value = user
    if (user.role !== 'Staff' && user.role !== 'Admin') {
      router.push('/')
      return
    }
  } catch {
    router.push('/')
    return
  }
  loadIssues()
  loadStaff()
})

function signOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

function goHome() {
  router.push('/')
}

// ─── Issues Data ──────────────────────────────────────────────────────────────
const issues = ref([])
const loading = ref(false)
const error = ref('')

async function loadIssues() {
  loading.value = true
  error.value = ''
  try {
    const data = await getAllIssues()
    issues.value = Array.isArray(data) ? data : data.issues || []
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to load issues. Please try again.'
  } finally {
    loading.value = false
  }
}

function countByStatus(status) {
  return issues.value.filter(i => i.status === status).length
}

// ─── Filters ──────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')

const filteredIssues = computed(() => {
  return issues.value.filter(issue => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      issue.title?.toLowerCase().includes(q) ||
      issue.category?.toLowerCase().includes(q) ||
      issue.building?.toLowerCase().includes(q)
    const matchesStatus =
      !filterStatus.value || issue.status === filterStatus.value
    const matchesPriority =
      !filterPriority.value || issue.priority === filterPriority.value
    return matchesSearch && matchesStatus && matchesPriority
  })
})

function clearFilters() {
  searchQuery.value = ''
  filterStatus.value = ''
  filterPriority.value = ''
}

// ─── Staff List ───────────────────────────────────────────────────────────────
const staffList = ref([])
const staffLoading = ref(false)
const staffError = ref('')

async function loadStaff() {
  staffLoading.value = true
  staffError.value = ''
  try {
    const data = await getStaffList()
    staffList.value = data.staff || []
  } catch (err) {
    staffError.value =
      err.response?.data?.message || 'Failed to load staff members.'
  } finally {
    staffLoading.value = false
  }
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const detailOpen = ref(false)
const selectedIssue = ref(null)
const issueImageUrl = getIssueImageUrl

// Assignment state
const selectedStaffId = ref('')
const assigning = ref(false)
const assignSuccess = ref(false)
const assignError = ref('')

// Status Update state
const selectedStatus = ref('')
const updatingStatus = ref(false)
const updateStatusSuccess = ref(false)
const updateStatusError = ref('')

// Issue Updates / Comments state
const issueUpdates = ref([])
const historyLoading = ref(false)
const historyError = ref('')

const updateMessage = ref('')
const addingUpdate = ref(false)
const addUpdateSuccess = ref(false)
const addUpdateError = ref('')

function openDetail(issue) {
  selectedIssue.value = issue

  // Reset & sync assignment state
  selectedStaffId.value = issue.assignedTo?._id || ''
  assignSuccess.value = false
  assignError.value = ''

  // Reset & sync status update state
  selectedStatus.value = issue.status || 'Pending'
  updateStatusSuccess.value = false
  updateStatusError.value = ''

  // Reset add update state
  updateMessage.value = ''
  addUpdateSuccess.value = false
  addUpdateError.value = ''

  detailOpen.value = true

  // Load update history
  loadHistory()
}

async function loadHistory() {
  if (!selectedIssue.value?._id) return
  historyLoading.value = true
  historyError.value = ''
  try {
    const data = await getIssueUpdates(selectedIssue.value._id)
    issueUpdates.value = Array.isArray(data) ? data : data.updates || []
  } catch (err) {
    historyError.value =
      err.response?.data?.message || 'Failed to load update history.'
  } finally {
    historyLoading.value = false
  }
}

async function doAddUpdate() {
  if (!updateMessage.value.trim() || !selectedIssue.value) return

  addingUpdate.value = true
  addUpdateSuccess.value = false
  addUpdateError.value = ''

  try {
    const currentStat = selectedIssue.value.status || 'Pending'
    await addIssueUpdate(selectedIssue.value._id, {
      status: currentStat,
      message: updateMessage.value.trim()
    })

    // Clear message textarea
    updateMessage.value = ''

    // Refresh history
    await loadHistory()

    addUpdateSuccess.value = true
  } catch (err) {
    addUpdateError.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to add issue update.'
  } finally {
    addingUpdate.value = false
  }
}

async function doAssign() {
  if (!selectedStaffId.value || !selectedIssue.value) return

  assigning.value = true
  assignSuccess.value = false
  assignError.value = ''

  try {
    const data = await assignIssue(
      selectedIssue.value._id,
      selectedStaffId.value
    )

    const updatedIssue = data.issue || data
    const idx = issues.value.findIndex(i => i._id === selectedIssue.value._id)
    if (idx !== -1) {
      const assignedStaff = staffList.value.find(
        s => s._id === selectedStaffId.value
      )
      issues.value[idx] = {
        ...issues.value[idx],
        assignedTo: updatedIssue.assignedTo ||
          assignedStaff || { _id: selectedStaffId.value }
      }
      selectedIssue.value = { ...issues.value[idx] }
    }

    assignSuccess.value = true
  } catch (err) {
    assignError.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Assignment failed. Please try again.'
  } finally {
    assigning.value = false
  }
}

async function doUpdateStatus() {
  if (!selectedStatus.value || !selectedIssue.value) return

  updatingStatus.value = true
  updateStatusSuccess.value = false
  updateStatusError.value = ''

  try {
    const data = await updateIssue(selectedIssue.value._id, {
      status: selectedStatus.value
    })
    const updated = data.issue || data

    const newStatus = updated.status || selectedStatus.value

    const idx = issues.value.findIndex(i => i._id === selectedIssue.value._id)
    if (idx !== -1) {
      issues.value[idx] = {
        ...issues.value[idx],
        status: newStatus,
        updatedAt: updated.updatedAt || new Date().toISOString()
      }
      selectedIssue.value = { ...issues.value[idx] }
    }

    updateStatusSuccess.value = true
  } catch (err) {
    updateStatusError.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to update status. Please try again.'
  } finally {
    updatingStatus.value = false
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

function statusClass(status) {
  const map = {
    Pending: 'status-pending',
    'In Progress': 'status-inprogress',
    Resolved: 'status-resolved',
    Rejected: 'status-rejected'
  }
  return map[status] || 'status-pending'
}

function priorityClass(priority) {
  const map = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high'
  }
  return map[priority] || 'priority-medium'
}
</script>

<style scoped>
/* ─── BASE ─────────────────────────────────────────────────────────────── */
.staff-dashboard-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: #f1f5f9;
}

/* ─── BACKGROUND ORBS ─────────────────────────────────────────────────── */
.dash-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.07;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: #3b82f6;
  top: -200px;
  right: -150px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #6366f1;
  bottom: -100px;
  left: -100px;
}

/* ─── WRAPPER ─────────────────────────────────────────────────────────── */
.dash-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

/* ─── HEADER ──────────────────────────────────────────────────────────── */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 32px;
}

.dash-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.brand-name {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #1e293b;
}

.brand-sub {
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.dash-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.role-badge {
  background: #eff6ff;
  color: #2563eb;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}

.signout-btn {
  color: #64748b !important;
  font-size: 13px !important;
}

/* ─── PAGE TITLE ──────────────────────────────────────────────────────── */
.dash-title-block {
  margin-bottom: 28px;
}

.title-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.dash-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  line-height: 1.2;
}

.dash-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* ─── STATS ROW ───────────────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pending-icon {
  background: #fef3c7;
  color: #d97706;
}
.inprogress-icon {
  background: #dbeafe;
  color: #2563eb;
}
.resolved-icon {
  background: #dcfce7;
  color: #16a34a;
}
.total-icon {
  background: #ede9fe;
  color: #7c3aed;
}

.stat-num {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
}

/* ─── FILTER BAR ──────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-wrap {
  flex: 1;
  min-width: 220px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 18px;
}

.search-input {
  width: 100%;
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px 0 40px;
  font-size: 13px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
}

.filter-selects {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.refresh-btn {
  height: 42px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: background 0.15s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f8fafc;
}
.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── STATE BOX ───────────────────────────────────────────────────────── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  color: #94a3b8;
  gap: 12px;
}

.state-box p {
  margin: 0;
  font-size: 14px;
}
.error-state {
  color: #ef4444;
}

.retry-btn {
  margin-top: 8px;
  padding: 8px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
}

.retry-btn:hover {
  background: #f8fafc;
}

/* ─── ISSUES LIST ─────────────────────────────────────────────────────── */
.issues-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.issue-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    border-color 0.2s,
    transform 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.issue-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  transform: translateY(-1px);
}

.card-left {
  flex: 1;
  min-width: 0;
}

.card-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.issue-ref {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  font-family: monospace;
  letter-spacing: 0.5px;
}

.issue-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
  line-height: 1.4;
}

.issue-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.issue-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.assigned-badge {
  background: #eff6ff !important;
  color: #2563eb !important;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 2px 8px;
  font-weight: 600 !important;
}

.issue-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.card-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.view-btn:hover {
  background: #dbeafe;
}

/* ─── STATUS PILLS ────────────────────────────────────────────────────── */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}
.status-inprogress {
  background: #dbeafe;
  color: #2563eb;
}
.status-resolved {
  background: #dcfce7;
  color: #16a34a;
}
.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

/* ─── PRIORITY PILLS ──────────────────────────────────────────────────── */
.priority-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.priority-low {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.priority-medium {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}
.priority-high {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
}

/* ─── DETAIL MODAL ────────────────────────────────────────────────────── */
.detail-modal {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  width: 580px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.detail-ref {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  font-family: monospace;
  margin-bottom: 4px;
}

.detail-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  padding-right: 12px;
}

.modal-close {
  color: #94a3b8 !important;
}

.detail-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.full-width {
  grid-column: 1 / -1;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-val {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.assigned-name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #2563eb;
  font-weight: 600;
}

.assigned-email {
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
}

.not-assigned {
  color: #94a3b8;
  font-style: italic;
}

.detail-desc-block {
  margin-bottom: 20px;
}

.detail-desc-text {
  margin: 8px 0 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.detail-evidence {
  margin-bottom: 20px;
}

.detail-evidence a {
  margin-top: 8px;
  color: #2563eb;
}

.detail-evidence img {
  display: block;
  width: min(100%, 420px);
  max-height: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  object-fit: cover;
}

/* ─── ASSIGN SECTION & UPDATE SECTIONS ───────────────────────────────── */
.assign-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
  background: #f8fafc;
}

.assign-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
}

.assign-loading,
.assign-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.assign-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #dc2626;
}

.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  padding: 0;
}

.assign-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.staff-select {
  width: 100%;
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.staff-select:focus {
  border-color: #3b82f6;
}

.update-textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #1e293b;
  background: #fff;
  outline: none;
  font-family: inherit;
  resize: vertical;
}

.update-textarea:focus {
  border-color: #3b82f6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.history-time {
  font-size: 11px;
  color: #94a3b8;
}

.history-msg {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  margin-bottom: 6px;
}

.history-author {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.assign-success {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #16a34a;
  font-weight: 600;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.assign-error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #dc2626;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.assign-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s;
  width: 100%;
}

.assign-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.assign-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ─── MODAL FOOTER ────────────────────────────────────────────────────── */
.detail-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.modal-dismiss-btn {
  color: #64748b !important;
}

/* ─── RESPONSIVE ──────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .issue-card {
    flex-direction: column;
  }
  .card-right {
    width: 100%;
  }
  .view-btn {
    width: 100%;
    justify-content: center;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-selects {
    flex-direction: column;
  }

  .filter-select,
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
