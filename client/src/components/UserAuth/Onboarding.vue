<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth, API_BASE } from "@/auth.js";
import { resetOnboardingCache } from "@/router/index.js";

const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const passwordStrength = ref(0);
const passwordRequirements = ref({
  length: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  special: false,
});

const checkPasswordStrength = () => {
  const pwd = password.value;

  passwordRequirements.value = {
    length: pwd.length >= 8,
    lowercase: /[a-z]/.test(pwd),
    uppercase: /[A-Z]/.test(pwd),
    digit: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  };

  const met = Object.values(passwordRequirements.value).filter(Boolean).length;
  passwordStrength.value = (met / 5) * 100;
};

const getPasswordStrengthColor = () => {
  if (passwordStrength.value === 0) return "bg-secondary";
  if (passwordStrength.value < 40) return "bg-danger";
  if (passwordStrength.value < 70) return "bg-warning";
  return "bg-success";
};

const getPasswordStrengthText = () => {
  if (passwordStrength.value === 0) return "No password";
  if (passwordStrength.value < 40) return "Weak";
  if (passwordStrength.value < 70) return "Fair";
  return "Strong";
};

const validateForm = () => {
  error.value = "";

  if (!username.value.trim()) {
    error.value = "Username is required";
    return false;
  }

  if (username.value.trim().length < 3) {
    error.value = "Username must be at least 3 characters";
    return false;
  }

  if (!password.value) {
    error.value = "Password is required";
    return false;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return false;
  }

  if (!Object.values(passwordRequirements.value).every(Boolean)) {
    error.value = "Password does not meet all requirements";
    return false;
  }

  return true;
};

