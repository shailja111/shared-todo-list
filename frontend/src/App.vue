<script setup lang="ts">
import { computed } from "vue";
import Login from "./components/Login.vue";
import TaskDashboard from "./components/TaskDashboard.vue";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
const loggedIn = computed(() => !!auth.user);
</script>

<template>
  <div v-if="auth.loading">Loading...</div>
  <Login v-else-if="!loggedIn" />
  <TaskDashboard v-else />
</template>