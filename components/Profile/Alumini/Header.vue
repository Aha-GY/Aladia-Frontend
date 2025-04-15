<template>
  <div class="w-full">
    <div class="flex h-12 w-full items-center justify-between rounded-5">
      <div class="flex h-full items-center">
        <slot name="left" />
      </div>
      <div class="flex h-full items-center">
        <div class="w-[18rem]">
          <BaseInput v-model="search" placeholder="Search" class="h-8 w-full" />
        </div>
        <div class="ml-8 flex items-center gap-2">
          <div
            v-for="item in viewTypeList"
            :key="item.value"
            class="flex size-7 cursor-pointer items-center justify-center rounded"
            :class="{
              'bg-white/10': viewType === item.value,
            }"
            @click="handleViewType(item.value)"
          >
            <i :class="`fa-solid ${item.icon}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// import { useI18n } from 'vue-i18n';

defineProps({
  fromType: {
    type: String,
    default: 'reviews',
  },
});
const emit = defineEmits(['change']);
// const { t } = useI18n();

const search = ref('');

const viewType = ref('list');
const viewTypeList = [
  { value: 'grid', icon: 'fa-grid-2' },
  { value: 'list', icon: 'fa-list' },
];

const handleViewType = (item) => {
  viewType.value = item;
};
const filterObject = computed(() => ({
  search: search.value,
  viewType: viewType.value,
}));

const debouncedSearch = debounce(() => {
  emit('change', filterObject.value);
}, 500);

watch(
  () => search.value,
  () => {
    debouncedSearch();
  },
);

watch(
  () => [viewType.value],
  () => {
    emit('change', filterObject.value);
  },
);
onMounted(() => {
  emit('change', filterObject.value);
});
</script>
