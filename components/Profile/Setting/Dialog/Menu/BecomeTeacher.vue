<template>
  <div class="h-full" :class="isLeftDrawer ? 'overflow-hidden' : ''">
    <div
      v-show="!stripeSectionOpen"
      class="hide-scrollbar h-full overflow-auto"
    >
      <PaymentServiceSubDialogUserInfo
        is-profile-menu
        @update="handleUpdateAccount"
        @toggle-stripe-section="handleToggleStripeSection(true)"
      />
      <PaymentServiceSubDialogSubInfo
        is-profile-menu
        @success="handleConfirm"
      />
    </div>

    <div
      class="top-0 h-full w-full transition-transform duration-300"
      :class="[
        animationClass,
        stripeSectionOpen ? 'left-0' : 'left-full',
        isLeftDrawer ? 'absolute' : 'static',
      ]"
    >
      <PaymentServiceSubDialogOnboardingSection
        v-if="stripeSectionOpen"
        is-profile-menu
        :is-left-drawer="isLeftDrawer"
        @back="handleToggleStripeSection(false)"
      />
    </div>
  </div>
</template>

<script setup>
import { paymentEvent } from '~/constant/eventBus';

defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});

const { $eventBus } = useNuxtApp();

const authStore = useAuthStore();

const stripeSectionOpen = ref(false);
const animationClass = ref('');

onMounted(() => {
  handleUpdateAccount();
});

async function handleUpdateAccount() {
  await authStore.getInfo();
}

async function handleConfirm() {
  $eventBus.emit(paymentEvent.SUB_SERVICE_SUCCESS);
  await sleep(100);
  handleUpdateAccount();
}

async function handleToggleStripeSection(isOpen) {
  animationClass.value = isOpen ? 'animate-slide-in' : 'animate-slide-out';
  if (isOpen) {
    stripeSectionOpen.value = true;
  } else {
    await sleep(300); // 等待动画完成
    stripeSectionOpen.value = false;
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slide-in-right 0.3s ease-out forwards;
}

.animate-slide-out {
  animation: slide-out-right 0.3s ease-out forwards;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
