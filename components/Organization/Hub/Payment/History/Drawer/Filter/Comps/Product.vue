<template>
  <div class="flex items-center gap-4">
    <div
      ref="toggleRef"
      class="group/input relative flex flex-1 items-center justify-between pb-1 pr-6 font-light"
    >
      <div
        class="flex-1 cursor-pointer hover:text-white"
        :class="[products.length === 0 ? 'text-[#707070]' : 'text-[#d9d9d9]']"
        data-cy="45b46987e79a91e4"
        @click="handleClickCourse"
      >
        {{
          products.length === 0
            ? $t('category.transaction.selectProducts')
            : $t('category.transaction.selectProductsCount', {
                count: products.length,
              })
        }}
      </div>
      <BaseCourseSearchPreview
        :open="open"
        :courses="products"
        :add="true"
        :remove="true"
        class="absolute -top-3 right-0"
        @open="handleClickAdd"
        @remove="onRemoveClick"
      />
      <BaseLine :active="open" />
    </div>
  </div>
  <el-popover
    width="26.5rem"
    :visible="open"
    :virtual-ref="toggleRef"
    placement="bottom-start"
    :show-arrow="false"
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
    <div ref="datePopupRef" v-loading="sidebarFilterLoading" class="h-96 pt-2">
      <BaseCourseSearch
        v-if="add"
        :actives="products"
        :is-own-courses="props.isOwnCourses"
        @close="open = false"
        @save="onSave"
      />
      <BaseCourseSearchList
        v-else
        :courses="products"
        @close="open = false"
        @add="add = true"
        @remove="onRemoveClick"
      />
    </div>
  </el-popover>
</template>

<script setup>
import { FILTER_KEYS } from '~/constant/payment.js';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
  isOwnCourses: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['change']);

const hubPaymentStore = useHubPaymentStore();

const open = ref(false);
const add = ref(true);
const toggleRef = ref(null);
const datePopupRef = ref(null);
const products = ref([]);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);

watch(
  () => props.filterParams,
  (value) => {
    if (value && value[FILTER_KEYS.COURSE]) {
      products.value = value[FILTER_KEYS.COURSE];
    } else {
      products.value = [];
    }
  },
  { immediate: true },
);

onClickOutside(
  datePopupRef,
  () => {
    open.value = false;
    add.value = false;
  },
  { ignore: ['.el-popper'] },
);

function handleClickAdd() {
  open.value = true;
  add.value = true;
}

function handleClickCourse() {
  open.value = true;
  add.value = false;
}

function onSave(courses) {
  const newCourses = [...courses];
  products.value = newCourses;
  open.value = false;
  add.value = false;
  emits('change', {
    [FILTER_KEYS.COURSE]: newCourses,
  });
}

function onRemoveClick(course) {
  const newCourses = products.value.filter((item) => item.id !== course.id);
  products.value = newCourses;
  emits('change', {
    [FILTER_KEYS.COURSE]: newCourses,
  });
}
</script>
