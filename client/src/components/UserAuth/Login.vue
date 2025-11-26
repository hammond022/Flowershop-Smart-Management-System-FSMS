<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { auth } from "@/auth.js";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const submitLogin = async () => {
  await auth.login(username.value, password.value);
  if (auth.isAuthenticated) {
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Left decorative section -->
      <div class="login-left">
        <div class="login-brand">
          <div class="brand-icon">🌸</div>
          <h1>FSMS</h1>
          <p>Flowershop Smart Management System</p>
        </div>
        <div class="login-features">
          <div class="feature">
            <i class="bi bi-box-fill"></i>
            <span>Inventory </span>
          </div>
          <div class="feature">
            <i class="bi bi-basket2-fill"></i>
            <span>Point of Sale</span>
          </div>
          <div class="feature">
            <i class="bi bi-graph-up"></i>
            <span> Analytics</span>
          </div>
        </div>
      </div>

      <!-- Right login form section -->
      <div class="login-right">
        <div class="login-form-container">
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to your account</p>

          <form @submit.prevent="submitLogin" class="login-form">
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
                  placeholder="Enter your password"
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
            </div>

            <!-- Error message -->
            <div v-if="auth.error" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ auth.error }}
            </div>

            <!-- Login button -->
            <button type="submit" class="btn-login">
              <span>Sign In</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-brand {
  text-align: center;
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

.login-brand h1 {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 2px;
}

.login-brand p {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 10px;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

.feature i {
  font-size: 24px;
}

.login-right {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-container {
  width: 100%;
  max-width: 350px;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.login-subtitle {
  color: #999;
  font-size: 14px;
  margin: 0 0 40px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
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
  padding: 14px 45px 14px 45px;
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

.toggle-password:active {
  transform: scale(0.95);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  color: #c00;
  font-size: 13px;
  animation: slideIn 0.3s ease;
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

.btn-login {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-login:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 13px;
  color: #999;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-footer a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .login-left {
    padding: 40px 30px;
    min-height: 300px;
  }

  .login-brand h1 {
    font-size: 28px;
  }

  .brand-icon {
    font-size: 60px;
  }

  .login-right {
    padding: 40px 30px;
  }

  .login-form-container {
    width: 100%;
  }
}
</style>
