<script setup>
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/ui/BaseButton.vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

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
        <BaseButton v-if="!auth.isLoggedIn" as="router-link" to="/login"> Login </BaseButton>

        <BaseButton v-if="!auth.isLoggedIn" as="router-link" to="/register"> Register </BaseButton>

        <BaseButton v-if="auth.isLoggedIn" variant="danger" @click="logout"> Logout </BaseButton>
      </nav>
    </div>
  </header>
</template>
