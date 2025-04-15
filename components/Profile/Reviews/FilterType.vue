<template>
  <div class="flex items-center gap-4">
    <div
      ref="toggleRef"
      class="group/input relative flex flex-1 items-center justify-between pb-1 pr-6 font-light"
    >
      <div
        class="flex-1 cursor-pointer text-[#d9d9d9]"
        @click="handleClickSelect"
      >
        <div v-if="selectedItem" class="flex items-center gap-2">
          <i :class="selectedItem.iconClass" />
          <div>
            {{ selectedItem.label }}
          </div>
        </div>
        <div v-else class="text-[#707070]">
          {{ $t('reviews.type.placeholder') }}
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
      class="flex cursor-pointer flex-col p-2 hover:bg-white/5"
      :class="{ 'bg-white/5': item.value === selectedItem?.value }"
      @click="handleClickItem(item)"
    >
      <div class="flex items-center gap-2 hover:text-white">
        <i :class="item.iconClass" />
        <div>
          {{ item.label }}
        </div>
      </div>
      <div class="mt-2 text-xs text-[#707070]">{{ item.desc }}</div>
    </div>
  </el-popover>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
});
const emits = defineEmits(['change']);
const { t } = useI18n();
const open = ref(false);
const toggleRef = ref(null);
const statusPopup = ref(null);
const selectedItem = ref(null);
const OPTIONS = [
  {
    label: t('reviews.type.options.OnDemand'),
    value: 'on-demand',
    iconClass: 'fa-light fa-circle-play',
    desc: t('reviews.type.options.OnDemandDesc'),
  },
  {
    label: t('reviews.type.options.Live'),
    value: 'live',
    iconClass: 'fa-solid fa-circle text-[#ED3C28]',
    desc: t('reviews.type.options.LiveDesc'),
  },
];

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams.value) {
      selectedItem.value = OPTIONS.find(
        (item) => item.value === filterParams.value,
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
  emits('change', selectedItem.value);
}
</script>
