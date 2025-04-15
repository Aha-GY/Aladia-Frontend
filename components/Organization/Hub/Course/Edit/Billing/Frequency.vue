<template>
  <el-popover :visible="focus" :width="414" placement="bottom">
    <template #reference>
      <OrganizationHubCourseEditItem
        class="mb-5"
        :class="
          billing.paymentModel === PAYMENT_MODEL.ONE_TIME ||
          billing.paymentModel === PAYMENT_MODEL.FREE
            ? 'pointer-events-none opacity-50'
            : ''
        "
        :disabled="
          billing.paymentModel === PAYMENT_MODEL.ONE_TIME ||
          billing.paymentModel === PAYMENT_MODEL.FREE
        "
        :value="billing.frequency"
        :focus="focus"
        :title="$t('course.price.frequency')"
      >
        <div
          ref="frequencyRef"
          class="relative z-0 flex h-8 w-0 flex-1 cursor-pointer items-center justify-between"
          :class="focus || billing.frequency ? 'opacity-100' : 'opacity-0'"
          data-cy="course-billing-frequency"
          @click="focus = !focus"
        >
          <div class="flex h-full items-center gap-2 capitalize text-white">
            {{
              billing.frequency
                ? billing.frequency
                : $t('course.price.interval.select')
            }}
          </div>
          <i class="fa-light fa-angles-up-down text-white/50" />
        </div>
      </OrganizationHubCourseEditItem>
    </template>
    <div class="flex flex-col text-sm">
      <div
        class="cursor-pointer rounded p-1 pl-2 transition-all duration-300 hover:bg-white/10 hover:text-[#b0a43e]"
        data-cy="course-biling-frequency-month"
        @click="onFrequencyClick('month')"
      >
        {{ $t('course.price.timeline.month') }}
      </div>
      <div
        class="cursor-pointer rounded p-1 pl-2 transition-all duration-300 hover:bg-white/10 hover:text-[#b0a43e]"
        data-cy="course-biling-frequency-week"
        @click="onFrequencyClick('week')"
      >
        {{ $t('course.price.timeline.week') }}
      </div>
      <div
        class="cursor-pointer rounded p-1 pl-2 transition-all duration-300 hover:bg-white/10 hover:text-[#b0a43e]"
        data-cy="course-biling-frequency-day"
        @click="onFrequencyClick('day')"
      >
        {{ $t('course.price.timeline.day') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  setup() {
    const focus = ref(false);
    const frequencyRef = ref(null);
    const hubCourse = useHubCoursesStore();

    onClickOutside(
      frequencyRef,
      () => {
        focus.value = false;
      },
      {
        ignore: [frequencyRef],
      },
    );

    return { hubCourse, focus, frequencyRef, PAYMENT_MODEL };
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
    onFrequencyClick(frequency) {
      this.billing.frequency = frequency;
      this.$emit('billing');
      this.focus = false;
    },
  },
};
</script>
