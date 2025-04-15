<template>
  <el-popover
    v-model:visible="open"
    width="24rem"
    :show-arrow="false"
    placement="bottom-start"
    trigger="click"
    :teleported="false"
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
  >
    <template #reference>
      <div
        class="group/input relative flex flex-1 items-center justify-between pb-1 pr-6 font-light"
      >
        <div
          class="flex-1 cursor-pointer text-[#d9d9d9] hover:text-white"
          data-cy="4d6b4c9985cfdd26"
          @click.stop="handleClickSelect"
        >
          <div v-if="selectedItems.length" class="flex flex-wrap gap-2">
            <div
              v-for="item in selectedItems"
              :key="item"
              class="flex items-center gap-2 rounded-3xl bg-white/5 px-2 py-1"
            >
              <div>
                {{ getItem(item).label }}
              </div>
              <i :class="getItem(item).iconClass" />
              <i
                class="fa-regular fa-circle-xmark ml-2 transition-all hover:rotate-180 hover:scale-125"
                @click.stop="handleClickItem(item, true)"
              />
            </div>
          </div>
          <div v-else class="h-[1.625rem] text-[#707070] hover:text-white">
            {{ $t('category.transaction.selectFrequency') }}
          </div>
        </div>
        <BaseLine :active="open" />
      </div>
    </template>

    <div
      v-for="item in options"
      :key="item.value"
      v-loading="sidebarFilterLoading"
      element-loading-spinner="none"
      class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-white/5"
      @click="handleClickItem(item)"
    >
      <BaseCheckboxStyle
        :state="
          selectedItems.includes(item.value) ? 'correctChecked' : 'unchecked'
        "
      />
      <i :class="item.iconClass" />
      <div>{{ item.label }}</div>
    </div>
  </el-popover>
</template>

<script setup>
import { FILTER_KEYS } from '~/constant/payment';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
});
const emits = defineEmits(['change']);

const hubPaymentStore = useHubPaymentStore();

const open = ref(false);
const selectedItems = ref([]);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);
const options = [
  {
    value: 'day',
    label: 'Daily',
    iconClass: 'fa-solid fa-calendar-days',
  },
  {
    value: 'week',
    label: 'Weekly',
    iconClass: 'fa-solid fa-calendar-week',
  },
  {
    value: 'month',
    label: 'Monthly',
    iconClass: 'fa-solid fa-calendar',
  },
];

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams[FILTER_KEYS.FREQUENCIES]) {
      selectedItems.value = filterParams[FILTER_KEYS.FREQUENCIES];
    } else {
      selectedItems.value = [];
    }
  },
  { immediate: true },
);

function getItem(val) {
  return options.find((optItem) => optItem.value === val);
}

function handleClickSelect() {
  open.value = true;
}

function handleClickItem(statusItem, remove) {
  if (sidebarFilterLoading.value) {
    return;
  }

  let newSelectedItems;

  if (remove) {
    newSelectedItems = selectedItems.value.filter(
      (item) => item !== statusItem,
    );
  } else if (selectedItems.value.some((item) => item === statusItem.value)) {
    newSelectedItems = selectedItems.value.filter(
      (item) => item !== statusItem.value,
    );
  } else {
    newSelectedItems = [...selectedItems.value, statusItem.value];
  }

  selectedItems.value = newSelectedItems;
  emits('change', {
    [FILTER_KEYS.FREQUENCIES]: newSelectedItems,
  });
}
</script>
