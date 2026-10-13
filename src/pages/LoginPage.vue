<template>
  <q-page class="login-page">

    <!-- AMBIENT BACKGROUND GLOWS & PATTERN -->
    <div class="login-bg">
      <div class="bg-grid-pattern"></div>
      <div class="bg-orb orb-primary"></div>
      <div class="bg-orb orb-indigo"></div>
      <div class="bg-orb orb-cyan"></div>
    </div>

    <div class="login-shell">

      <!-- ═══════════════════════════════════════════════════
           LEFT PANEL — CAMPUSCARE BRANDING & VISUAL AREA
      ═══════════════════════════════════════════════════ -->
      <section class="brand-panel">

        <div class="brand-panel-inner">

          <!-- BRAND HEADER -->
          <div class="brand-header">
            <div class="brand-logo-badge">
              <q-icon name="school" size="26px" />
            </div>
            <div class="brand-meta">
              <span class="brand-name">CAMPUSCARE</span>
              <span class="brand-tag">SMART CAMPUS PLATFORM</span>
            </div>
          </div>

          <!-- EYEBROW BADGE -->
          <div class="eyebrow-pill">
            <span class="pill-dot"></span>
            <span class="pill-text">UNIVERSITY ISSUE MANAGEMENT SYSTEM</span>
          </div>

          <!-- HERO HEADLINE -->
          <h1 class="hero-heading">
            <span class="heading-welcome">Welcome to</span>
            <span class="heading-brand">CampusCare</span>
          </h1>

          <!-- SYSTEM SUMMARY -->
          <p class="hero-description">
            Report campus issues, track progress, and stay connected with the people working to make your university a better place.
          </p>

          <!-- FEATURE HIGHLIGHTS -->
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon-box box-blue">
                <q-icon name="track_changes" size="18px" />
              </div>
              <div class="feature-text">
                <span class="feature-title">Report &amp; track campus issues</span>
                <span class="feature-sub">Log incidents in seconds with precise campus locations</span>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon-box box-indigo">
                <q-icon name="bolt" size="18px" />
              </div>
              <div class="feature-text">
                <span class="feature-title">Real-time status updates</span>
                <span class="feature-sub">Follow maintenance progress from review to completion</span>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon-box box-emerald">
                <q-icon name="verified" size="18px" />
              </div>
              <div class="feature-text">
                <span class="feature-title">A cleaner, safer, smarter campus</span>
                <span class="feature-sub">Collaborative facilities management for students and staff</span>
              </div>
            </div>
          </div>

          <!-- CAMPUS TECH VISUAL SHOWCASE -->
          <div class="campus-tech-showcase">

            <!-- MAIN PREVIEW CARD (MINI DASHBOARD TICKET) -->
            <div class="showcase-card showcase-preview">
              <div class="preview-header">
                <div class="preview-tag">
                  <span class="status-live-indicator"></span>
                  <span>LIVE CAMPUS MONITOR</span>
                </div>
                <span class="preview-id">#TKT-2409</span>
              </div>

              <div class="preview-body">
                <div class="preview-title-row">
                  <span class="preview-issue-title">Science Block • HVAC &amp; Lighting System</span>
                  <span class="preview-status-badge">In Progress</span>
                </div>
                <div class="preview-progress-track">
                  <div class="preview-progress-bar" style="width: 78%"></div>
                </div>
                <div class="preview-footer">
                  <div class="preview-assigned">
                    <q-icon name="engineering" size="14px" />
                    <span>Assigned to Facilities Maintenance</span>
                  </div>
                  <span class="preview-time">Updated 12m ago</span>
                </div>
              </div>
            </div>

            <!-- FLOATING STATISTIC CARDS -->
            <div class="floating-stat-card stat-resolved">
              <div class="stat-icon-wrap icon-blue">
                <q-icon name="check_circle" size="20px" />
              </div>
              <div class="stat-content">
                <span class="stat-number">94%</span>
                <span class="stat-label">Issues Resolved</span>
              </div>
            </div>

            <div class="floating-stat-card stat-users">
              <div class="stat-icon-wrap icon-indigo">
                <q-icon name="groups" size="20px" />
              </div>
              <div class="stat-content">
                <span class="stat-number">2,400+</span>
                <span class="stat-label">Campus Members</span>
              </div>
            </div>

            <div class="floating-stat-card stat-time">
              <div class="stat-icon-wrap icon-amber">
                <q-icon name="schedule" size="20px" />
              </div>
              <div class="stat-content">
                <span class="stat-number">&lt; 24h</span>
                <span class="stat-label">Avg. Response</span>
              </div>
            </div>

          </div>

        </div>

      </section>


      <!-- ═══════════════════════════════════════════════════
           RIGHT PANEL — PREMIUM SIGN IN CARD
      ═══════════════════════════════════════════════════ -->
      <section class="auth-panel">

        <div class="auth-card">

          <!-- MOBILE-ONLY BRAND HEADER -->
          <div class="mobile-brand-header">
            <div class="mobile-logo-wrap">
              <q-icon name="school" size="22px" />
            </div>
            <div>
              <span class="mobile-brand-name">CAMPUSCARE</span>
              <span class="mobile-brand-sub">Smart Campus Platform</span>
            </div>
          </div>

          <!-- CARD HEADER -->
          <div class="card-header">
            <h2 class="card-title">Sign In</h2>
            <p class="card-subtitle">Enter your credentials to access your account</p>
          </div>

          <!-- ERROR BANNER -->
          <transition name="fade">
            <div v-if="errorMsg" class="error-banner" role="alert">
              <q-icon name="error_outline" size="20px" class="error-banner-icon" />
              <div class="error-banner-text">{{ errorMsg }}</div>
            </div>
          </transition>

          <!-- SIGN IN FORM -->
          <form class="login-form" @submit.prevent="onSubmit">

            <!-- EMAIL FIELD -->
            <div class="form-field-group">
              <label for="email" class="field-label">Email Address</label>
              <div class="field-input-box">
                <q-icon name="mail" class="field-prefix-icon" />
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <!-- PASSWORD FIELD -->
            <div class="form-field-group">
              <div class="field-label-row">
                <label for="password" class="field-label">Password</label>
                <button
                  type="button"
                  class="forgot-password-link"
                  @click="forgotPassword"
                >
                  Forgot password?
                </button>
              </div>
              <div class="field-input-box">
                <q-icon name="lock" class="field-prefix-icon" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  class="toggle-visibility-btn"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" size="18px" />
                </button>
              </div>
            </div>

            <!-- REMEMBER ME -->
            <div class="remember-me-row">
              <label class="remember-checkbox-label">
                <input v-model="rememberMe" type="checkbox" />
                <span class="custom-checkbox">
                  <q-icon name="check" size="13px" class="check-icon" />
                </span>
                <span class="remember-text">Remember me</span>
              </label>
            </div>

            <!-- SUBMIT BUTTON -->
            <q-btn
              unelevated
              no-caps
              type="submit"
              label="Sign In"
              icon-right="arrow_forward"
              class="primary-sign-in-btn"
              :loading="loading"
            >
              <template #loading>
                <q-spinner-dots size="22px" />
              </template>
            </q-btn>

          </form>

          <!-- SECURITY BADGE FOOTER -->
          <div class="auth-card-footer">
            <q-icon name="shield" size="15px" class="security-icon" />
            <div class="security-copy">
              <span>Protected by CampusCare Unified Authentication</span>
              <span>Your data is secure and encrypted</span>
            </div>
          </div>

        </div>

      </section>

    </div>

    <!-- ═══════════════════════════════════════════════════
         FORGOT PASSWORD DIALOG
    ═══════════════════════════════════════════════════ -->
    <q-dialog v-model="forgotDialogOpen" backdrop-filter="blur(8px)">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-icon-badge">
              <q-icon name="lock_reset" size="20px" />
            </div>
            <h3 class="modal-title">Reset Password</h3>
          </div>
          <q-btn flat round dense icon="close" v-close-popup class="modal-close-btn" />
        </div>

        <div v-if="!resetSent" class="modal-body">
          <p class="modal-description">
            Enter your university email address and we'll send you instructions to reset your account password.
          </p>
          <div class="modal-input-box">
            <q-icon name="mail" class="field-prefix-icon" />
            <input
              v-model="resetEmail"
              type="email"
              placeholder="name@university.edu"
              @keyup.enter="sendResetLink"
            />
          </div>
          <div class="modal-actions">
            <q-btn flat no-caps label="Cancel" v-close-popup class="modal-btn-cancel" />
            <q-btn
              unelevated
              no-caps
              label="Send Reset Link"
              class="modal-btn-confirm"
              :loading="resetLoading"
              @click="sendResetLink"
            />
          </div>
        </div>

        <div v-else class="modal-success-body">
          <div class="modal-success-icon-wrap">
            <q-icon name="check_circle" size="46px" color="positive" />
          </div>
          <h4 class="modal-success-title">Reset Link Sent</h4>
          <p class="modal-success-desc">
            We have sent password reset instructions to <strong>{{ resetEmail }}</strong>. Please check your inbox.
          </p>
          <q-btn unelevated no-caps label="Return to Sign In" class="modal-btn-confirm full-width" v-close-popup />
        </div>
      </div>
    </q-dialog>

    <!-- ═══════════════════════════════════════════════════
         SUCCESS TOAST DIALOG
    ═══════════════════════════════════════════════════ -->
    <q-dialog v-model="loginSuccess" position="top">
      <div class="login-toast">
        <div class="toast-icon-wrap">
          <q-icon name="check_circle" size="22px" />
        </div>
        <div class="toast-text">
          <span class="toast-title">Authentication Successful</span>
          <span class="toast-subtitle">Welcome to CampusCare. Redirecting to your dashboard...</span>
        </div>
      </div>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const loginSuccess = ref(false)
