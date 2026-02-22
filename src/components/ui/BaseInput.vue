<script setup>
import { computed } from 'vue'
import { ref } from 'vue'

const inputRef = ref(null)

// omogućava parent komponenti da pristupi input elementu
defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  textarea: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(
  () =>
    `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
      props.error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
    }`,
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <textarea
      v-if="textarea"
      ref="inputRef"
      :value="modelValue"
      :class="inputClasses"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <input
      v-else
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :class="inputClasses"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
