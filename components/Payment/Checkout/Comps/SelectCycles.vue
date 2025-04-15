<template>
  <div
    v-if="cyclesOptions.length <= 1"
    class="flex w-fit items-center gap-2 rounded border border-white/20 bg-black/50 px-1.5 py-0.5 text-13 text-white/70"
  >
    <i class="fa-light fa-calendar-days" />
    <div>
      {{ formatDate(cycle.startDate, 'DD MMM YY') }} -
      {{ formatDate(cycle.endDate, 'DD MMM YY') }}
    </div>
  </div>
  <el-popover
    v-else
    ref="cycleRef"
    trigger="click"
    :placement="placement"
    :offset="5"
    :width="0"
    :disabled="readOnly"
    @show="show = true"
    @hide="show = false"
  >
    <template #reference>
      <div
        class="flex items-center gap-2 rounded border border-white/20 bg-black/50 px-1.5 py-0.5 text-13 text-white/70"
        :class="
          readOnly ? 'cursor-not-allowed' : 'cursor-pointer hover:text-white'
        "
      >
        <i class="fa-light fa-calendar-days" />
        <div>
          {{ formatDate(cycle.startDate, 'DD MMM YY') }} -
          {{ formatDate(cycle.endDate, 'DD MMM YY') }}
        </div>
        <i
          v-if="cyclesOptions.length > 1"
          class="fa-light fa-chevron-down transition-all"
        />
      </div>
    </template>
    <div
      id="cycles-popover"
      class="flex max-h-72 flex-col overflow-y-auto p-1 text-13"
    >
      <div
        v-for="item in cyclesOptions"
        :key="item.id"
        class="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
        :class="item.cycleDisabled ? 'pointer-events-none opacity-50' : ''"
        @click="onClick(item)"
      >
        <div class="w-[10.8rem]">
          {{ formatDate(item.startDate, 'DD MMM YYYY') }} -
          {{ formatDate(item.endDate, 'DD MMM YYYY') }}
        </div>
        <div
          v-if="showSeat"
          class="flex flex-1 items-center justify-start gap-3"
        >
          <div class="size-1 rounded-full bg-white/50" />
          <i class="fa-solid fa-users-rays text-xs" />
          {{ item.purchases }} /
          {{ item.unlimited ? 'Unlimited' : item.seatCount }}
          Seats
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  showSeat: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['change']);

defineExpose({
  hide: () => cycleRef.value.hide(),
});

const paymentStore = usePaymentStore();

const show = ref(false);
const cycleRef = ref(null);
const cyclesOptions = computed(() => {
  const { cycles } = handleCourseAvailableAndCycles(props.course);
  return cycles;
});
const cycle = computed(() =>
  cyclesOptions.value.find((item) => item.id === paymentStore.cyclesId),
);

watch(
  () => props.course,
  (newVal) => {
    const { cycles } = handleCourseAvailableAndCycles(newVal);
    if (!paymentStore.cyclesId) {
      setDefaultCyclesId(cycles);
    }

    if (paymentStore.cyclesId) {
      const selectedCycle = cycles.find(
        (item) => item.id === paymentStore.cyclesId,
      );
      if (!selectedCycle) {
        setDefaultCyclesId(cycles);
      }
    }
  },
  { immediate: true },
);

function setDefaultCyclesId(cyclesData) {
  const availableCycles = cyclesData.filter((item) => !item.cycleDisabled);
  if (availableCycles.length) {
    paymentStore.cyclesId = availableCycles[0].id;
  } else {
    console.error('no available cycles');
  }
}
function onClick(item) {
  paymentStore.cyclesId = item.id;
  cycleRef.value.hide();
  emits('change', item);
}
</script>
