<script setup>
</script>

<template>
    <!-- 
     
    !!! THIS IS JUST A TEMPLATE !!!
    
    Di ko alam kung san ko ilalagay sa database yung login credentials

    and yung users.js di ko talaga maintindihan
    -->
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px; border-radius: 1rem;">
      <h3 class="text-center mb-4">Login</h3>

      <form>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            placeholder="Enter your email" 
            required
          >
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            placeholder="Enter your password" 
            required
          >
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="rememberMe"
            >
            <label class="form-check-label" for="rememberMe">
              Remember me
            </label>
          </div>
          <a href="#" class="text-decoration-none small">Forgot password?</a>
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>

      <div class="text-center mt-3">
        <small>Don't have an account? 
          <a href="#" class="text-decoration-none">Sign up</a>
        </small>
      </div>
    </div>
  </div>
</template>
