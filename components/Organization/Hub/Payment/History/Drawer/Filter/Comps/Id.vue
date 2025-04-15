<template>
  <BaseInput
    v-model="value"
    :placeholder="props.placeholder"
    class="h-6"
    :show-validate-error="!validIdSuccess"
  />
  <div v-if="!validIdSuccess" class="pt-0.5 text-xs text-[#ED3C28]">
    Your text is not an ID
  </div>
  <div v-else class="pt-0.5 text-xs opacity-0">opccpy</div>
</template>

<script setup>
const props = defineProps({
  filterParams: {
    type: Object || null,
  },
  placeholder: {
    type: String,
    default: 'Search ID',
  },
  filterKey: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(['change']);
const value = ref('');
const validIdSuccess = computed(
  () => value.value === '' || value.value.match(/^[0-9a-fA-F]{24}$/),
);
const debouncedLoadData = debounce((params) => {
  emits('change', params);
}, 500);

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams[props.filterKey]) {
      value.value = filterParams[props.filterKey];
    } else {
      value.value = '';
    }
  },
  { immediate: true },
);

watch(
  () => value.value,
  (value) => {
    if (value && value.match(/^[0-9a-fA-F]{24}$/)) {
      debouncedLoadData({
        [props.filterKey]: value,
      });
    } else if (!value) {
      debouncedLoadData({
        [props.filterKey]: null,
      });
    }
  },
);
</script>
