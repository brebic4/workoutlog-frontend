<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => auth.isLoggedIn)

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="border-b">
    <div class="p-4 flex items-center justify-between">
      <router-link to="/workouts" class="font-bold text-lg">WorkoutLog</router-link>

      <nav class="flex gap-4 items-center">
        <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register">Register</router-link>

        <button v-if="isLoggedIn" class="px-3 py-1 border rounded" @click="logout">Logout</button>
      </nav>
    </div>
  </header>
</template>
