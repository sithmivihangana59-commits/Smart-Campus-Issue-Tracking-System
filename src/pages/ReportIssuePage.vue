<template>
  <q-page class="report-page">

    <!-- BACKGROUND -->
    <div class="report-bg">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
    </div>


    <!-- CONTENT -->
    <div class="report-wrapper">

      <!-- BACK BUTTON -->
      <button class="back-btn" @click="goHome">
        <q-icon name="arrow_back" size="18px" />
        Back to Home
      </button>


      <!-- HEADER -->
      <div class="page-header">

        <div class="header-badge">
          <q-icon name="report_problem" size="16px" />
          Report a Campus Issue
        </div>

        <h1 class="page-title">
          Tell us what's
          <span>wrong.</span>
        </h1>

        <p class="page-subtitle">
          Fill in the details below and our team will
          review and resolve the issue as soon as possible.
        </p>

      </div>


      <!-- FORM CARD -->
      <form class="report-form" @submit.prevent="submitReport">

        <!-- STEP 1: CATEGORY -->
        <div class="form-section">

          <div class="section-label">
            <div class="label-number">01</div>
            <div>
              <div class="label-title">Issue Category</div>
              <div class="label-sub">Select the type of problem</div>
            </div>
          </div>

          <div class="category-grid">

            <div
              v-for="cat in categories"
              :key="cat.value"
              class="category-card"
              :class="{ selected: form.category === cat.value }"
              @click="form.category = cat.value"
            >
              <div class="cat-icon" :style="{ background: cat.bg, color: cat.color }">
                <q-icon :name="cat.icon" size="22px" />
              </div>
              <span>{{ cat.label }}</span>
            </div>

          </div>

          <div v-if="errors.category" class="field-error">
            <q-icon name="error_outline" size="14px" /> Please select a category
          </div>

        </div>


        <!-- STEP 2: LOCATION -->
        <div class="form-section">

          <div class="section-label">
            <div class="label-number">02</div>
            <div>
              <div class="label-title">Location</div>
              <div class="label-sub">Where is the issue located?</div>
            </div>
          </div>

          <div class="fields-row">

            <div class="form-field">
              <label>Building / Area</label>
              <div class="input-wrap">
                <q-icon name="location_on" class="field-icon" />
                <select v-model="form.building">
                  <option value="" disabled>Select building</option>
                  <option v-for="b in buildings" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
              <div v-if="errors.building" class="field-error">
                <q-icon name="error_outline" size="14px" /> Required
              </div>
            </div>

            <div class="form-field">
              <label>Room / Floor (Optional)</label>
              <div class="input-wrap">
                <q-icon name="meeting_room" class="field-icon" />
                <input
                  v-model="form.room"
                  type="text"
                  placeholder="e.g. Room 204, 2nd Floor"
                />
              </div>
            </div>

          </div>

        </div>


        <!-- STEP 3: ISSUE DETAILS -->
        <div class="form-section">

          <div class="section-label">
            <div class="label-number">03</div>
            <div>
              <div class="label-title">Issue Details</div>
              <div class="label-sub">Describe the problem clearly</div>
            </div>
          </div>

          <div class="form-field">
            <label>Issue Title <span class="required">*</span></label>
            <div class="input-wrap">
              <q-icon name="title" class="field-icon" />
              <input
                v-model="form.title"
                type="text"
                placeholder="Short summary of the issue"
                maxlength="80"
              />
            </div>
            <div class="char-count">{{ form.title.length }}/80</div>
            <div v-if="errors.title" class="field-error">
              <q-icon name="error_outline" size="14px" /> Please enter a title
            </div>
          </div>

          <div class="form-field">
            <label>Description <span class="required">*</span></label>
            <div class="textarea-wrap">
              <textarea
                v-model="form.description"
                placeholder="Describe the issue in detail — what you saw, when it started, how it's affecting you..."
                rows="5"
                maxlength="500"
              ></textarea>
            </div>
            <div class="char-count">{{ form.description.length }}/500</div>
            <div v-if="errors.description" class="field-error">
              <q-icon name="error_outline" size="14px" /> Please describe the issue
            </div>
          </div>

        </div>


        <!-- STEP 4: PRIORITY -->
        <div class="form-section">

          <div class="section-label">
            <div class="label-number">04</div>
            <div>
              <div class="label-title">Priority Level</div>
              <div class="label-sub">How urgent is this issue?</div>
            </div>
          </div>

          <div class="priority-row">

            <div
              v-for="p in priorities"
              :key="p.value"
              class="priority-btn"
              :class="[p.value.toLowerCase(), { selected: form.priority === p.value }]"
              @click="form.priority = p.value"
            >
              <q-icon :name="p.icon" size="16px" />
              {{ p.label }}
            </div>

          </div>

        </div>


        <!-- STEP 5: PHOTO -->
        <div class="form-section">

          <div class="section-label">
            <div class="label-number">05</div>
            <div>
              <div class="label-title">Photo Evidence</div>
              <div class="label-sub">Optional but helps us resolve faster</div>
            </div>
          </div>

          <div
            class="upload-area"
            :class="{ 'has-file': previewUrl }"
            @click="triggerUpload"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >

            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style="display: none"
              @change="handleFile"
            />

            <div v-if="!previewUrl" class="upload-placeholder">
              <div class="upload-icon">
                <q-icon name="cloud_upload" size="32px" />
              </div>
              <div class="upload-text">
                <strong>Click to upload</strong> or drag & drop
              </div>
              <div class="upload-hint">PNG, JPG, WEBP up to 10MB</div>
            </div>

            <div v-else class="upload-preview">
              <img :src="previewUrl" alt="Preview" />
              <button
                class="remove-photo"
                type="button"
                @click.stop="removePhoto"
              >
                <q-icon name="close" size="16px" />
              </button>
            </div>

          </div>

        </div>


        <!-- ERROR BANNER -->
        <div
          v-if="errorMsg"
          style="
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #dc2626;
            font-size: 13px;
          "
        >
          <q-icon name="error" size="20px" color="negative" />
          {{ errorMsg }}
        </div>


        <!-- SUBMIT -->
        <div class="form-footer">

          <div class="footer-note">
            <q-icon name="info_outline" size="15px" />
            Your report will be reviewed within 24 hours
          </div>

          <button
            class="submit-btn"
            type="submit"
            :disabled="submitting"
          >
            <span v-if="!submitting">
              <q-icon name="send" size="18px" />
              Submit Report
            </span>
            <span v-else class="submitting-state">
              <q-icon name="hourglass_top" size="18px" class="spin" />
              Submitting...
            </span>
          </button>

        </div>

      </form>


      <!-- SUCCESS MESSAGE -->
      <transition name="fade">
        <div v-if="submitted" ref="successSection" class="success-card">

          <div class="success-icon">
            <q-icon name="check_circle" size="48px" />
          </div>

          <h2>Report Submitted!</h2>

          <p>
            Your issue has been logged successfully.
            Our team will review it and get back to you soon.
          </p>

          <div class="success-ref">
            Reference: <strong>#{{ refNumber }}</strong>
          </div>

          <div class="success-actions">

            <button class="success-btn primary" @click="submitAnother">
              Report Another Issue
            </button>

            <button class="success-btn secondary" @click="goHome">
              Back to Home
            </button>

          </div>

        </div>
      </transition>

    </div>

  </q-page>