const errorMsg = ref('')

const forgotDialogOpen = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetSent = ref(false)

async function onSubmit () {
  errorMsg.value = ''
  loading.value = true

  try {
    const data = await login(email.value, password.value)

    // Save token and user to localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Show success toast and redirect based on role
    loginSuccess.value = true
    setTimeout(() => {
      loginSuccess.value = false
      const role = data.user?.role
      if (role === 'Admin') {
        router.push('/admin-dashboard')
      } else if (role === 'Staff') {
        router.push('/staff-dashboard')
      } else {
        router.push('/student-dashboard')
      }
    }, 900)
  } catch (err) {
    // Show backend error message if available, otherwise generic message
    errorMsg.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Invalid email or password. Please verify your credentials and try again.'
  } finally {
    loading.value = false
  }
}

function forgotPassword () {
  resetEmail.value = email.value || ''
  resetSent.value = false
  forgotDialogOpen.value = true
}

function sendResetLink () {
  if (!resetEmail.value) return
  resetLoading.value = true
  setTimeout(() => {
    resetLoading.value = false
    resetSent.value = true
  }, 900)
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   PAGE ROOT & GLOBAL POPPINS TYPOGRAPHY
═══════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');

.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #0f172a;
  background-color: #f8fafc;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══════════════════════════════════════════════════════
   BACKGROUND ATMOSPHERE & MODERN MESH GRADIENTS
═══════════════════════════════════════════════════════ */
.login-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bg-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(37, 99, 235, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(37, 99, 235, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8), transparent 85%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8), transparent 85%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.65;
}

