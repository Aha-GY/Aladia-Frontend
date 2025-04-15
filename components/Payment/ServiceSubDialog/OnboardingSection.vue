<template>
  <!-- For profile/organization popup slide animation -->
  <div>
    <!-- header -->
    <div
      v-if="!isProfileMenu"
      class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
    >
      <div class="flex flex-row items-center">
        <BaseIconBack class="mr-3" @click="emits('back')" />

        <div class="text-xl text-white">{{ $t(title) }}</div>
      </div>
      <BaseIconClose @click="handleCloseDialog" />
    </div>

    <div v-else class="bg-[#0C0C0C] p-4 text-[#b0b0b0]">
      <div class="flex flex-row items-center gap-2">
        <BaseIconBack @click="emits('back')" />

        <div class="text-lg">{{ $t(title) }}</div>
      </div>
    </div>

    <div
      v-loading="initLoading"
      class="relative overflow-y-auto p-4"
      :class="{
        'max-h-[calc(100vh-110px)] pb-20': isProfileMenu && isLeftDrawer,
        '!h-[calc(100vh-110px)] xl:!h-[calc(885px-110px)]': !isProfileMenu,
      }"
    >
      <div id="onboarding-element" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  isProfileMenu: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['close', 'back']);

const paymentStore = usePaymentStore();
const authStore = useAuthStore();

const initLoading = ref(false);
const isOrg = computed(() => authStore.isOrg);
const title = computed(() =>
  isOrg.value ? 'payment.org.create' : 'payment.org.identify',
);

onMounted(() => {
  handleInit();
});

async function handleInit() {
  try {
    initLoading.value = true;
    const onboardingElement =
      await paymentStore.initStripeAccountElement('onboarding-element');

    onboardingElement.setCollectionOptions({
      fields: 'eventually_due',
      futureRequirements: 'include',
    });
    onboardingElement.setOnLoaderStart(() => {
      initLoading.value = false;
    });
    onboardingElement.setOnLoadError(() => {
      initLoading.value = false;
    });
    onboardingElement.setOnStepChange((stepChange) => {
      console.log(`----User entered step----: ${stepChange.step}`);
    });
    onboardingElement.setOnExit(() => {
      console.log('exit!!!');
      emits('back');
    });
  } catch (error) {
    console.error('Failed to init onboarding element', error);
  }
}

function handleCloseDialog() {
  emits('close', false);
}
</script>
