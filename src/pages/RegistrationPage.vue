<template>
  <q-page class="registration-page">
    <div class="registration-background" aria-hidden="true">
      <div class="background-orb background-orb-blue"></div>
      <div class="background-orb background-orb-indigo"></div>
    </div>

    <main class="registration-shell">
      <section class="registration-card" aria-labelledby="registration-title">
        <router-link
          to="/login"
          class="brand-header"
          aria-label="CampusCare sign in"
        >
          <span class="brand-logo">
            <q-icon name="school" size="25px" />
          </span>
          <span class="brand-copy">
            <span class="brand-name">CAMPUSCARE</span>
            <span class="brand-tagline">SMART CAMPUS PLATFORM</span>
          </span>
        </router-link>

        <div class="card-heading">
          <span class="registration-badge">
            <span class="badge-dot"></span>
            STUDENT REGISTRATION
          </span>
          <h1 id="registration-title">Create your CampusCare Account</h1>
          <p
            >Join your campus community and help make your university a better
            place.</p
          >
        </div>

        <div
          v-if="errorMsg"
          class="feedback-banner error-banner"
          role="alert"
          aria-live="assertive"
        >
          <q-icon name="error_outline" size="20px" />
          <div>
            <span>{{ errorMsg }}</span>
            <router-link v-if="duplicateEmail" to="/login"
              >Sign in to your account</router-link
            >
          </div>
        </div>

        <div
          v-if="success"
          class="feedback-banner success-banner"
          role="status"
          aria-live="polite"
        >
          <q-icon name="check_circle" size="20px" />
          <span>Account created successfully! Redirecting you to sign in…</span>
        </div>

        <form class="registration-form" novalidate @submit.prevent="onSubmit">
          <div class="form-field">
            <label for="full-name">Full Name</label>
            <div class="input-wrap" :class="{ 'input-invalid': errors.name }">
              <q-icon name="person" class="input-icon" />
              <input
                id="full-name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="Enter your full name"
                :aria-invalid="Boolean(errors.name)"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                @input="clearFieldError('name')"
              />
            </div>
            <span v-if="errors.name" id="name-error" class="field-error">{{
              errors.name
            }}</span>
          </div>

          <div class="form-field">
            <label for="university-email">University Email</label>
            <div class="input-wrap" :class="{ 'input-invalid': errors.email }">
              <q-icon name="mail" class="input-icon" />
              <input
                id="university-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="name@university.edu"
                :aria-invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? 'email-error' : undefined"
                @input="clearFieldError('email')"
              />
            </div>
            <span v-if="errors.email" id="email-error" class="field-error">{{
              errors.email
            }}</span>
          </div>

          <div class="form-field">
            <label for="registration-password">Password</label>
            <div
              class="input-wrap"
              :class="{ 'input-invalid': errors.password }"
            >
              <q-icon name="lock" class="input-icon" />
              <input
                id="registration-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Create a password"
                :aria-invalid="Boolean(errors.password)"
                :aria-describedby="
                  errors.password ? 'password-error' : undefined
                "
                @input="clearPasswordErrors"
              />
              <button
                type="button"
                class="visibility-button"
                :aria-label="showPassword ? 'Hide passwords' : 'Show passwords'"
                @click="showPassword = !showPassword"
              >
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  size="18px"
                />
              </button>
            </div>
            <span
              v-if="errors.password"
              id="password-error"
              class="field-error"
            >
              {{ errors.password }}
            </span>
          </div>

          <div class="form-field">
            <label for="confirm-password">Confirm Password</label>
            <div
              class="input-wrap"
              :class="{ 'input-invalid': errors.confirmPassword }"
            >
              <q-icon name="lock" class="input-icon" />
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                :aria-invalid="Boolean(errors.confirmPassword)"
                :aria-describedby="
                  errors.confirmPassword ? 'confirm-password-error' : undefined
                "
                @input="clearFieldError('confirmPassword')"
              />
              <button
                type="button"
                class="visibility-button"
                :aria-label="showPassword ? 'Hide passwords' : 'Show passwords'"
                @click="showPassword = !showPassword"
              >
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  size="18px"
                />
              </button>
            </div>
            <span
              v-if="errors.confirmPassword"
              id="confirm-password-error"
              class="field-error"
            >
              {{ errors.confirmPassword }}
            </span>
          </div>

          <div class="terms-row">
            <label class="terms-label">
              <input
                v-model="acceptedTerms"
                type="checkbox"
                @change="clearFieldError('terms')"
              />
              <span class="custom-checkbox" aria-hidden="true">
                <q-icon name="check" size="13px" />
              </span>
              <span>I agree to the Terms &amp; Conditions</span>
            </label>
            <span v-if="errors.terms" class="field-error terms-error">{{
              errors.terms
            }}</span>
          </div>

          <q-btn
            unelevated
            no-caps
            type="submit"
            label="Create Account"
            icon-right="arrow_forward"
            class="create-account-button"
            :loading="loading"
            :disable="loading || success"
          >
            <template #loading>
              <q-spinner-dots size="22px" />
            </template>
          </q-btn>
        </form>

        <p class="signin-prompt">
          Already have an account?
          <router-link to="/login">Sign In</router-link>
        </p>

        <div class="security-note">
          <q-icon name="shield" size="15px" />
          <span>Your account is protected by CampusCare authentication</span>
        </div>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')