</template>


<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { createIssue } from '@/services/issueService'

const router = useRouter()

// ---- DATA ----

const categories = [
  { value: 'maintenance', label: 'Maintenance', icon: 'build', bg: '#dbeafe', color: '#1e40af' },
  { value: 'it', label: 'IT / Tech', icon: 'computer', bg: '#e0e7ff', color: '#4338ca' },
  { value: 'facility', label: 'Facility', icon: 'apartment', bg: '#dbeafe', color: '#1d4ed8' },
  { value: 'safety', label: 'Safety', icon: 'health_and_safety', bg: '#fee2e2', color: '#dc2626' },
  { value: 'cleaning', label: 'Cleaning', icon: 'cleaning_services', bg: '#dcfce7', color: '#15803d' },
  { value: 'other', label: 'Other', icon: 'more_horiz', bg: '#f1f5f9', color: '#64748b' },
]

const buildings = [
  'Main Building (Block A)',
  'Science Faculty (Block B)',
  'Engineering Faculty (Block C)',
  'Library',
  'Canteen / Cafeteria',
  'Auditorium',
  'Sports Complex',
  'Student Centre',
  'Hostel Block',
  'Parking Area',
  'Other / Outdoor Area',
]

const priorities = [
  { value: 'Low', label: 'Low', icon: 'arrow_downward' },
  { value: 'Medium', label: 'Medium', icon: 'remove' },
  { value: 'High', label: 'High', icon: 'arrow_upward' },
]

