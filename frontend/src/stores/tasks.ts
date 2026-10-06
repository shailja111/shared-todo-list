import { defineStore } from "pinia";
import { api } from "../api";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  owner_id: string;
  owner_email: string;
}

export const useTaskStore = defineStore("tasks", {
  state: () => ({ tasks: [] as Task[], loading: false }),
  actions: {
    async fetchTasks() {
      this.loading = true;
      try { this.tasks = (await api.get("/tasks")).data; }
      finally { this.loading = false; }
    },
    async createTask(title: string, description: string) {
  const task = (await api.post("/tasks", { title, description })).data;
  this.tasks.unshift(task);
},
    async updateTask(id: string, data: object) {
      const task = (await api.put(`/tasks/${id}`, data)).data;
      const index = this.tasks.findIndex(t => t.id === id);
      if (index >= 0) this.tasks[index] = { ...this.tasks[index], ...task };
    },
    async deleteTask(id: string) {
      await api.delete(`/tasks/${id}`);
      this.tasks = this.tasks.filter(t => t.id !== id);
    },
    async shareTask(id: string, email: string) {
      await api.post(`/tasks/${id}/share`, { email });
    }
  }
});