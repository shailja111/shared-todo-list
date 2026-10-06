<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useTaskStore } from "../stores/tasks";

const auth = useAuthStore();
const store = useTaskStore();

const title = ref("");
const description = ref("");
const filter = ref("all");
const shareId = ref<string | null>(null);
const shareEmail = ref("");

onMounted(() => store.fetchTasks());

const filtered = computed(() => store.tasks.filter(t => {
  if (filter.value === "my") return t.owner_email === auth.user?.email;
  if (filter.value === "shared") return t.owner_email !== auth.user?.email;
  return true;
}));

async function addTask() {
  if (!title.value.trim()) return;
  await store.createTask(title.value, description.value);
  title.value = "";
  description.value = "";
}

async function share() {
  if (!shareId.value || !shareEmail.value) return;
  try {
    await store.shareTask(shareId.value, shareEmail.value);
    alert("Task shared successfully");
    shareId.value = null;
    shareEmail.value = "";
  } catch (e: any) {
    alert(e.response?.data?.message || "Unable to share task");
  }
}
</script>

<template>
  <main class="dashboard">
    <header>
      <h1>My Tasks</h1>
      <button @click="auth.logout">Logout</button>
    </header>

    <section class="card">
      <input v-model="title" placeholder="Task title" />
      <textarea v-model="description" placeholder="Description"></textarea>
      <button @click="addTask">Add Task</button>
    </section>

    <section class="filter">
      <label>Filter: </label>
      <select v-model="filter">
        <option value="all">All Tasks</option>
        <option value="my">My Tasks</option>
        <option value="shared">Shared Tasks</option>
      </select>
    </section>

    <section>
      <div v-for="task in filtered" :key="task.id" class="task card">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="store.updateTask(task.id, { completed: !task.completed })"
        />
        <div class="task-body">
          <h3 :class="{ done: task.completed }">{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <small>Owner: {{ task.owner_email }}</small>
        </div>
        <button
          v-if="task.owner_email === auth.user?.email"
          @click="shareId = task.id"
        >Share</button>
        <button
          v-if="task.owner_email === auth.user?.email"
          @click="store.deleteTask(task.id)"
        >Delete</button>
      </div>
    </section>

    <div v-if="shareId" class="modal">
      <div class="card modal-card">
        <h2>Share Task</h2>
        <input v-model="shareEmail" placeholder="User email" />
        <button @click="share">Share</button>
        <button class="secondary" @click="shareId = null">Cancel</button>
      </div>
    </div>
  </main>
</template>