.orb-primary {
  width: 650px;
  height: 650px;
  top: -200px;
  left: -150px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(29, 78, 216, 0.05) 60%, transparent 80%);
}

.orb-indigo {
  width: 550px;
  height: 550px;
  bottom: -150px;
  right: -100px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.14) 0%, rgba(99, 102, 241, 0.04) 60%, transparent 80%);
}

.orb-cyan {
  width: 400px;
  height: 400px;
  top: 35%;
  left: 45%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(14, 165, 233, 0.10) 0%, rgba(37, 99, 235, 0.02) 65%, transparent 85%);
}

/* ═══════════════════════════════════════════════════════
   MAIN SPLIT-SCREEN SHELL
═══════════════════════════════════════════════════════ */
.login-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  align-items: center;
  padding: 32px 56px;
  box-sizing: border-box;
  gap: 40px;
}

/* ═══════════════════════════════════════════════════
   LEFT BRANDING & SHOWCASE PANEL
═══════════════════════════════════════════════════ */
.brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px 24px 0;
  box-sizing: border-box;
}

.brand-panel-inner {
  max-width: 620px;
}

/* BRAND HEADER */
.brand-header {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  user-select: none;
}

.brand-logo-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 10px 20px -5px rgba(37, 99, 235, 0.4),
    0 2px 6px rgba(37, 99, 235, 0.2);
}

