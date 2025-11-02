<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Forgot Password</h3>
            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
              <button class="btn btn-primary">Send reset link</button>
            </form>
            <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
            <hr />
            <p>Remembered? <router-link to="/login">Login</router-link></p>
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
    const { forgotPassword } = useAuth();
    const email = ref("");
    const message = ref("");

    async function onSubmit() {
      try {
        const res = await forgotPassword(email.value);
        message.value = res?.message || "If an account exists for this email, you'll receive instructions.";
      } catch (err) {
        message.value = err?.response?.data?.error || "Request failed";
      }
    }

    return { email, message, onSubmit };
  },
};
</script>

<style scoped>
</style>
