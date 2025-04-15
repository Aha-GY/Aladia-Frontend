<template>
  <client-only>
    <el-dialog
      v-model="paymentStore.oneTimePaidConfirmCyclesDialog"
      :show-close="false"
      append-to-body
      :align-center="true"
      width="28rem"
      destroy-on-close
      @close="onClose"
    >
      <!-- header -->
      <div
        class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
      >
        <div class="bg-[#0C0C0C] text-base text-[#B0B0B0]">
          <i class="fa-regular fa-calendar-days mr-2.5" />
          <span>{{ title }}</span>
        </div>
        <BaseIconClose data-cy="d9c35ae8aa66fbe5" @click="onClose" />
      </div>

      <!-- body -->
      <div class="flex items-center justify-between p-4">
        <div class="text-base font-medium">Selected cycle</div>
        <div class="w-48">
          <PaymentCheckoutCompsSelectCycles
            :course="course"
            show-seat
            placement="bottom-end"
          />
        </div>
      </div>

      <div class="flex items-center justify-between bg-[#0C0C0C] p-4">
        <div class="text-base font-light text-[#B7B7B7]">
          {{
            $t('payment.total', {
              amount: moneyFormatWithQuantity(course.billing.totalPrice),
            })
          }}
        </div>

        <div class="flex items-center justify-center text-xs">
          <span class="mr-1 text-white">{{ $t('payment.quantity') }}</span>
          <BaseInputNumber
            v-model="paymentStore.buyQuantity"
            :disabled="!isOrg"
            :max-value="maxQuantity"
          />
        </div>

        <BaseButton :loading="loading" @click="onStart">
          {{ loading ? 'Checking' : 'Continue' }}
        </BaseButton>
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup>
// import { useI18n } from 'vue-i18n';

// const { t } = useI18n();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const loading = ref(false);

const buyQuantity = computed(() => paymentStore.buyQuantity);
const course = computed(() => paymentStore.currentCourseObject);
const isOrg = computed(() => authStore.isOrg);
const title = computed(() =>
  // todo i18n
  isOrg.value
    ? 'Confirm Start date and quantity of the course'
    : 'Confirm Start date of the course',
);
const maxQuantity = computed(() => {
  const { seatCount, purchases } = course.value;
  if (seatCount !== -1) {
    return seatCount - purchases;
  }
  return null;
});

function onClose() {
  paymentStore.setOneTimePaidConfirmCyclesDialog(false);
}

async function onStart() {
  try {
    if (loading.value) {
      return;
    }
    loading.value = true;
    const data = await paymentStore.handleCheckoutSession();
    console.log('data', data);
    onClose();
    paymentStore.setCheckoutDialog(true);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function moneyFormatWithQuantity(value) {
  return `$${moneyFormat(value * (buyQuantity.value || 1))}`;
}
</script>
