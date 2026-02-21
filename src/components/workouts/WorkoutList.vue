<script setup>
import WorkoutCard from './WorkoutCard.vue'

defineProps({
  workouts: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
  error: String,
})

const emit = defineEmits(['delete'])
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold">Moji workouti</h3>
    </div>

    <p v-if="loading" class="text-gray-600">Učitavanje...</p>
    <p v-else-if="error" class="text-red-600 font-bold text-sm">{{ error }}</p>
    <p v-else-if="!workouts.length" class="text-gray-600">Nema workouta još. Dodaj prvi. 💪</p>

    <div v-else class="space-y-3">
      <WorkoutCard
        v-for="w in workouts"
        :key="w.id"
        :workout="w"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
