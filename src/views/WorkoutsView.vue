<script setup>
import { onMounted } from 'vue'
import { useWorkoutsStore } from '../stores/workouts'

import WorkoutForm from '../components/workouts/WorkoutForm.vue'
import WorkoutList from '../components/workouts/WorkoutList.vue'

const ws = useWorkoutsStore()

onMounted(() => {
  ws.fetchWorkouts()
})

const onCreate = async (payload) => {
  try {
    await ws.createWorkout(payload)
    return true
  } catch {
    return false
  }
}

const onDelete = async (id) => {
  try {
    await ws.deleteWorkout(id)
  } catch {}
}

const onUpdate = async ({ id, payload }) => {
  try {
    await ws.updateWorkout(id, payload)
  } catch {}
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <WorkoutForm :onSubmit="onCreate" />
    </div>

    <div class="lg:col-span-2">
      <WorkoutList
        :workouts="ws.workouts"
        :loading="ws.loading"
        :error="ws.error"
        :highlightId="ws.highlightId"
        @delete="onDelete"
        @update="onUpdate"
      />
    </div>
  </div>
</template>
