<template>
  <div class="min-h-screen">
    <Navbar />
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
