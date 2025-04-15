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
        <div v-if="selectedStatus.length" class="flex flex-wrap gap-2">
          <div
            v-for="item in selectedStatus"
            :key="item"
            class="flex items-center gap-2"
          >
            <div class="flex items-center">
              <div
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <div class="ml-2.5 text-xs font-medium text-[#FAFAFA]">
                {{ item.label }}
              </div>
            </div>
            <i
              class="fa-regular fa-circle-xmark transition-all hover:rotate-180 hover:scale-125"
              @click.stop="handleClickItem(item, true)"
            />
          </div>
        </div>
        <div v-else class="flex h-5 items-center text-[#707070]">
          {{ $t('category.transaction.selectStatus') }}
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
    <div class="p-2">
      <div
        v-for="item in options"
        :key="item.value"
        class="flex h-8 items-center gap-2"
        @click="handleClickItem(item)"
      >
        <BaseCheckboxStyle
          class="mr-1.5"
          :state="
            selectedStatus.some((status) => status.value === item.value)
              ? 'correctChecked'
              : 'unchecked'
          "
        />
        <div class="flex items-center">
          <div
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: item.color }"
          />
          <div class="ml-2.5 text-xs font-medium text-[#FAFAFA]">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  filterParams: {
    type: Array || null,
  },
});
const emits = defineEmits(['change']);
const { t } = useI18n();
const open = ref(false);
const toggleRef = ref(null);
const statusPopup = ref(null);
const selectedStatus = ref([]);

const options = [
  {
    label: t('reviews.status.options.Answered'),
    value: 'answered-by-teacher',
    color: '#E0B92C',
  },
  {
    label: t('reviews.status.options.NotAnswered'),
    value: 'not-answered',
    color: '#B91C1C',
  },
];

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams?.length) {
      selectedStatus.value = filterParams;
    } else {
      selectedStatus.value = [];
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

function handleClickItem(statusItem, remove) {
  let newSelectedStatus;

  if (remove) {
    newSelectedStatus = selectedStatus.value.filter(
      (item) => item !== statusItem,
    );
  } else if (selectedStatus.value.some((item) => item === statusItem.value)) {
    newSelectedStatus = selectedStatus.value.filter(
      (item) => item !== statusItem.value,
    );
  } else {
    newSelectedStatus = [...selectedStatus.value, statusItem];
  }

  selectedStatus.value = newSelectedStatus;
  emits('change', newSelectedStatus);
}
</script>
