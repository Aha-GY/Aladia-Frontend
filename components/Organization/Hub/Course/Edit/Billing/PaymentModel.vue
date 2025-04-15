<template>
  <el-popover :visible="focus" :width="414" placement="bottom">
    <template #reference>
      <OrganizationHubCourseEditItem
        class="mb-5"
        :value="billing.paymentModel"
        :focus="focus"
        :title="$t('course.payment.model')"
      >
        <div
          ref="paymentModelRef"
          class="relative z-0 h-8 w-0 flex-1 cursor-pointer"
          :class="focus || billing.paymentModel ? 'opacity-100' : 'opacity-0'"
          data-cy="payment-model"
          @click="focus = !focus"
        >
          <BaseCoursePaymentModel
            v-if="billing.paymentModel"
            :payment-model="billing.paymentModel"
          />
          <div v-else class="flex h-full items-center text-white/50">
            {{ $t('course.payment.select') }}
          </div>
        </div>
      </OrganizationHubCourseEditItem>
    </template>
    <div class="flex flex-col gap-1 text-sm">
      <div
        class="cursor-pointer rounded p-1.5 hover:bg-white/5"
        data-cy="481a0572ae6f30fa"
        @click="onModelClick(PAYMENT_MODEL.FREE)"
      >
        <BaseCoursePaymentModel :payment-model="PAYMENT_MODEL.FREE" />
        <div class="break-normal text-left text-xs text-[#505050]">
          {{ $t('course.price.student.description') }}
        </div>
      </div>
      <div
        class="cursor-pointer rounded p-1.5 hover:bg-white/5"
        data-cy="single-payment-option"
        @click="onModelClick(PAYMENT_MODEL.ONE_TIME)"
      >
        <BaseCoursePaymentModel :payment-model="PAYMENT_MODEL.ONE_TIME" />
        <div class="break-normal text-left text-xs text-[#505050]">
          {{ $t('course.price.content') }}
        </div>
      </div>
      <div
        class="cursor-pointer rounded p-1.5 hover:bg-white/5"
        :class="
          course.type === 'on-demand' ? 'pointer-events-none opacity-50' : ''
        "
        data-cy="reccuring-payment-option"
        @click="onModelClick(PAYMENT_MODEL.RECURRING)"
      >
        <BaseCoursePaymentModel :payment-model="PAYMENT_MODEL.RECURRING" />
        <div class="break-normal text-left text-xs text-[#505050]">
          {{ $t('course.price.description') }}
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  setup() {
    const focus = ref(false);
    const paymentModelRef = ref(null);
    const hubCourse = useHubCoursesStore();

    onClickOutside(
      paymentModelRef,
      () => {
        focus.value = false;
      },
      {
        ignore: [paymentModelRef],
      },
    );

    return { hubCourse, focus, paymentModelRef, PAYMENT_MODEL };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    billing() {
      return this.course.billing || {};
    },
  },
  methods: {
    onModelClick(model) {
      this.billing.paymentModel = model;
      this.focus = false;
    },
  },
};
</script>