.brand-meta {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #0f172a;
  line-height: 1.1;
}

.brand-tag {
  font-family: 'Poppins', sans-serif;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #64748b;
  margin-top: 2px;
}

/* EYEBROW BADGE */
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: 9999px;
  margin-bottom: 18px;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.pill-text {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.6px;
  color: #1d4ed8;
  text-transform: uppercase;
}

/* HERO HEADLINE */
.hero-heading {
  font-family: 'Poppins', sans-serif;
  margin: 0 0 16px;
  line-height: 1.15;
}

.heading-welcome {
  display: block;
  font-size: clamp(34px, 3.6vw, 46px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1px;
}

.heading-brand {
  display: block;
  font-size: clamp(40px, 4.4vw, 56px);
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #2563eb;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* DESCRIPTION */
.hero-description {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  color: #475569;
  margin: 0 0 28px;
  max-width: 540px;
}

/* FEATURE LIST */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 34px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.feature-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.box-blue {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.box-indigo {
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.box-emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.feature-text {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.35;
}

.feature-sub {
  font-family: 'Poppins', sans-serif;
  font-size: 12.5px;
  font-weight: 400;
  color: #64748b;
  margin-top: 2px;
}

/* ═══════════════════════════════════════════════════
   CAMPUS TECHNOLOGY VISUAL SHOWCASE
═══════════════════════════════════════════════════ */
.campus-tech-showcase {
  position: relative;
  width: 100%;
  min-height: 220px;
  padding-bottom: 20px;
}

/* PREVIEW TICKET CARD */
.showcase-preview {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow:
    0 16px 36px -8px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.03);
  max-width: 480px;
  transition: transform 0.25s ease;
}

.showcase-preview:hover {
  transform: translateY(-2px);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.preview-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'Poppins', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #2563eb;
}

.status-live-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.preview-id {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.preview-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.preview-issue-title {
  font-family: 'Poppins', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
}

.preview-status-badge {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  background: #fef3c7;
  color: #b45309;
  padding: 3px 9px;
  border-radius: 6px;
  flex-shrink: 0;
}

.preview-progress-track {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.preview-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 999px;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;
  font-size: 11.5px;
  color: #64748b;
}

.preview-assigned {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #475569;
  font-weight: 500;
}

.preview-time {
  color: #94a3b8;
}

/* FLOATING STATISTIC CARDS */
.floating-stat-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow:
    0 12px 28px -6px rgba(15, 23, 42, 0.09),
    0 2px 8px rgba(15, 23, 42, 0.04);
  user-select: none;
  transition: transform 0.25s ease;
}

.floating-stat-card:hover {
  transform: translateY(-2px);
}

.stat-resolved {
  top: -18px;
  right: 20px;
}

.stat-users {
  bottom: 0px;
  right: 10px;
}

.stat-time {
  display: none; /* Shown on wider screens */
}

@media (min-width: 1280px) {
  .stat-time {
    display: flex;
    bottom: -15px;
    left: 20px;
  }
}

.stat-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-blue { background: #dbeafe; color: #2563eb; }
.icon-indigo { background: #e0e7ff; color: #4338ca; }
.icon-amber { background: #fef3c7; color: #d97706; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
}

.stat-label {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

/* ═══════════════════════════════════════════════════
   RIGHT PANEL — PREMIUM AUTHENTICATION CARD
═══════════════════════════════════════════════════ */
.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 24px;
  padding: 42px 38px;
  box-sizing: border-box;
  box-shadow:
    0 24px 60px -12px rgba(15, 23, 42, 0.08),
    0 8px 24px -4px rgba(15, 23, 42, 0.04);
  position: relative;
}

/* MOBILE BRAND (Hidden on desktop) */
.mobile-brand-header {
  display: none;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f1f5f9;
}

.mobile-logo-wrap {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.mobile-brand-name {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #0f172a;
}

.mobile-brand-sub {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.5px;
}

/* CARD HEADER */
.card-header {
  margin-bottom: 26px;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.6px;
  margin: 0 0 6px;
  line-height: 1.2;
}

.card-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* ERROR BANNER */
.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 20px;
  color: #b91c1c;
}

.error-banner-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: #dc2626;
}

.error-banner-text {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}

/* FORM LAYOUT */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forgot-password-link {
  background: none;
  border: none;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  transition: color 0.15s ease;
}

.forgot-password-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* INPUT BOX */
.field-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.field-prefix-icon {
  position: absolute;
  left: 15px;
  color: #94a3b8;
  font-size: 18px;
  pointer-events: none;
  transition: color 0.15s ease;
}

.field-input-box input {
  width: 100%;
  height: 48px;
  padding: 0 46px;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.field-input-box input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.field-input-box input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.12);
}

.field-input-box:focus-within .field-prefix-icon {
  color: #2563eb;
}

.toggle-visibility-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.toggle-visibility-btn:hover {
  color: #475569;
  background: #f1f5f9;
}

/* REMEMBER ME CHECKBOX */
.remember-me-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: -2px;
}

.remember-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.remember-checkbox-label input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-checkbox {
  width: 19px;
  height: 19px;
  border-radius: 6px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.check-icon {
  color: #ffffff;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.15s ease;
}

.remember-checkbox-label input:checked + .custom-checkbox {
  background: #2563eb;
  border-color: #2563eb;
}

.remember-checkbox-label input:checked + .custom-checkbox .check-icon {
  opacity: 1;
  transform: scale(1);
}

.remember-text {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

/* SIGN IN BUTTON */
.primary-sign-in-btn {
  width: 100%;
  height: 50px;
  margin-top: 6px;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%) !important;
  color: #ffffff !important;
  font-family: 'Poppins', sans-serif !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
  border-radius: 12px !important;
  box-shadow:
    0 10px 24px -4px rgba(37, 99, 235, 0.38),
    0 4px 8px rgba(37, 99, 235, 0.15) !important;
  transition: all 0.2s ease !important;
}

.primary-sign-in-btn:hover {
  transform: translateY(-1.5px);
  box-shadow:
    0 14px 28px -4px rgba(37, 99, 235, 0.45),
    0 6px 12px rgba(37, 99, 235, 0.2) !important;
}

.primary-sign-in-btn:active {
  transform: translateY(0);
}

/* CARD FOOTER */
.auth-card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
}

.security-icon {
  color: #10b981;
}

/* ═══════════════════════════════════════════════════
   MODAL CARD & TOAST NOTIFICATION
═══════════════════════════════════════════════════ */
.modal-card {
  width: min(440px, 92vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close-btn {
  color: #94a3b8 !important;
}

.modal-description {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 18px;
}

.modal-input-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}

.modal-input-box input {
  width: 100%;
  height: 46px;
  padding: 0 16px 0 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 11px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.modal-input-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.modal-btn-cancel {
  font-family: 'Poppins', sans-serif !important;
  color: #64748b !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
}

.modal-btn-confirm {
  font-family: 'Poppins', sans-serif !important;
  background: #2563eb !important;
  color: #ffffff !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  padding: 8px 18px !important;
}

.modal-success-body {
  text-align: center;
  padding: 10px 4px 6px;
}

.modal-success-icon-wrap {
  margin-bottom: 12px;
}

.modal-success-title {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
}

.modal-success-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px;
}

/* SUCCESS TOAST */
.login-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 14px 22px;
  border-radius: 14px;
  box-shadow:
    0 16px 36px -6px rgba(0, 0, 0, 0.14),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #10b981;
  margin-top: 18px;
  font-family: 'Poppins', sans-serif;
}

.toast-icon-wrap {
  color: #10b981;
}

.toast-text {
  display: flex;
  flex-direction: column;
}

.toast-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
}

.toast-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #64748b;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ═══════════════════════════════════════════════════
   RESPONSIVE DESIGN BREAKPOINTS
═══════════════════════════════════════════════════ */

/* Laptops / smaller desktop screens */
@media (max-width: 1200px) {
  .login-shell {
    padding: 32px 36px;
    gap: 32px;
  }

  .campus-tech-showcase {
    min-height: 200px;
  }

  .stat-resolved {
    right: 0;
  }
}

/* Tablets (landscape & portrait) */
@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 540px;
    padding: 40px 24px;
    min-height: 100vh;
  }

  .brand-panel {
    display: none;
  }

  .mobile-brand-header {
    display: flex;
  }

  .auth-panel {
    width: 100%;
  }

  .auth-card {
    max-width: 100%;
    padding: 34px 28px;
  }
}

