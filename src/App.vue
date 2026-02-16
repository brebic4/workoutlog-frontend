<script setup>
import { onMounted, ref } from 'vue'
import { apiHealth } from './api/health'

const msg = ref('testing...')

onMounted(async () => {
  try {
    const { data } = await apiHealth()
    msg.value = JSON.stringify(data)
  } catch (e) {
    msg.value = e?.response?.data?.error?.message || e.message
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold">WorkoutLog frontend</h1>
    <pre class="mt-4">{{ msg }}</pre>
  </div>
</template>