// ---- FORM STATE ----

const form = reactive({
  category: '',
  building: '',
  room: '',
  title: '',
  description: '',
  priority: 'Medium',
  photo: null,
})

const errors = reactive({
  category: false,
  building: false,
  title: false,
  description: false,
})

const fileInput = ref(null)
const previewUrl = ref(null)
const successSection = ref(null)
const submitting = ref(false)
const submitted = ref(false)
const refNumber = ref('')
const errorMsg = ref('')

// ---- METHODS ----

function goHome () {
  router.push('/')
}

function triggerUpload () {
  fileInput.value?.click()
}

function handleFile (e) {
  const file = e.target.files[0]
  if (file) applyFile(file)
}

function handleDrop (e) {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) applyFile(file)
}

function applyFile (file) {
  form.photo = file
  previewUrl.value = URL.createObjectURL(file)
}

function removePhoto () {
  form.photo = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function validate () {
  errors.category = !form.category
  errors.building = !form.building
  errors.title = !form.title.trim()
  errors.description = !form.description.trim()

  const isValid = !errors.category && !errors.building && !errors.title && !errors.description

  if (!isValid) {
    nextTick(() => {
      const firstError = document.querySelector('.field-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  return isValid
}

function generateRef () {
  return 'CC' + Date.now().toString().slice(-6)
}

function submitAnother () {
  submitted.value = false
  Object.assign(form, {
    category: '',
    building: '',
    room: '',
    title: '',
    description: '',
    priority: 'Medium',
    photo: null,
  })
  previewUrl.value = null
}

async function submitReport () {
  console.log("SUBMIT REPORT CLICKED")
  if (!validate()) {
    console.log("VALIDATION STATE", {
      category: form.category,
      building: form.building,
      title: form.title,
      description: form.description,
      errors: {
        category: errors.category,
        building: errors.building,
        title: errors.title,
        description: errors.description
      }
    });
    return
  }

  errorMsg.value = ''
  submitting.value = true

  try {
    const issueData = new FormData()
    issueData.append('category', form.category)
    issueData.append('building', form.building)
    issueData.append('room', form.room)
    issueData.append('title', form.title)
    issueData.append('description', form.description)
    issueData.append('priority', form.priority)
    if (form.photo) issueData.append('image', form.photo)
    console.log("SENDING ISSUE", issueData)
    const data = await createIssue(issueData)
    console.log("ISSUE CREATED", data)

    // Use backend issue ID as reference, fallback to generated ref
    refNumber.value = data.issue?._id?.slice(-8)?.toUpperCase()
      || data._id?.slice(-8)?.toUpperCase()
      || generateRef()
    submitting.value = false
    submitted.value = true
    await nextTick()
    successSection.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  } catch (err) {
    console.error("CREATE ISSUE ERROR", err)
    submitting.value = false
    errorMsg.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to submit report. Please try again.'
  }
}
</script>


<style scoped>

/* =====================================================
   BASE
===================================================== */

.report-page {
  width: 100%;
  min-height: 100vh;

  position: relative;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  background: #eef2ff;

  overflow-x: hidden;
}


/* BACKGROUND ORBS */

.report-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.orb-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -100px;
  background: rgba(30, 64, 175, 0.10);
}

.orb-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  background: rgba(99, 102, 241, 0.08);
}


/* =====================================================
   WRAPPER
===================================================== */

.report-wrapper {
  position: relative;
  z-index: 1;

  max-width: 800px;

  margin: 0 auto;

  padding: 40px 24px 80px;

  box-sizing: border-box;
}


/* BACK BUTTON */

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 8px 16px;

  border: 1.5px solid #c7d2fe;

  border-radius: 10px;

  background: white;

  color: #1e40af;

  font-size: 13px;

  font-weight: 600;

  font-family: inherit;

  cursor: pointer;

  transition: 0.2s;

  margin-bottom: 36px;
}

.back-btn:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
}


/* =====================================================
   HEADER
===================================================== */

.page-header {
  margin-bottom: 40px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 7px 14px;

  border-radius: 20px;

  background: #dbeafe;

  color: #1e40af;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.3px;

  margin-bottom: 18px;
}

.page-title {
  margin: 0;

  font-size: clamp(36px, 5vw, 54px);

  font-weight: 850;

  letter-spacing: -2.5px;

  line-height: 1;

  color: #0f172a;
}

.page-title span {
  background: linear-gradient(135deg, #1e40af 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  margin: 16px 0 0;

  color: #475569;

  font-size: 15px;

  line-height: 1.7;
}


/* =====================================================
   FORM
===================================================== */

.report-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-section {
  background: white;

  border: 1.5px solid #e0e7ff;

  border-radius: 20px;

  padding: 32px;

  margin-bottom: 16px;
}


/* SECTION LABEL */

.section-label {
  display: flex;
  align-items: flex-start;
  gap: 14px;

  margin-bottom: 24px;
}

.label-number {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 10px;

  background: linear-gradient(135deg, #1e40af, #6366f1);

  color: white;

  font-size: 13px;

  font-weight: 800;

  display: flex;
  align-items: center;
  justify-content: center;
}

.label-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.label-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}


/* CATEGORY GRID */

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 13px 15px;

  border: 1.5px solid #e0e7ff;

  border-radius: 12px;

  cursor: pointer;

  transition: 0.2s;

  font-size: 13px;

  font-weight: 600;

  color: #334155;
}

.category-card:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
}

