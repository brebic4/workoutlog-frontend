<script setup>
import { ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'

const props = defineProps({
  workout: Object,
})

const emit = defineEmits(['delete'])

const showDeleteConfirm = ref(false)

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString()
}

const requestDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  showDeleteConfirm.value = false
  emit('delete', props.workout?.id)
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="border rounded-xl p-4 bg-white shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="font-bold">{{ workout.type }}</p>
        <p class="text-sm text-gray-600">
          {{ formatDate(workout.date) }} • {{ workout.durationMin }} min
        </p>
        <p v-if="workout.notes" class="text-sm mt-2 text-gray-700">
          {{ workout.notes }}
        </p>
      </div>

      <BaseButton variant="danger" @click="requestDelete">Delete</BaseButton>
    </div>
  </div>

  <ConfirmModal
    :show="showDeleteConfirm"
    title="Brisanje workouta"
    message="Jeste li sigurni da želite obrisati ovaj workout?"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
