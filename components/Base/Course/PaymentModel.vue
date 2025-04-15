<template>
  <div class="flex h-full items-center gap-2 text-white">
    <div class="flex size-4 items-center justify-center">
      <i
        v-if="paymentModel === PAYMENT_MODEL.RECURRING"
        class="fa-solid fa-repeat"
      />
      <i
        v-if="paymentModel === PAYMENT_MODEL.ONE_TIME"
        class="fa-solid fa-badge-dollar"
      />
      <i
        v-if="paymentModel === PAYMENT_MODEL.FREE"
        class="fa-solid fa-receipt"
      />
    </div>
    {{
      paymentModel === PAYMENT_MODEL.RECURRING
        ? $t('payment.model.recurring')
        : ''
    }}
    {{
      paymentModel === PAYMENT_MODEL.ONE_TIME ? $t('payment.model.single') : ''
    }}
    {{ paymentModel === PAYMENT_MODEL.FREE ? $t('payment.model.free') : '' }}
  </div>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  props: {
    paymentModel: {
      type: String,
      default: '',
    },
  },
  setup() {
    return { PAYMENT_MODEL };
  },
};
</script>
