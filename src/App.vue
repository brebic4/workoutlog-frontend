<script setup>
import InfoModal from './components/ui/InfoModal.vue'
import Navbar from './components/Navbar.vue'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showAuthExpiredModal = ref(false)
const authExpiredTitle = ref('Sesija istekla')
const authExpiredMessage = ref('Sesija istekla, molimo prijavite se ponovno.')

const onAuthExpired = (e) => {
  authExpiredTitle.value = e?.detail?.title || 'Sesija istekla'
  authExpiredMessage.value = e?.detail?.message || 'Sesija istekla, molimo prijavite se ponovno.'
  showAuthExpiredModal.value = true
}

const handleAuthExpiredClose = async () => {
  showAuthExpiredModal.value = false
  auth.logout()
  if (router.currentRoute.value.path !== '/login') {
    await router.push('/login')
  }
}

onMounted(() => window.addEventListener('auth-expired', onAuthExpired))
onBeforeUnmount(() => window.removeEventListener('auth-expired', onAuthExpired))
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <main class="p-6">
      <router-view />

      <InfoModal
        :show="showAuthExpiredModal"
        title="Sesija istekla"
        :message="authExpiredMessage"
        @close="handleAuthExpiredClose"
      />
    </main>
  </div>
</template>
