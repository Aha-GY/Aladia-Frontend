<template>
  <el-popover
    v-model:visible="open"
    width="26rem"
    trigger="click"
    :teleported="false"
    placement="bottom-start"
    :popper-options="{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }"
    @hide="handleHide"
  >
    <template #reference>
      <div
        v-if="hasDate"
        class="relative flex w-full cursor-pointer pb-0.5 text-[#d9d9d9]"
      >
        <span class="w-28 flex-shrink-0 hover:text-white">
          {{ formatDate(rangeModel.start, 'DD MMM YYYY') }}
        </span>
        <span class="mx-8 opacity-0">-</span>
        <span>
          <i class="fa-light fa-calendar mr-2" />
          <span class="text-center hover:text-white">
            {{ formatDate(rangeModel.end, 'DD MMM YYYY') }}
          </span>
        </span>
        <div>
          <BaseLine class="w-28" :active="open" />
          <BaseLine class="left-[12.5rem] w-28" :active="open" />
        </div>
      </div>
      <div
        v-else
        class="relative flex w-full cursor-pointer pb-0.5 text-[#707070]"
      >
        <span class="w-28 hover:text-white">DD MMM YYYY</span>
        <span class="mx-8 text-[#d9d9d9] opacity-0">-</span>
        <span>
          <i class="fa-light fa-calendar mr-2" />
          <span class="text-center hover:text-white">DD MMM YYYY</span>
        </span>
        <div>
          <BaseLine class="w-28" :active="open" />
          <BaseLine class="left-[12.5rem] w-28" :active="open" />
        </div>
      </div>
    </template>
    <div v-loading="sidebarFilterLoading">
      <BaseDatePicker
        v-model="rangeModel"
        mode="daterange"
        :disabled-dates="disabledFromToday ? [{ start: afterToday() }] : []"
        @change="onChange"
      />
      <div class="flex justify-between p-1 pl-2">
        <BaseButton
          type="red-cancel"
          icon="fa-arrow-turn-left"
          label="$t:base.dialog.close"
          @click="open = false"
        />

        <BaseButton
          type="secondary"
          icon="fa-trash"
          label="$t:base.upload.clear"
          @click="handleClear"
        />
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import dayJS from 'dayjs';

const props = defineProps({
  filterParams: {
    type: Object,
  },
  filterKeyStart: {
    type: String,
    required: true,
  },
  filterKeyEnd: {
    type: String,
    required: true,
  },
  disabledFromToday: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['change']);

const dayjs = dayJS.tz;
const hubPaymentStore = useHubPaymentStore();

const rangeModel = ref({
  start: '',
  end: '',
});
const open = ref(false);
const hasDate = computed(() => rangeModel.value.start && rangeModel.value.end);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);

watch(
  () => props.filterParams,
  (value) => {
    if (value && value[props.filterKeyStart]) {
      rangeModel.value = {
        start: value[props.filterKeyStart],
        end: value[props.filterKeyEnd],
      };
    } else {
      rangeModel.value = {
        start: '',
        end: '',
      };
    }
  },
  { immediate: true },
);

function handleHide() {
  // 没有正确的设置范围, 但是有filter的value 直接显示
  if (
    props.filterParams[props.filterKeyStart] &&
    props.filterParams[props.filterKeyEnd]
  ) {
    rangeModel.value = {
      start: props.filterParams[props.filterKeyStart],
      end: props.filterParams[props.filterKeyEnd],
    };
  }
}

function handleClear() {
  rangeModel.value = {
    start: '',
    end: '',
  };
  emits('change', {
    [props.filterKeyStart]: undefined,
    [props.filterKeyEnd]: undefined,
  });
}

function onChange(range) {
  if (!range.start || !range.end) {
    return;
  }
  emits('change', {
    [props.filterKeyStart]: dayjs(range.start).toISOString(),
    [props.filterKeyEnd]: dayjs(range.end).toISOString(),
  });
}
</script>