const duplicateEmail = ref(false)
const errors = ref({})

function validateForm() {
  const validationErrors = {}

  if (!name.value.trim()) {
    validationErrors.name = 'Please enter your full name.'
  }

  const normalizedEmail = email.value.trim()
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    validationErrors.email = 'Please enter a valid email address.'
  }

  if (!password.value) {
    validationErrors.password = 'Please enter a password.'
  } else if (password.value.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters.'
  }

  if (!confirmPassword.value) {
    validationErrors.confirmPassword = 'Please confirm your password.'
  } else if (confirmPassword.value !== password.value) {
    validationErrors.confirmPassword = 'Passwords do not match.'
  }

  if (!acceptedTerms.value) {
    validationErrors.terms = 'Please accept the Terms & Conditions.'
  }

  errors.value = validationErrors
  return Object.keys(validationErrors).length === 0
}

function clearFieldError(field) {
  if (errors.value[field]) {
    errors.value = { ...errors.value, [field]: '' }
  }
}

function clearPasswordErrors() {
  clearFieldError('password')
  if (confirmPassword.value) clearFieldError('confirmPassword')
}

async function onSubmit() {
  if (loading.value || success.value) return

  errorMsg.value = ''
  duplicateEmail.value = false
  if (!validateForm()) return

  loading.value = true
  try {
    await register(
      name.value.trim(),
      email.value.trim().toLowerCase(),
      password.value
    )
    success.value = true
    window.setTimeout(() => {
      router.replace('/login')
    }, 1400)
  } catch (err) {
    const status = err.response?.status
    const responseMessage = err.response?.data?.message
    duplicateEmail.value =
      status === 409 ||
      /already registered|already exists/i.test(responseMessage || '')
    errorMsg.value = duplicateEmail.value
      ? 'This email is already registered. Please sign in instead.'
      : responseMessage ||
        'Unable to create your account right now. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

.registration-page {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 36px 20px;
  box-sizing: border-box;
  color: #0f172a;
  font-family:
    'Poppins',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  background:
    radial-gradient(
      ellipse at 8% 12%,
      rgba(59, 130, 246, 0.12),
      transparent 34%
    ),
    radial-gradient(
      ellipse at 100% 86%,
      rgba(129, 140, 248, 0.12),
      transparent 34%
    ),
    linear-gradient(135deg, #f8fbff 0%, #edf4ff 54%, #f7f8ff 100%);
}

.registration-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-orb {
  position: absolute;
  width: 440px;
  height: 440px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
}

.background-orb-blue {
  top: -250px;
  left: -170px;
  background: rgba(37, 99, 235, 0.16);
}

.background-orb-indigo {
  right: -210px;
  bottom: -250px;
  background: rgba(99, 102, 241, 0.14);
}

.registration-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.registration-card {
  padding: 34px 40px 26px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 25px;
  background: #fff;
  box-shadow:
    0 28px 72px -22px rgba(39, 76, 145, 0.24),
    0 8px 24px rgba(39, 76, 145, 0.08);
}

.brand-header {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  color: inherit;
  text-decoration: none;
}

.brand-logo {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  box-shadow: 0 7px 17px rgba(37, 99, 235, 0.28);
}

.brand-copy,
.brand-name,
.brand-tagline {
  display: block;
}

.brand-name {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.2px;
  line-height: 1.2;
}

.brand-tagline {
  margin-top: 3px;
  color: #64748b;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.3px;
}

.card-heading {
  margin-bottom: 22px;
}

.registration-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 11px;
  padding: 6px 11px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 999px;
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.07);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.1px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.card-heading h1 {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.25;
}

.card-heading p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.feedback-banner {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 17px;
  padding: 11px 12px;
  border: 1px solid;
  border-radius: 10px;
  font-size: 11px;
  line-height: 1.5;
}

.feedback-banner > :first-child {
  flex: none;
  margin-top: 1px;
}

.feedback-banner div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-banner {
  border-color: #fecaca;
  color: #b91c1c;
  background: #fef2f2;
}

.error-banner a {
  width: fit-content;
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: underline;
}

.success-banner {
  border-color: #a7f3d0;
  color: #047857;
  background: #ecfdf5;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field > label {
  color: #1e293b;
  font-size: 11px;
  font-weight: 600;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 13px;
  z-index: 1;
  color: #94a3b8;
  font-size: 17px;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  height: 43px;
  padding: 0 43px;
  box-sizing: border-box;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  outline: none;
  color: #0f172a;
  background: #fff;
  font:
    400 12px 'Poppins',
    sans-serif;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.input-wrap input::placeholder {
  color: #94a3b8;
}

.input-wrap input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.11);
}

.input-invalid input {
  border-color: #ef4444;
}

.visibility-button {
  position: absolute;
  right: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 0;
  border-radius: 7px;
  color: #94a3b8;
  background: transparent;
  cursor: pointer;
}

.visibility-button:hover {
  color: #475569;
  background: #f1f5f9;
}

.field-error {
  color: #b91c1c;
  font-size: 10px;
  line-height: 1.4;
}

.terms-row {
  margin-top: 1px;
}

.terms-label {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #475569;
  font-size: 10px;
  cursor: pointer;
}

.terms-label input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.custom-checkbox {
  display: flex;
  width: 17px;
  height: 17px;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #cbd5e1;
  border-radius: 5px;
  color: #fff;
  background: #fff;
}

.terms-label input:checked + .custom-checkbox {
  border-color: #2563eb;
  background: #2563eb;
}

.terms-label input:focus-visible + .custom-checkbox {
  outline: 3px solid rgba(37, 99, 235, 0.2);
}

.terms-error {
  display: block;
  margin: 5px 0 0 26px;
}

.create-account-button {
  width: 100%;
  height: 47px;
  margin-top: 2px;
  border-radius: 10px !important;
  color: #fff !important;
  background: linear-gradient(110deg, #073ee8 0%, #0875ff 100%) !important;
  box-shadow: 0 9px 20px -5px rgba(37, 99, 235, 0.38) !important;
  font-family: 'Poppins', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease !important;
}

.create-account-button:not(.disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -5px rgba(37, 99, 235, 0.45) !important;
}

.signin-prompt {
  margin: 17px 0 0;
  color: #64748b;
  font-size: 11px;
  text-align: center;
}

.signin-prompt a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.signin-prompt a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.security-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 19px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
  color: #94a3b8;
  font-size: 9px;
}

.security-note .q-icon {
  flex: none;
  color: #10b981;
}

@media (max-width: 520px) {
  .registration-page {
    padding: 20px 14px;
  }

  .registration-card {
    padding: 27px 22px 22px;
    border-radius: 20px;
  }

  .brand-header {
    margin-bottom: 21px;
  }

  .card-heading h1 {
    font-size: 24px;
  }

  .registration-form {
    gap: 13px;
  }
}
</style>
