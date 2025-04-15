<template>
  <div ref="toggleRef" data-cy="f2462a46c84e9c7f" @click="open = true">
    <div class="relative flex w-28">
      <span class="flex-shrink-0">
        <span v-if="dateModel" class="text-[#d9d9d9]">
          {{ formatDate(dateModel, 'DD MMM YYYY') }}
        </span>
        <span v-else class="text-[#707070] hover:text-white">DD MMM YYYY</span>
      </span>
      <BaseLine :active="open" />
    </div>
    <el-popover
      width="26rem"
      :visible="open"
      :virtual-ref="toggleRef"
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
      <div ref="datePopupRef">
        <BaseDatePicker
          v-model="dateModel"
          :disabled-dates="[{ start: afterToday() }]"
          @change="onChange"
        />
        <div class="flex p-1 pl-2">
          <BaseButton
            type="red-cancel"
            icon="fa-arrow-turn-left"
            label="$t:base.dialog.close"
            @click="open = false"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import dayJS from 'dayjs';

const props = defineProps({
  filterParams: {
    type: Object,
  },
  filterKey: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['change']);

const dayjs = dayJS.tz;

const dateModel = ref('');
const open = ref(false);
const toggleRef = ref(null);
const datePopupRef = ref(null);

onClickOutside(datePopupRef, () => {
  open.value = false;
});

watch(
  () => props.filterParams,
  (value) => {
    if (value && value[props.filterKey]) {
      dateModel.value = value[props.filterKey];
    } else {
      dateModel.value = '';
    }
  },
  { immediate: true },
);

function onChange(date) {
  emits('change', {
    [props.filterKey]: dayjs(date).toISOString(),
  });
}
</script>
