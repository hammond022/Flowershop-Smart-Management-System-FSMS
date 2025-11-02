<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Login</h3>
            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label class="form-label">Email or Name</label>
                <input v-model="identifier" type="text" class="form-control" placeholder="Email or username" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-primary">Login</button>
                <router-link to="/forgot">Forgot password?</router-link>
              </div>
            </form>
            <hr />
            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from "@/composables/useAuth";
import { ref } from "vue";

export default {
  setup(_, { emit }) {
    const { login } = useAuth();
    const identifier = ref("");
    const password = ref("");

    async function onSubmit() {
      try {
        await login(identifier.value, password.value);
        // redirect home
        window.location.href = "/";
      } catch (err) {
        alert(err?.response?.data?.error || "Login failed");
      }
    }

    return { identifier, password, onSubmit };
  },
};
</script>

<style scoped>
</style>
