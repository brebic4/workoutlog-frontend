<script setup>
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/ui/BaseButton.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import ConfirmModal from '../components/ui/ConfirmModal.vue'

const auth = useAuthStore()
const router = useRouter()

const showLogoutConfirm = ref(false)

const requestLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  auth.logout()
  showLogoutConfirm.value = false
  router.push('/login')
}

const cancelLogout = () => {
  showLogoutConfirm.value = false
}
</script>

<template>
  <header class="border-b">
    <div class="p-4 flex items-center justify-between">
      <router-link to="/workouts" class="font-bold text-lg">WorkoutLog</router-link>

      <nav class="flex gap-4 items-center">
        <BaseButton v-if="!auth.isLoggedIn" as="router-link" to="/login"> Login </BaseButton>

        <BaseButton v-if="!auth.isLoggedIn" as="router-link" to="/register"> Register </BaseButton>

        <BaseButton v-if="auth.isLoggedIn" variant="danger" @click="requestLogout">
          Logout
        </BaseButton>
      </nav>
    </div>
  </header>

  <ConfirmModal
    :show="showLogoutConfirm"
    title="Odjava"
    message="Jeste li sigurni da se želite odjaviti?"
    @confirm="confirmLogout"
    @cancel="cancelLogout"
  />
</template>
