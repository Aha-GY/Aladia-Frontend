<template>
  <div
    v-if="pending"
    class="ml-2 flex h-8 items-center gap-2 truncate rounded-full border border-dashed border-[#EAB308] px-3 text-base text-[#EAB308]"
  >
    <i class="fa-solid fa-spinner text-base" />
    {{ $t('payment.verification.pending') }}
  </div>
  <div
    v-if="completed"
    class="ml-2 flex h-8 items-center gap-2 truncate rounded-full border border-dashed border-[#35A823] px-3 text-base text-[#35A823]"
  >
    <i class="fa-regular fa-shield-check text-base" />
    {{ $t('payment.verification.done') }}
  </div>
  <div
    v-if="requirementsNeed"
    class="ml-2 flex h-8 items-center gap-2 truncate rounded-full border border-dashed border-[#EB4937] px-3 text-base text-[#EB4937] transition-all"
    :class="{
      'active:scale-95': isMe,
      'cursor-pointer': isMe,
    }"
    data-cy="30ae5e771dfb7be7"
    @click="createAccount"
  >
    <i v-if="loading" class="fa-solid fa-spinner animate-spin text-base" />
    <i v-else class="fa-solid fa-triangle-exclamation text-base" />
    {{ $t('payment.verification.requirement') }}
  </div>
</template>
<script setup>
import WebSocketService from '~/utils/websocket';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const isMe = computed(
  () => profileStore.myProfileDetail.id === props.detail.id,
);
const pending = computed(() => props.detail.stripeConnectOnboard === 'pending');
const completed = computed(
  () => props.detail.stripeConnectOnboard === 'completed',
);
const requirementsNeed = computed(
  () => props.detail.stripeConnectOnboard === 'requirement-needed',
);
const loading = ref(false);
const createAccount = () => {
  paymentStore.setServiceDialog(true);
};

const websocket = WebSocketService.getInstance();

onMounted(() => {
  websocket.on(
    'connect-account-status-updated',
    handleConnectAccountStatusUpdated,
  );
});
onUnmounted(() => {
  websocket.off(
    'connect-account-status-updated',
    handleConnectAccountStatusUpdated,
  );
});

const handleConnectAccountStatusUpdated = async (data) => {
  if (data.userId === profileStore.myProfileDetail.id) {
    if (authStore.isOrg) {
      await profileStore.getOrganizationDetail({
        organizationId: data.userId,
      });
    } else {
      await authStore.getInfo();
    }
  }
};
</script>
