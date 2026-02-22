<script setup>
import { onMounted, computed, ref } from 'vue'
import { useWorkoutsStore } from '../stores/workouts'

import WorkoutForm from '../components/workouts/WorkoutForm.vue'
import WorkoutList from '../components/workouts/WorkoutList.vue'
import WorkoutsToolbar from '../components/workouts/WorkoutsToolbar.vue'

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

const filters = ref({
  type: [],
  dateFrom: '',
  dateTo: '',
  minDur: '',
  maxDur: '',
  sort: 'newest',
})

const availableTypes = computed(() => {
  const set = new Set(ws.workouts.map((w) => w.type).filter(Boolean))
  return Array.from(set).sort()
})

const filteredWorkouts = computed(() => {
  const f = filters.value

  let list = [...ws.workouts]

  // type
  if (f.types?.length) {
    const set = new Set(f.types)
    list = list.filter((w) => set.has(w.type))
  }

  // date range
  const from = f.dateFrom ? new Date(f.dateFrom) : null
  const to = f.dateTo ? new Date(f.dateTo) : null

  if (from) list = list.filter((w) => new Date(w.date) >= from)
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    list = list.filter((w) => new Date(w.date) <= end)
  }

  // duration
  const minDur = f.minDur !== '' ? Number(f.minDur) : null
  const maxDur = f.maxDur !== '' ? Number(f.maxDur) : null

  if (minDur !== null) list = list.filter((w) => Number(w.durationMin) >= minDur)
  if (maxDur !== null) list = list.filter((w) => Number(w.durationMin) <= maxDur)

  // sort
  list.sort((a, b) => new Date(a.date) - new Date(b.date))
  if (f.sort === 'newest') list.reverse()

  return list
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <WorkoutForm :onSubmit="onCreate" />
    </div>

    <div class="lg:col-span-2">
      <WorkoutsToolbar v-model="filters" :availableTypes="availableTypes" class="mb-4" />
      <WorkoutList
        :workouts="filteredWorkouts"
        :loading="ws.loading"
        :error="ws.error"
        :highlightId="ws.highlightId"
        @delete="onDelete"
        @update="onUpdate"
      />
    </div>
  </div>
</template>