/* Mobile phones */
@media (max-width: 480px) {
  .login-shell {
    padding: 24px 16px;
  }

  .auth-card {
    padding: 28px 20px;
    border-radius: 20px;
  }

  .card-title {
    font-size: 24px;
  }

  .card-subtitle {
    font-size: 13px;
  }

  .field-input-box input {
    height: 46px;
  }

  .primary-sign-in-btn {
    height: 48px;
    font-size: 14.5px !important;
  }
}

.login-page {
  background:
    radial-gradient(ellipse at 8% 12%, rgba(59, 130, 246, 0.12), transparent 34%),
    radial-gradient(ellipse at 100% 86%, rgba(129, 140, 248, 0.12), transparent 34%),
    linear-gradient(135deg, #f8fbff 0%, #edf4ff 54%, #f7f8ff 100%);
}

.bg-grid-pattern {
  display: none;
}

.login-shell {
  max-width: 1600px;
  grid-template-columns: minmax(0, 1.52fr) minmax(390px, 0.92fr);
  gap: clamp(28px, 4vw, 64px);
  padding: 32px clamp(36px, 6vw, 88px);
}

.brand-panel {
  min-width: 0;
  padding: 18px 0;
}

.brand-panel-inner {
  width: 100%;
  max-width: 760px;
}

.brand-header {
  margin-bottom: 20px;
}

.brand-logo-badge,
.mobile-logo-wrap {
  background: linear-gradient(145deg, #0738dc 0%, #0868ff 100%);
  border-radius: 14px;
}

.eyebrow-pill {
  margin-bottom: 16px;
  background: rgba(37, 99, 235, 0.07);
  border-color: rgba(37, 99, 235, 0.13);
}

.hero-heading {
  margin-bottom: 12px;
}

.hero-heading::after {
  display: block;
  width: 52px;
  height: 3px;
  margin-top: 10px;
  border-radius: 99px;
  background: #1458f5;
  content: '';
}

.heading-brand {
  background-image: linear-gradient(110deg, #0643ed 0%, #1474ff 72%, #338cff 100%);
}

.heading-welcome {
  font-size: clamp(42px, 4vw, 56px);
}

.heading-brand {
  font-size: clamp(48px, 4.8vw, 68px);
}

.hero-description {
  max-width: 570px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.feature-list {
  flex-direction: row;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 8px;
}

.feature-item {
  flex: 1 1 0;
  min-width: 0;
  gap: 10px;
}

.feature-icon-box {
  width: 36px;
  height: 40px;
  border-radius: 11px;
}

.feature-title {
  font-size: 12px;
  line-height: 1.35;
}

.feature-sub {
  font-size: 10px;
  line-height: 1.4;
}

.campus-tech-showcase {
  min-height: 330px;
  margin-top: 8px;
  padding: 0;
  isolation: isolate;
}

.campus-tech-showcase::before {
  position: absolute;
  z-index: -1;
  inset: 0 38% -4px 0;
  background-image: url('../assets/campus-landscape-clean.png');
  background-repeat: no-repeat;
  background-position: 50% 72%;
  background-size: cover;
  border-radius: 22px;
  box-shadow: 0 18px 38px -22px rgba(15, 45, 110, 0.38);
  content: '';
  opacity: 0.94;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 24%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 24%);
}

.showcase-preview {
  display: none;
}

.floating-stat-card {
  padding: 9px 13px;
  border-radius: 12px;
}

.stat-resolved {
  top: 2px;
  right: 12px;
}

.stat-users {
  top: 66px;
  right: 0;
  bottom: auto;
}

.stat-time {
  top: 174px;
  left: auto;
  right: 18px;
  bottom: auto;
  display: flex;
}

@media (max-width: 1200px) and (min-width: 981px) {
  .campus-tech-showcase {
    min-height: 290px;
  }

  .campus-tech-showcase::before {
    inset: 0 32% -4px 0;
  }
}

.auth-card .mobile-brand-header {
  display: flex;
  margin-bottom: 25px;
  padding-bottom: 19px;
  border-bottom: 1px solid #f1f5f9;
}

.auth-card {
  max-width: 460px;
  padding: 36px 38px 30px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 25px;
  box-shadow:
    0 28px 72px -22px rgba(39, 76, 145, 0.24),
    0 8px 24px rgba(39, 76, 145, 0.08);
}

.card-header {
  margin-bottom: 23px;
}

.card-title {
  font-size: 34px;
  letter-spacing: -1px;
}

.card-subtitle {
  font-size: 13px;
}

.login-form {
  gap: 17px;
}

.form-field-group {
  gap: 7px;
}

.field-input-box input {
  height: 45px;
  border-radius: 9px;
  background: #fff;
  font-size: 13px;
}

.primary-sign-in-btn {
  height: 48px;
  margin-top: 3px;
  border-radius: 10px !important;
  background: linear-gradient(110deg, #073ee8 0%, #0875ff 100%) !important;
}

.auth-card-footer {
  justify-content: flex-start;
  gap: 9px;
  margin-top: 18px;
  padding-top: 0;
  border-top: 0;
  font-size: 10.5px;
  line-height: 1.55;
}

.security-copy {
  display: flex;
  flex-direction: column;
}

.security-copy span + span {
  color: #a0aec0;
}

@media (max-width: 1200px) {
  .login-shell {
    grid-template-columns: minmax(0, 1.35fr) minmax(370px, 0.95fr);
    padding-right: 36px;
    padding-left: 36px;
  }

  .feature-list {
    gap: 10px;
  }

  .heading-welcome {
    font-size: clamp(38px, 4vw, 48px);
  }

  .heading-brand {
    font-size: clamp(44px, 4.6vw, 58px);
  }

  .feature-item {
    gap: 8px;
  }

  .feature-sub {
    font-size: 9px;
  }
}

@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 540px;
    padding: 40px 24px;
  }

  .brand-panel {
    display: none;
  }

  .mobile-brand-header {
    display: flex;
  }

  .auth-card {
    max-width: 100%;
    padding: 34px 28px;
  }
}

@media (max-width: 480px) {
  .login-shell {
    padding: 24px 16px;
  }

  .auth-card {
    padding: 28px 20px;
    border-radius: 20px;
  }

  .card-title {
    font-size: 24px;
  }

  .card-subtitle {
    font-size: 13px;
  }

  .field-input-box input {
    height: 46px;
  }

  .primary-sign-in-btn {
    height: 48px;
    font-size: 14.5px !important;
  }
}
</style>
