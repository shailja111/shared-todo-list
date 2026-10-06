<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const signup = ref(false);
const error = ref("");

async function submit() {
  error.value = "";
  try {
    if (signup.value) await auth.signup(email.value, password.value);
    else await auth.login(email.value, password.value);
  } catch (e: any) {
    error.value = e.message || "Authentication failed";
  }
}
</script>

<template>
  <main class="login">
    <div class="card">
      <h1>Shared To-Do List</h1>
      <h2>{{ signup ? "Create Account" : "Login" }}</h2>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="submit">{{ signup ? "Sign Up" : "Login" }}</button>
      <p class="error" v-if="error">{{ error }}</p>
      <button class="secondary" @click="signup = !signup">
        {{ signup ? "Already have an account? Login" : "Create an account" }}
      </button>
    </div>
  </main>
</template>