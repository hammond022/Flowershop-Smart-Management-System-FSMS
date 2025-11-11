<script setup></script>

<template>
  <!-- 
     
    !!! THIS IS JUST A TEMPLATE !!!
    
    Di ko alam kung san ko ilalagay sa database yung login credentials

    and yung users.js di ko talaga maintindihan
    -->
  <div class="d-flex justify-content-center align-items-center vh-70 bg-light">
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
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <p v-if="auth.error" class="text-danger">{{ auth.error }}</p>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { auth } from "@/auth.js";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");

const submitLogin = async () => {
  await auth.login(username.value, password.value);
  if (auth.isAuthenticated) {
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  }
};
</script>
