<template>
  <client-only>
    <!-- for onboarding -->
    <el-dialog
      :model-value="paymentStore.serviceSubscriptionDialog"
      :need-padding="false"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      append-to-body
      :show-close="false"
      class="!w-[90%] border-[1px] border-white/10 md:!w-[32rem]"
      @close="handleClose"
      @closed="resetDialog"
    >
      <div
        class="relative h-[calc(100vh-50px)] overflow-x-hidden xl:h-[calc(885px-50px)]"
      >
        <Transition
          :name="direction"
          mode="out-in"
          class="absolute left-0 top-0 z-[201] h-full w-full"
        >
          <PaymentServiceSubDialogOnboardingSection
            v-if="stripeSectionOpen"
            @back="handleToggleStripeSection(false)"
            @close="handleClose"
          />
        </Transition>

        <div v-show="!stripeSectionOpen">
          <div
            class="flex flex-row items-center justify-between rounded-t-lg bg-[#0C0C0C] px-2 py-4"
          >
            <div class="flex flex-row items-center text-xl text-white">
              <div class="w-12 flex-shrink-0 px-3 text-center">
                <i
                  class="fa-regular !font-normal"
                  :class="isOrg ? 'fa-building-circle-check' : 'fa-user-check'"
                />
              </div>
              <div>
                {{ $t(title) }}
              </div>
            </div>
            <BaseIconClose data-cy="0c449f8d98d3e9e7" @click="handleClose" />
          </div>

          <div
            class="h-[calc(100vh-110px)] overflow-y-auto xl:h-[calc(885px-110px)]"
          >
            <!-- User part info-->
            <PaymentServiceSubDialogUserInfo
              v-if="!isOrg"
              @update="handleUpdateAccount"
              @toggle-stripe-section="handleToggleStripeSection(true)"
            />
            <!-- Org part info-->
            <PaymentServiceSubDialogOrgInfo
              v-else
              @update="handleUpdateAccount"
              @sync-name="handleSyncOrgName"
              @toggle-stripe-section="handleToggleStripeSection(true)"
            />
            <!-- SubInfo part -->
            <PaymentServiceSubDialogSubInfo @success="handleConfirm" />
          </div>
        </div>
      </div>

      <ProfileSettingDialogOrgMenuDeleteConfirm
        v-model="deleteConfirmOpen"
        :confirm-name="orgEditingName"
        @cancel="handleDeleteCancel"
      />
    </el-dialog>
  </client-only>
</template>
<script setup>
import { paymentEvent } from '~/constant/eventBus';

const { $eventBus } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const profileStore = useProfileStore();
const paymentStore = usePaymentStore();

const orgEditingName = ref('');
const deleteConfirmOpen = ref(false);
const stripeSectionOpen = ref(false);
const direction = ref('slide-fade-left');

const isOrg = computed(() => authStore.isOrg);
const title = computed(() =>
  isOrg.value ? 'payment.org.create' : 'payment.org.identify',
);
const isNewOrg = computed(() => route.query.new);

async function handleToggleStripeSection(val) {
  direction.value = val ? 'slide-fade-left' : 'slide-fade-right';
  await sleep(50);
  stripeSectionOpen.value = val;
}

const handleSyncOrgName = (name) => {
  orgEditingName.value = name;
};

const handleClose = () => {
  if (isOrg.value && !authStore.finishedOrgSignup) {
    if (isNewOrg.value) {
      deleteConfirmOpen.value = true;
      return;
    }
  }
  paymentStore.setServiceDialog(false);
};

const resetDialog = () => {
  console.log('resetDialog');
  deleteConfirmOpen.value = false;
  stripeSectionOpen.value = false;
  direction.value = 'slide-fade-left';
  orgEditingName.value = '';
};

const handleConfirm = async () => {
  $eventBus.emit(paymentEvent.SUB_SERVICE_SUCCESS);
  await sleep(100);
  paymentStore.setServiceDialog(false);
};

async function handleUpdateAccount() {
  if (isOrg.value) {
    await profileStore.getOrganizationDetail({
      organizationId: profileStore.myOrgProfileDetail.id,
    });
  } else {
    await authStore.getInfo();
  }
}

function handleDeleteCancel() {
  const { query } = route;
  const newQuery = { ...query };
  delete newQuery.new;

  router.replace({ path: route.path, query: newQuery });
  paymentStore.setServiceDialog(false);
}
</script>
<!-- <style scoped>
.slide-fade-left-enter-active,
.slide-fade-left-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style> -->
