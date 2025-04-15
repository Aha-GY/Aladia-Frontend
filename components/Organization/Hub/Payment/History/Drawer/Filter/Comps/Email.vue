<template>
  <BaseInput
    v-model="value"
    :placeholder="$t('category.transaction.labelId.email')"
    class="h-6"
    :show-validate-error="!validIdSuccess"
  />
  <div v-if="!validIdSuccess" class="pt-0.5 text-xs text-[#ED3C28]">
    Your text is not an email
  </div>
</template>

<script setup>
import { FILTER_KEYS } from '~/constant/payment';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
});
const emits = defineEmits(['change']);
const value = ref('');
const validIdSuccess = computed(
  () => value.value === '' || checkMail(value.value),
);
const debouncedLoadData = debounce((params) => {
  emits('change', params);
}, 500);

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams[FILTER_KEYS.EMAIL]) {
      value.value = filterParams[FILTER_KEYS.EMAIL];
    } else {
      value.value = '';
    }
  },
  { immediate: true },
);

watch(
  () => value.value,
  (value) => {
    if (value && checkMail(value)) {
      debouncedLoadData({
        [FILTER_KEYS.EMAIL]: value,
      });
    }
  },
);
</script>
