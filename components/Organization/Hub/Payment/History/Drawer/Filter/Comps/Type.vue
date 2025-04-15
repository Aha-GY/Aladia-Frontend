<template>
  <div class="flex items-center gap-4">
    <div
      ref="toggleRef"
      class="group/input relative flex flex-1 items-center justify-between pb-1 pr-6 font-light"
    >
      <div
        class="flex-1 cursor-pointer text-[#d9d9d9] hover:text-white"
        data-cy="4d6b4c9985cfdd26"
        @click="handleClickSelect"
      >
        <div v-if="selectedItem" class="flex items-center gap-2">
          <i :class="selectedItem.iconClass" />
          <div>
            {{ selectedItem.value }}
          </div>
        </div>
        <div v-else class="text-[#707070] hover:text-white">
          {{ $t('category.transaction.select') }}
        </div>
      </div>
      <BaseLine :active="open" />
    </div>
  </div>
  <el-popover
    ref="statusPopup"
    width="24rem"
    :visible="open"
    :virtual-ref="toggleRef"
    :show-arrow="false"
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
  >
    <div
      v-for="item in OPTIONS"
      :key="item"
      class="flex cursor-pointer items-center gap-2 p-2 hover:bg-white/5 hover:text-white"
      :class="{ 'bg-white/5': item.value === selectedItem?.value }"
      @click="handleClickItem(item)"
    >
      <i :class="item.iconClass" />
      <div>
        {{ item.value }}
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { QUERY_PARAMS, FILTER_KEYS } from '~/constant/payment';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
});
const emits = defineEmits(['change']);
const open = ref(false);
const toggleRef = ref(null);
const statusPopup = ref(null);
const selectedItem = ref(null);
const OPTIONS = Object.values(QUERY_PARAMS.PURPOSE).map((item, index) => {
  let iconClass = '';
  if (index === 0) {
    iconClass = 'fa solid fa-credit-card';
  } else if (index === 1) {
    iconClass = 'fa-solid fa-paper-plane';
  } else {
    iconClass = 'fa-solid fa-arrows-rotate';
  }
  return {
    value: item,
    iconClass,
  };
});

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams[FILTER_KEYS.TYPE]) {
      selectedItem.value = OPTIONS.find(
        (item) => item.value === filterParams[FILTER_KEYS.TYPE],
      );
    } else {
      selectedItem.value = null;
    }
  },
  { immediate: true },
);

onClickOutside(statusPopup, () => {
  open.value = false;
});

function handleClickSelect() {
  open.value = true;
}

function handleClickItem(statusItem) {
  selectedItem.value = statusItem;
  emits('change', {
    [FILTER_KEYS.TYPE]: statusItem.value,
  });
}
</script>
