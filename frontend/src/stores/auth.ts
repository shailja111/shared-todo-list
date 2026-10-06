import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth } from "../firebase";
import { api, setAuthToken } from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null as User | null, loading: true }),
  actions: {
    async signup(email: string, password: string) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      this.user = result.user;
      setAuthToken(await result.user.getIdToken());
      await api.post("/users/sync");
    },
    async login(email: string, password: string) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.user = result.user;
      setAuthToken(await result.user.getIdToken());
      await api.post("/users/sync");
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    initialize() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user;
        if (user) {
          setAuthToken(await user.getIdToken());
          await api.post("/users/sync");
        }
        this.loading = false;
      });
    }
  }
});