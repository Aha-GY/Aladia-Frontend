<template>
  <client-only>
    <el-dialog
      v-model="paymentStore.subscribeDialog"
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
          <i class="fa-regular fa-square-info mr-2.5" />
          <span>{{ $t('payment.info') }}</span>
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
      <div v-loading="courseProductLoading" class="px-4 py-4">
        <div class="mb-1 text-base font-medium text-white">
          <span class="text-[#B0B0B0]">
            {{ buyQuantity }}
            <i class="fa-solid fa-xmark mr-1 text-xs" />
          </span>
          {{ $t('course.price.fee') }}
          <span class="underline">
            {{ moneyFormatWithQuantity(billing.subscriptionFee) }}
          </span>
        </div>
        <div class="mb-5 text-13 font-light text-white/60">
          {{
            $t('payment.content.initial', {
              fee: moneyFormatWithQuantity(billing.subscriptionFee),
              frequency: getFrequencyI18nText(billing.frequency)[1],
            })
          }}
        </div>
        <div class="mb-1 text-base font-medium text-white">
          <span class="text-[#B0B0B0]">
            {{ buyQuantity }}
            <i class="fa-solid fa-xmark mr-1 text-xs" />
          </span>
          <span class="text-[#B0B0B0]">
            {{ billing.installmentNumber }}
            <i class="fa-solid fa-xmark mr-1 text-xs" />
          </span>
          <span class="capitalize">
            {{ getFrequencyI18nText(billing.frequency)[0] }}
          </span>
          {{ $t('payment.installment') }}
          <span class="underline">
            {{ moneyFormatWithQuantity(billing.installmentsAmount) }}
          </span>
        </div>
        <div class="mb-5 text-13 font-light text-white/60">
          {{
            $t('payment.content.end', {
              fee: moneyFormatWithQuantity(billing.installmentsAmount),
              frequency: getFrequencyI18nText(billing.frequency)[0],
            })
          }}
        </div>
        <div class="mb-5 text-base font-medium text-white">
          {{ $t('payment.timeline') }}
        </div>
        <div class="h-96 overflow-y-auto text-13 font-light">
          <div v-for="item in billing.datas" :key="item.step" class="mb-5 pl-5">
            <div class="flex items-center gap-4 text-white/50">
              <div class="relative flex items-center justify-center">
                <BaseProgress
                  :diameter="30"
                  :stroke-width="5"
                  :inner-stroke-width="5"
                  :animate-speed="100"
                  :completed-steps="item.step"
                  :total-steps="billing.datas.length"
                  :start-color="item.active ? '#dabb4b' : '#767675'"
                  :stop-color="item.active ? '#dabb4b' : '#767675'"
                  inner-stroke-color="#393939"
                  class="relative z-20"
                  :uni-key="`${item.step}`"
                />
                <div
                  class="absolute z-10 flex size-4 items-center justify-center rounded-full bg-[#555555] text-10"
                >
                  {{ item.step }}
                </div>
                <div
                  v-if="item.step !== billing.datas.length"
                  class="absolute top-5 z-0 h-12 w-[1px] border-l"
                  :class="[
                    item.active
                      ? 'border-[#dabb4b]'
                      : 'border-dashed border-white',
                  ]"
                />
              </div>
              <div :class="{ 'text-base text-white': item.active }">
                <div>{{ item.title }}</div>
                <div>{{ item.description }}</div>
              </div>
            </div>
          </div>
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

        <BaseButton
          data-cy="474b8e5d197dd6af"
          :loading="loading"
          @click="onSubscribe"
        >
          {{ loading ? 'Checking' : $t('org.subscribe.label') }}
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
const loading = ref(false);
const buyQuantity = computed(() => paymentStore.buyQuantity);
const course = computed(() => paymentStore.currentCourseObject);
const courseProductLoading = computed(() => paymentStore.courseProductLoading);
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

function getFrequencyI18nText(frequency) {
  switch (frequency) {
    case 'day':
      return [
        t('index.interval.name.daily'),
        t('index.interval.name.day', { count: 1 }),
      ];
    case 'week':
      return [
        t('index.interval.name.weekly'),
        t('index.interval.name.days', { count: 7 }),
      ];
    case 'month':
      return [
        t('index.interval.name.monthly'),
        t('index.interval.name.days', { count: 30 }),
      ];
    default:
      return [
        t('index.interval.name.invalid'),
        t('index.interval.name.invalid'),
      ];
  }
}
function onClose() {
  paymentStore.setSubscribeDialog(false);
}

async function onSubscribe() {
  try {
    if (loading.value) {
      return;
    }
    loading.value = true;
    const data = await paymentStore.handleCheckoutSession();
    console.log('data', data);
    paymentStore.setSubscribeDialog(false);
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
