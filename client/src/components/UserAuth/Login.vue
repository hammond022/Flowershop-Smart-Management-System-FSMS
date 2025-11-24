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
  <!-- 
     
    !!! THIS IS JUST A TEMPLATE !!!
    
    Di ko alam kung san ko ilalagay sa database yung login credentials

    and yung users.js di ko talaga maintindihan
    -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-light"
  >
    <div
      class="card shadow p-4"
      style="width: 100%; max-width: 400px; border-radius: 1rem"
    >
      <h3 class="text-center mb-4">Login</h3>
      <form @submit.prevent="submitLogin">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Enter your password"
              required
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        <p v-if="auth.error" class="text-danger">{{ auth.error }}</p>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>
