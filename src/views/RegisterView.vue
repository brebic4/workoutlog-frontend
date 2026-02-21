<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import InfoModal from '../components/ui/InfoModal.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const repeatPassword = ref('')

const formError = ref('')

const passwordInputRef = ref(null)
const repeatPasswordInputRef = ref(null)
const emailInputRef = ref(null)

const showSuccessModal = ref(false)
const successMessage = ref('')

const clearError = () => {
  formError.value = ''
}

const onEmailInput = (val) => {
  email.value = val
  if (formError.value) clearError()
}

const onPasswordInput = (val) => {
  password.value = val
  if (formError.value) clearError()
}

const onRepeatPasswordInput = (val) => {
  repeatPassword.value = val
  if (formError.value) clearError()
}

onMounted(async () => {
  await nextTick()
  emailInputRef.value?.focus()
})

const extractMessage = (e) => {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error?.message ||
    e?.response?.data?.error ||
    auth.error ||
    e?.message ||
    'Registracija nije uspjela.'
  )
}

const submit = async () => {
  clearError()

  if (!email.value || !password.value || !repeatPassword.value) {
    formError.value = 'Popuni sva polja.'
    return
  }

  if (password.value !== repeatPassword.value) {
    formError.value = 'Lozinke se ne podudaraju.'
    repeatPassword.value = ''
    await nextTick()
    repeatPasswordInputRef.value?.focus()
    return
  }

  try {
    // auth.register trenutno ne vraća data; ovdje zovemo direktno backend kroz store akciju
    // Najlakše: neka auth.register returna response (vidi ispod), ali možemo i ovdje:
    const res = await auth.register({
      email: email.value,
      password: password.value,
    })

    // res može biti undefined ako store ne vraća response -> zato ćemo ispod doraditi store
    const msg = res?.data?.message || 'Korisnik uspješno registriran. Molimo prijavite se.'

    successMessage.value = msg
    showSuccessModal.value = true
  } catch (e) {
    formError.value = extractMessage(e)
    password.value = ''
    repeatPassword.value = ''

    await nextTick()
    passwordInputRef.value?.focus()
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/login')
}
</script>

<template>
  <div class="flex justify-center mt-16">
    <BaseCard class="w-full max-w-md space-y-4">
      <h2 class="text-2xl font-bold text-center">Registracija</h2>

      <form class="space-y-4" @submit.prevent="submit">
        <BaseInput
          ref="emailInputRef"
          label="Email"
          type="email"
          :modelValue="email"
          @update:modelValue="onEmailInput"
        />

        <BaseInput
          ref="passwordInputRef"
          label="Lozinka"
          type="password"
          :modelValue="password"
          @update:modelValue="onPasswordInput"
        />

        <BaseInput
          ref="repeatPasswordInputRef"
          label="Ponovi lozinku"
          type="password"
          :modelValue="repeatPassword"
          @update:modelValue="onRepeatPasswordInput"
        />

        <Transition name="fade-slide">
          <p v-if="formError" class="text-sm font-bold text-red-600">
            {{ formError }}
          </p>
        </Transition>

        <BaseButton class="w-full" :loading="auth.loading" type="submit"> Registracija </BaseButton>
      </form>

      <p class="text-sm text-center text-gray-600">
        Već imaš račun?
        <router-link class="text-blue-600 hover:underline" to="/login"> Prijavi se </router-link>
      </p>
    </BaseCard>
  </div>

  <InfoModal
    :show="showSuccessModal"
    title="Uspješna registracija"
    :message="successMessage"
    @close="closeSuccessModal"
  />
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
