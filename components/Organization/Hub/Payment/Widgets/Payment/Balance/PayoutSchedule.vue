<template>
  <el-radio-group v-model="scheduleType" class="px-4">
    <el-radio :value="TYPES.AUTO" class="w-full">
      <div class="flex items-center">
        <span>
          {{ $t('category.schedule.auto') }}
        </span>
        <span class="mx-1 w-24 flex-shrink-0">
          <el-select
            v-model="intervalModel"
            class="w-full"
            :disabled="scheduleType === TYPES.MANUAL"
          >
            <el-option
              v-for="interval in Object.values(INTERVAL)"
              :key="interval.value"
              :value="interval.value"
              :label="$t(interval.label)"
            />
          </el-select>
        </span>
        <span
          v-if="intervalModel === INTERVAL.WEEK.value"
          class="ml-1 w-24 flex-shrink-0"
        >
          {{ $t('category.schedule.on') }}
          <el-select
            v-model="weekModel"
            class="w-full"
            :disabled="scheduleType === TYPES.MANUAL"
          >
            <el-option
              v-for="weekday in WEEK_DAYS"
              :key="weekday.value"
              :value="weekday.value"
              :label="$t(weekday.label)"
            />
          </el-select>
        </span>
        <span
          v-if="intervalModel === INTERVAL.MONTH.value"
          class="ml-1 w-24 flex-shrink-0"
        >
          {{ $t('category.schedule.onThe') }}
          <el-select
            v-model="monthModel"
            class="w-full"
            :disabled="scheduleType === TYPES.MANUAL"
          >
            <el-option
              v-for="monthday in MONTH_DAYS"
              :key="monthday"
              :value="monthday"
              :label="renderMonthDay(monthday)"
            />
          </el-select>
        </span>
      </div>
    </el-radio>
    <el-radio :value="TYPES.MANUAL" class="mt-3">
      {{ $t('category.schedule.manual') }}
    </el-radio>
  </el-radio-group>

  <div class="flex items-center justify-end bg-[#0C0C0C] p-4">
    <BaseButton
      class="mr-5"
      label="$t:base.upload.cancel"
      type="tertiary"
      data-cy="8743e2808141fb43"
      @click="emits('close')"
    />
    <BaseButton
      :loading="loading"
      data-cy="a2334b125b8bb1fa"
      @click="handleClicUpdateSchedule"
    >
      {{ $t('org.schedule.confirm') }}
    </BaseButton>
  </div>
</template>

<script setup>
const emits = defineEmits(['close']);
const INTERVAL = {
  DAY: {
    label: 'index.interval.day',
    value: 'daily',
  },
  WEEK: {
    label: 'index.interval.week',
    value: 'weekly',
  },
  MONTH: {
    label: 'index.interval.month',
    value: 'monthly',
  },
};
const TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
};
const WEEK_DAYS = [
  { value: 'Sunday', label: 'index.week.full.sun' },
  { value: 'Monday', label: 'index.week.full.mon' },
  { value: 'Tuesday', label: 'index.week.full.tue' },
  { value: 'Wednesday', label: 'index.week.full.wed' },
  { value: 'Thursday', label: 'index.week.full.thu' },
  { value: 'Friday', label: 'index.week.full.fri' },
  { value: 'Saturday', label: 'index.week.full.sat' },
];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const hubPaymentStore = useHubPaymentStore();

const loading = ref(false);
const scheduleType = ref(TYPES.AUTO); // or 'auto'
const intervalModel = ref(INTERVAL.DAY.value);
const weekModel = ref(WEEK_DAYS[0]);
const monthModel = ref(MONTH_DAYS[0]);
const payoutSchedule = computed(() => hubPaymentStore.payoutSchedule);

watch(
  () => payoutSchedule.value,
  (val) => {
    if (!val) {
      return;
    }
    const { interval, weeklyAnchor, monthlyAnchor } = payoutSchedule.value;
    if (interval) {
      if (interval === TYPES.MANUAL) {
        scheduleType.value = TYPES.MANUAL;
      } else {
        intervalModel.value = interval;
      }
    }
    if (weeklyAnchor) {
      weekModel.value = weeklyAnchor;
    }
    if (monthlyAnchor) {
      monthModel.value = monthlyAnchor;
    }
  },
  { immediate: true },
);

function renderMonthDay(day) {
  if (day % 10 === 1) {
    return `${day}st`;
  }
  if (day % 10 === 2) {
    return `${day}nd`;
  }
  if (day % 10 === 3) {
    return `${day}rd`;
  }
  return `${day}th`;
}

async function handleClicUpdateSchedule() {
  if (loading.value) {
    return;
  }
  loading.value = true;

  let params;
  if (scheduleType.value === TYPES.MANUAL) {
    params = {
      interval: TYPES.MANUAL,
    };
  } else if (intervalModel.value === INTERVAL.DAY.value) {
    params = {
      interval: INTERVAL.DAY.value,
    };
  } else if (intervalModel.value === INTERVAL.WEEK.value) {
    params = {
      interval: INTERVAL.WEEK.value,
      weeklyAnchor: weekModel.value.toLowerCase(),
    };
  } else if (intervalModel.value === INTERVAL.MONTH.value) {
    params = {
      interval: INTERVAL.MONTH.value,
      monthlyAnchor: monthModel.value,
    };
  }
  await hubPaymentStore.updatePayoutSchedule(params);
  loading.value = false;
  emits('close');
}
</script>