.category-card.selected {
  border-color: #1e40af;
  background: #eff6ff;
  color: #1e40af;
}

.cat-icon {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 9px;

  display: flex;
  align-items: center;
  justify-content: center;
}


/* FIELDS */

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.required {
  color: #dc2626;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 13px;
  color: #94a3b8;
  font-size: 18px;
  pointer-events: none;
}

.input-wrap input,
.input-wrap select {
  width: 100%;

  height: 46px;

  padding: 0 14px 0 42px;

  box-sizing: border-box;

  border: 1.5px solid #e0e7ff;

  border-radius: 11px;

  background: #f8faff;

  color: #0f172a;

  font-size: 13.5px;

  font-family: inherit;

  outline: none;

  transition: 0.2s;

  appearance: none;
}

.input-wrap input::placeholder {
  color: #94a3b8;
}

.input-wrap input:focus,
.input-wrap select:focus {
  border-color: #1e40af;
  background: white;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.10);
}

.textarea-wrap textarea {
  width: 100%;

  padding: 14px;

  box-sizing: border-box;

  border: 1.5px solid #e0e7ff;

  border-radius: 11px;

  background: #f8faff;

  color: #0f172a;

  font-size: 13.5px;

  font-family: inherit;

  outline: none;

  resize: vertical;

  transition: 0.2s;

  line-height: 1.6;
}

.textarea-wrap textarea::placeholder {
  color: #94a3b8;
}

