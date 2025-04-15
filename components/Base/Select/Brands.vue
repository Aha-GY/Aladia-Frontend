<template>
  <div
    class="flex max-h-[25rem] flex-col gap-1 overflow-auto rounded-md p-1 text-xs text-[#555555]"
  >
    <div
      v-for="item in sourceData"
      :key="item.id"
      class="group w-full cursor-pointer font-medium text-[#E5E5E5]"
      :data-cy="`${item.name?.toLowerCase().split(' ').join('-')}-option`"
      @click="onClick(item)"
    >
      <div
        class="flex w-full items-center overflow-hidden rounded px-2 py-2 group-hover:bg-white/5"
        :class="
          brand.name === item.name && brand.domain === item.domain
            ? 'bg-white/5'
            : ''
        "
      >
        <div class="flex flex-1 items-center overflow-hidden pr-2">
          <img
            v-if="item.picture"
            :src="item.picture"
            class="h-6 w-6 rounded"
          />
          <div v-else class="flex h-6 w-6 items-center justify-center rounded">
            <i class="fa-solid fa-building-ngo" />
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="ml-3 text-xs font-medium">
              <span>{{ item.name || item.domain }}</span>
            </div>
            <div class="ml-3 text-11 text-[#6a6a6a]">{{ item.domain }}</div>
          </div>
        </div>
        <img
          v-if="item.aladiaOrganization"
          src="~/assets/logo/image7.png"
          class="h-6 w-6 rounded"
        />
      </div>
    </div>
    <BaseSkeleton v-show="loading" height="1.5rem" class="w-full" />
    <div
      v-if="!sourceData.length && !loading"
      class="w-full px-2 py-1 text-center"
    >
      {{ $t('base.search.noResult') }}
    </div>
  </div>
</template>

<script setup>
import { getBrands, getPureBrands } from '~/api/v2/profile';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  brand: {
    type: Object,
    default: () => ({}),
  },
  noOrg: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['select', 'initBrand']);

const debouncedLoadData = debounce(() => {
  sourceData.value = [];
  loadData();
}, 500);

const loading = ref(false);
const sourceData = ref([]);
const search = ref('');
watch(
  () => props.name,
  (val) => {
    search.value = val;
    if (val && (val === props.brand.name || val === props.brand.domain)) {
      return false;
    }
    debouncedLoadData();
  },
  { immediate: true },
);
const onClick = (item) => {
  emit('select', item);
};

const loadData = async () => {
  if (loading.value) {
    return false;
  }
  loading.value = true;

  let data;
  if (props.noOrg) {
    const searchRes = await getPureBrands({
      name: search.value,
    });
    data = searchRes.data.map((item) => ({
      ...item,
      picture: item?.icon,
    }));
  } else {
    const searchRes = await getBrands({
      name: search.value,
    });
    data = searchRes.data;
  }
  sourceData.value = data;
  loading.value = false;
  const item = sourceData.value.find(
    (item) =>
      (search.value === item.name || search.value === item.domain) &&
      props.brand.domain === item.domain,
  );

  if (!props.autoClose) {
    return;
  }

  if (!item) {
    emit('initBrand');
  } else {
    emit('select', item);
  }
};
</script>
