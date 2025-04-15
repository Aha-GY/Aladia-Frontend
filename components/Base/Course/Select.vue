<template>
  <div
    ref="toggleRef"
    class="group relative flex flex-1 items-center justify-between pb-1 font-light"
  >
    <div
      v-if="!open"
      class="flex-1 cursor-pointer"
      :class="[selecteds.length === 0 ? 'text-[#707070]' : 'text-[#d9d9d9]']"
      @click="handleShowPopup"
    >
      {{
        selecteds.length === 0
          ? $t('category.transaction.selectProducts')
          : $t('category.transaction.selectProductsCount', {
              count: selecteds.length,
            })
      }}
    </div>
    <BaseInput
      v-else
      v-model="search"
      class="search-input mr-2 h-[1.4rem]"
      auto-focus
      open
      search
      clear
      :showline="false"
    />
    <div v-if="selecteds.length" class="mr-1.5 flex items-center">
      <div
        v-for="(item, index) in selecteds.slice(0, 4)"
        :key="index"
        class="-ml-2"
        :style="{
          'z-index': index + 1,
        }"
      >
        <BaseCourseThumbnail class="h-[1.75rem]" :url="item.thumbnail?.url" />
      </div>
      <div v-if="selecteds.length - 4 > 0" class="ml-1">
        +{{ selecteds.length - 4 }}
      </div>
    </div>
    <div
      class="add-icon mb-1 flex h-[1.4rem] w-[1.4rem] shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed border-[#707070]"
      @click="handleShowPopup"
    >
      <i
        class="fa-solid fa-rectangle-history-circle-plus text-xs text-[#707070]"
      />
    </div>
    <BaseLine :active="open" />
  </div>
  <el-popover
    width="23.6rem"
    :visible="open"
    :virtual-ref="toggleRef"
    placement="bottom-start"
    :show-arrow="false"
  >
    <div
      ref="contentPopupRef"
      class="flex h-[35rem] flex-col justify-between overflow-hidden pt-2"
    >
      <BaseCourseSelected :selecteds="selecteds" @remove="onRemove" />
      <div
        v-infinite-scroll="getData"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar flex-1 overflow-y-auto px-2 pb-2"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="flex cursor-pointer items-center py-2"
          @click="handleSelect(item)"
        >
          <BaseCourseThumbnail class="h-[1.75rem]" :url="item.thumbnail?.url" />
          <div
            class="ml-3.5 line-clamp-1 text-sm text-[#F1F1F1]"
            :class="{
              'opacity-60': selecteds.find(
                (selected) => selected.id === item.id,
              ),
            }"
            v-html="highlightKeywords(item.title, [search])"
          />
        </div>
        <BaseSkeleton v-if="loading" :length="20" height="2.5rem" />
        <div v-if="!loading && list.length === 0" class="mt-[6rem]">
          <BaseNoData />
        </div>
      </div>
      <div
        class="flex shrink-0 items-center justify-between bg-white/5 px-4 py-2"
      >
        <BaseButton
          icon="fa-arrow-turn-left"
          label="$t:base.dialog.close"
          type="red-cancel"
          @click="onClose"
        />
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 text-sm font-light text-white/50 transition-all duration-300 hover:text-white active:scale-95"
          @click="onSave"
        >
          <i class="fa-light fa-plus text-sm" />
          {{ $t('post.iam.members.insert') }}
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
import { searchCourses } from '~/api/v2/course';

const props = defineProps({
  filterParams: {
    type: Array || null,
  },
});

const emit = defineEmits(['change']);

const open = ref(false);
const loading = ref(false);
const next = ref(null);
const toggleRef = ref(null);
const contentPopupRef = ref(null);
const list = ref([]);
const selecteds = ref([]);
const search = ref('');

watch(
  () => props.filterParams,
  (filterParams) => {
    selecteds.value = filterParams || [];
  },
  { immediate: true },
);

const handleShowPopup = () => {
  if (open.value) {
    return false;
  }
  open.value = true;
  getData();
};
const onClose = () => {
  open.value = false;
  search.value = '';
  list.value = [];
  next.value = null;
  emit('change', selecteds.value);
};
const onSave = () => {
  onClose();
  emit('change', selecteds.value);
};
const onRemove = (item) => {
  selecteds.value = selecteds.value.filter(
    (selected) => selected.id !== item.id,
  );
  emit('change', selecteds.value);
};

const getData = async () => {
  try {
    loading.value = true;
    const { data, cursor } = await searchCourses({
      title: search.value,
      next: next.value,
      limit: 20,
    });
    list.value = [...list.value, ...data];
    next.value = cursor.next;
  } finally {
    loading.value = false;
  }
};

const handleSelect = (item) => {
  if (selecteds.value.find((selected) => selected.id === item.id)) {
    selecteds.value = selecteds.value.filter(
      (selected) => selected.id !== item.id,
    );
  } else {
    selecteds.value = [...selecteds.value, item];
  }
};

onClickOutside(
  contentPopupRef,
  () => {
    onClose();
  },
  { ignore: ['.el-popper', '.search-input', '.add-icon'] },
);

const debouncedLoadData = debounce(() => {
  list.value = [];
  next.value = null;
  getData();
}, 500);

watch(
  () => search.value,
  () => {
    debouncedLoadData();
  },
  {},
);
</script>