.textarea-wrap textarea:focus {
  border-color: #1e40af;
  background: white;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.10);
}

.char-count {
  font-size: 10px;
  color: #94a3b8;
  text-align: right;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 11px;

  color: #dc2626;

  font-weight: 600;
}


/* PRIORITY */

.priority-row {
  display: flex;
  gap: 10px;
}

.priority-btn {
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 12px 10px;

  border-radius: 11px;

  border: 1.5px solid #e0e7ff;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;

  color: #64748b;

  background: white;
}

.priority-btn:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
}

.priority-btn.selected,
.priority-btn.selected:hover {
  background: #dbeafe;
  border-color: #2563eb;
  color: #1d4ed8;
}


/* UPLOAD */

.upload-area {
  border: 2px dashed #c7d2fe;

  border-radius: 14px;

  background: #f8faff;

  cursor: pointer;

  transition: 0.2s;

  overflow: hidden;
}

.upload-area:hover {
  border-color: #1e40af;
  background: #eff6ff;
}

.upload-placeholder {
  padding: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  text-align: center;
}

.upload-icon {
  width: 60px;
  height: 60px;

  border-radius: 14px;

  background: #dbeafe;

  color: #1e40af;

  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-text {
  font-size: 14px;
  color: #475569;
}

.upload-hint {
  font-size: 11px;
  color: #94a3b8;
}

.upload-preview {
  position: relative;
  height: 200px;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.55);

  color: white;

  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;
}

.remove-photo:hover {
  background: rgba(220, 38, 38, 0.85);
}


/* =====================================================
   FORM FOOTER
===================================================== */

.form-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 24px 0 0;
}

.footer-note {
  display: flex;
  align-items: center;
  gap: 6px;

  color: #64748b;

  font-size: 12px;
}

.submit-btn {
  min-height: 52px;

  padding: 0 32px;

  border-radius: 13px;

  border: none;

  background: linear-gradient(135deg, #1e40af 0%, #4f46e5 100%);

  color: white;

  font-size: 15px;

  font-weight: 700;

  font-family: inherit;

  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 9px;

  transition: 0.2s;

  box-shadow: 0 10px 28px rgba(30, 64, 175, 0.28);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(30, 64, 175, 0.35);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submitting-state {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


/* =====================================================
   SUCCESS CARD
===================================================== */

.success-card {
  background: white;

  border: 1.5px solid #e0e7ff;

  border-radius: 22px;

  padding: 50px 40px;

  text-align: center;

  margin-top: 16px;
}

.success-icon {
  width: 80px;
  height: 80px;

  border-radius: 50%;

  background: linear-gradient(135deg, #dbeafe, #e0e7ff);

  color: #1e40af;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 24px;
}

.success-card h2 {
  margin: 0 0 12px;

  font-size: 28px;

  font-weight: 800;

  color: #0f172a;

  letter-spacing: -1px;
}

.success-card p {
  color: #475569;

  font-size: 14px;

  line-height: 1.7;

  max-width: 400px;

  margin: 0 auto 20px;
}

.success-ref {
  display: inline-block;

  padding: 8px 18px;

  border-radius: 20px;

  background: #eef2ff;

  color: #1e40af;

  font-size: 13px;

  margin-bottom: 28px;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.success-btn {
  padding: 12px 24px;

  border-radius: 11px;

  font-size: 14px;

  font-weight: 700;

  font-family: inherit;

  cursor: pointer;

  transition: 0.2s;
}

.success-btn.primary {
  background: linear-gradient(135deg, #1e40af, #4f46e5);
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.25);
}

.success-btn.secondary {
  background: white;
  color: #1e40af;
  border: 1.5px solid #c7d2fe;
}

.success-btn:hover {
  transform: translateY(-2px);
}


/* FADE TRANSITION */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 650px) {

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .fields-row {
    grid-template-columns: 1fr;
  }

  .priority-row {
    flex-wrap: wrap;
  }

  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }

}

</style>
