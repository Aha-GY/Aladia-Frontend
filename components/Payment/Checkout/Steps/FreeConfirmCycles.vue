<template>
  <client-only>
    <el-dialog
      v-model="paymentStore.confirmCyclesDialog"
      :show-close="false"
      append-to-body
      :align-center="true"
      width="28rem"
      destroy-on-close
      @close="onClose"
    >
      <div
        class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
      >
        <div class="bg-[#0C0C0C] text-base text-[#B0B0B0]">
          <i class="fa-regular fa-calendar-days mr-2.5" />
          <span>
            {{ $t('payment.info') }}
          </span>
        </div>
        <div class="flex items-center justify-end">
          <PaymentCheckoutCompsSelectCycles
            :course="course"
            show-seat
            placement="bottom-end"
          />
          <BaseIconClose data-cy="d9c35ae8aa66fbe5" @click="onClose" />
        </div>
      </div>
      <div class="flex items-center justify-between bg-[#0C0C0C] p-4">
        <div class="text-base font-light text-[#B7B7B7]">
          {{
            $t('payment.total', {
              amount: moneyFormatWithQuantity(billing.totalPrice),
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

        <BaseButton data-cy="474b8e5d197dd6af" @click="onStart">
          Start Now
        </BaseButton>
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const billing = ref({});

const buyQuantity = computed(() => paymentStore.buyQuantity);
const course = computed(() => paymentStore.currentCourseObject);
const courseProductDetails = computed(() => paymentStore.courseProductDetails);
const cyclesId = computed(() => paymentStore.cyclesId);

const isOrg = computed(() => authStore.isOrg);
const maxQuantity = computed(() => {
  const { seatCount, purchases } = course.value;
  if (seatCount !== -1) {
    return seatCount - purchases;
  }
  return null;
});

watchEffect(() => {
  if (!paymentStore.subscribeDialog) {
    return;
  }
  if (cyclesId.value && courseProductDetails.value) {
    const targetCycleInfo =
      courseProductDetails.value.subscriptionInfo[cyclesId.value];
    if (targetCycleInfo) {
      billing.value = {
        ...handleBillingData(targetCycleInfo, 'cycle'),
        totalPrice: courseProductDetails.value.totalAmount,
      };
      return;
    }
  }

  if (course.value) {
    billing.value = handleBillingData(course.value.billing);
  }
});

function onClose() {
  paymentStore.setSubscribeDialog(false);
}
function onStart() {
  paymentStore.setSubscribeDialog(false);
  paymentStore.setCheckoutDialog(true);
}
function moneyFormatWithQuantity(value) {
  return `$${moneyFormat(value * (buyQuantity.value || 1))}`;
}
/**
 * @param {Object} billingDatas
 * @type cycle || course
 */
function handleBillingData(data, type) {
  if (type === 'cycle') {
    const { fee, lastInstallment, installments, frequency } = data;
    const datas = [
      {
        step: 1,
        amount: fee.amount,
        title: t('payment.subscription'),
        description: t('payment.content.now', {
          fee: moneyFormatWithQuantity(fee.amount),
        }),
        active: true,
      },
      ...installments.dates.map((item, index) => ({
        step: index + 2,
        amount: installments.amount,
        title: formatDate(item),
        description: t('payment.amount', {
          amount: moneyFormatWithQuantity(installments.amount),
        }),
      })),
      {
        step: installments.dates.length + 2,
        amount: lastInstallment.amount,
        title: formatDate(lastInstallment.date),
        description: t('payment.amount', {
          amount: moneyFormatWithQuantity(lastInstallment.amount),
        }),
      },
    ];
    return {
      frequency,
      subscriptionFee: fee.amount,
      installmentNumber: installments.dates.length + 1,
      installmentsAmount: installments.amount,
      datas,
    };
  }

  // use the course billing, which shouldn't, just in case no data to show
  const datas = [
    {
      step: 1,
      amount: data.subscriptionFee,
      title: t('payment.subscription'),
      description: t('payment.content.now', {
        fee: moneyFormatWithQuantity(data.subscriptionFee),
      }),
      active: true,
    },
    ...data.installments.map((item, index) => ({
      step: index + 2,
      amount: data.installmentsAmount,
      title: formatDate(item, 'MMM DD,YYYY'),
      description: t('payment.amount', {
        amount: moneyFormatWithQuantity(data.installmentsAmount),
      }),
    })),
  ];
  // last installment
  datas[datas.length - 1] = {
    ...datas[datas.length - 1],
    amount: data.lastInstallmentAmount,
    description: t('payment.amount', {
      amount: moneyFormatWithQuantity(data.lastInstallmentAmount),
    }),
  };

  return {
    ...data,
    datas,
  };
}
</script>