const submitForm = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(
      `${API_BASE}/onboarding/create-first-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value.trim(),
          password: password.value,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      error.value = data.error || "Failed to create user";
      return;
    }

    successMessage.value = "Account created successfully! Logging you in...";

    // Reset the onboarding cache since user was created
    resetOnboardingCache();

    // Auto-login after successful creation
    setTimeout(async () => {
      await auth.login(username.value.trim(), password.value);
      password.value = '';
      if (auth.isAuthenticated) {
        router.push("/");
      }
    }, 1500);
  } catch (err) {
    error.value = err.message || "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Check if onboarding is needed
  try {
    const response = await fetch(`${API_BASE}/onboarding/status`);
    const data = await response.json();

    if (!data.isEmpty) {
      // Database already initialized, redirect to login
      router.push("/login");
    }
  } catch (err) {
    console.error("Error checking onboarding status:", err);
  }
});
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-wrapper">
      <!-- Left decorative section -->
      <div class="onboarding-left">
        <div class="onboarding-brand">
          <div class="brand-icon">🌸</div>
          <h1>FSMS</h1>
          <p>Flowershop Smart Management System</p>
        </div>
        <div class="onboarding-welcome">
          <h3>Welcome!</h3>
          <p>
            Let's set up your flowershop management system. Create your first
            admin account to get started.
          </p>
        </div>
        <div class="onboarding-benefits">
          <div class="benefit">
            <i class="bi bi-shield-check"></i>
            <span>Secure Management</span>
          </div>
          <div class="benefit">
            <i class="bi bi-lightning-charge"></i>
            <span>Full Control</span>
          </div>
          <div class="benefit">
            <i class="bi bi-rocket"></i>
            <span>Ready to Use</span>
          </div>
        </div>
      </div>

      <!-- Right form section -->
      <div class="onboarding-right">
        <div class="onboarding-form-container">
          <div class="form-header">
            <h2>Create Your Admin Account</h2>
            <p>This will be your first and primary administrator account</p>
          </div>

          <form @submit.prevent="submitForm" class="onboarding-form">
            <!-- Username field -->
            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="input-wrapper">
                <i class="bi bi-person-fill"></i>
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <small class="form-text">Minimum 3 characters</small>
            </div>

            <!-- Password field -->
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="bi bi-lock-fill"></i>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Enter a strong password"
                  @input="checkPasswordStrength"
                  required
                />
                <button
                  class="toggle-password"
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <i
                    :class="
                      showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                    "
                  ></i>
                </button>
              </div>

              <!-- Password strength indicator -->
              <div class="password-strength" v-if="password">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :class="getPasswordStrengthColor()"
                    :style="{ width: passwordStrength + '%' }"
                  ></div>
                </div>
                <small class="strength-text">
                  Strength: <strong>{{ getPasswordStrengthText() }}</strong>
                </small>
              </div>

              <!-- Password requirements -->
              <div class="requirements" v-if="password">
                <div
                  class="requirement"
                  :class="{ met: passwordRequirements.length }"
                >
                  <i
                    class="bi"
                    :class="
                      passwordRequirements.length
                        ? 'bi-check-circle-fill'
                        : 'bi-circle'
                    "
                  ></i>
                  <span>At least 8 characters</span>
                </div>
                <div
                  class="requirement"
                  :class="{ met: passwordRequirements.lowercase }"
                >
                  <i
                    class="bi"
                    :class="
                      passwordRequirements.lowercase
                        ? 'bi-check-circle-fill'
                        : 'bi-circle'
                    "
                  ></i>
                  <span>One lowercase letter</span>
                </div>
                <div
                  class="requirement"
                  :class="{ met: passwordRequirements.uppercase }"
                >
                  <i
                    class="bi"
                    :class="
                      passwordRequirements.uppercase
                        ? 'bi-check-circle-fill'
                        : 'bi-circle'
                    "
                  ></i>
                  <span>One uppercase letter</span>
                </div>
                <div
                  class="requirement"
                  :class="{ met: passwordRequirements.digit }"
                >
                  <i
                    class="bi"
                    :class="
                      passwordRequirements.digit
                        ? 'bi-check-circle-fill'
                        : 'bi-circle'
                    "
                  ></i>
                  <span>One digit</span>
                </div>
                <div
                  class="requirement"
                  :class="{ met: passwordRequirements.special }"
                >
                  <i
                    class="bi"
                    :class="
                      passwordRequirements.special
                        ? 'bi-check-circle-fill'
                        : 'bi-circle'
                    "
                  ></i>
                  <span>One special character</span>
                </div>
              </div>
            </div>

            <!-- Confirm password field -->
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <i class="bi bi-lock-fill"></i>
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  class="toggle-password"
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  "
                >
                  <i
                    :class="
                      showConfirmPassword
                        ? 'bi bi-eye-slash-fill'
                        : 'bi bi-eye-fill'
                    "
                  ></i>
                </button>
              </div>
              <small
                v-if="confirmPassword && password !== confirmPassword"
                class="form-text text-danger"
              >
                Passwords do not match
              </small>
              <small
                v-else-if="confirmPassword && password === confirmPassword"
                class="form-text text-success"
              >
                Passwords match
              </small>
            </div>

            <!-- Error message -->
            <div v-if="error" class="alert alert-danger">
              <i class="bi bi-exclamation-circle"></i>
              {{ error }}
            </div>

            <!-- Success message -->
            <div v-if="successMessage" class="alert alert-success">
              <i class="bi bi-check-circle"></i>
              {{ successMessage }}
            </div>

            <!-- Create button -->
            <button
              type="submit"
              class="btn-create"
              :disabled="
                loading || !Object.values(passwordRequirements).every(Boolean)
              "
            >
              <span v-if="!loading">Create Admin Account</span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span>
                Creating...
              </span>
            </button>

            <!-- Info notice -->
            <div class="info-notice">
              <i class="bi bi-info-circle"></i>
              <span
                >This account will have full administrative privileges. Keep
                your credentials secure.</span
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.onboarding-wrapper {
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 700px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.onboarding-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.onboarding-brand {
  text-align: center;
  margin-bottom: 40px;
}

.brand-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.onboarding-brand h1 {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 2px;
}

.onboarding-brand p {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 10px;
}

.onboarding-welcome {
  margin-bottom: 40px;
}

.onboarding-welcome h3 {
  font-size: 24px;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.onboarding-welcome p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

.onboarding-benefits {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.benefit i {
  font-size: 20px;
  flex-shrink: 0;
}

.onboarding-right {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.onboarding-form-container {
  width: 100%;
  max-width: 380px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.form-header p {
  color: #999;
  font-size: 13px;
  margin: 0 0 30px 0;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  color: #667eea;
  font-size: 18px;
  pointer-events: none;
}

.input-wrapper .form-control {
  width: 100%;
  padding: 12px 45px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.input-wrapper .form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #667eea;
  font-size: 18px;
  cursor: pointer;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 10;
  height: 100%;
}

.toggle-password:hover {
  color: #764ba2;
}

.form-text {
  font-size: 12px;
  color: #999;
  margin-top: -4px;
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.strength-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-text {
  font-size: 12px;
  color: #666;
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 8px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  transition: color 0.2s ease;
}

.requirement.met {
  color: #28a745;
}

.requirement i {
  font-size: 14px;
  flex-shrink: 0;
}

.alert {
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  animation: slideIn 0.3s ease;
}

.alert-danger {
  background: #fee;
  border: 2px solid #fcc;
  color: #c00;
}

.alert-success {
  background: #efe;
  border: 2px solid #cfc;
  color: #080;
}

.alert i {
  font-size: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-create {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 10px;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-create:active:not(:disabled) {
  transform: translateY(0);
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #e7f3ff;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  font-size: 12px;
  color: #004085;
  margin-top: 10px;
}

.info-notice i {
  font-size: 14px;
  margin-top: 2px;
  flex-shrink: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .onboarding-wrapper {
    flex-direction: column;
    min-height: auto;
  }

  .onboarding-left {
    padding: 40px 30px;
    min-height: auto;
  }

  .onboarding-brand h1 {
    font-size: 28px;
  }

  .brand-icon {
    font-size: 60px;
  }

  .onboarding-right {
    padding: 40px 20px;
  }

  .onboarding-form-container {
    width: 100%;
    max-width: 100%;
  }

  .form-header h2 {
    font-size: 22px;
  }
}
</style>
