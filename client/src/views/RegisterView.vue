<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Register</h3>
            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
              <button class="btn btn-success">Register</button>
            </form>
            <hr />
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
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
  setup() {
    const { register } = useAuth();
    const name = ref("");
    const email = ref("");
    const password = ref("");

    async function onSubmit() {
      try {
        await register(name.value, email.value, password.value);
        window.location.href = "/";
      } catch (err) {
        alert(err?.response?.data?.error || "Registration failed");
      }
    }

    return { name, email, password, onSubmit };
  },
};
</script>

<style scoped>
</style>
