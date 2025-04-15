<template>
  <div class="w-full">
    <div class="flex h-12 w-full items-center justify-between rounded-5">
      <div class="flex h-full flex-1 items-center">
        <el-select
          v-model="selectType"
          placeholder="Select"
          style="width: 10rem"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div
          v-for="item in menuList"
          :key="item.value"
          class="ml-3 flex h-full cursor-pointer items-center justify-center border-b px-6 text-xs text-[#D9D9D9] transition-all duration-300"
          :class="{
            'border-[#D9D9D9]': item.key === menuType,
            'border-transparent': item.key !== menuType,
            'hover:border-[#D9D9D9]': item.key !== menuType,
          }"
          @click="handleMenuType(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="flex h-full items-center">
        <template v-if="props.fromType === 'qa' && selectType === 'posted'">
          <div
            class="mr-8 cursor-pointer rounded-5 border border-white/50 px-2 py-1 text-sm font-medium text-[#FAFAFA] hover:border-transparent hover:bg-white/10 hover:text-white/80"
            @click="onCreate"
          >
            <i class="fa-regular fa-comment-dots mr-2" />
            <span>{{ $t('course.question.ask') }}</span>
          </div>
        </template>
        <ProfileReviewsFilter
          :from-type="fromType"
          :menu-type="menuType"
          @change="handleFiter"
        />
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
    <PostsCreation type="question-only-tab" @send="handleCreated" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  fromType: {
    type: String,
    default: 'reviews',
  },
});
const emit = defineEmits(['change']);
const { t } = useI18n();

const socialStore = useSocialStore();
const typeOptions = computed(() => {
  const options = [
    {
      label: t('reviews.header.menu.Posted'),
      value: 'posted',
    },
    {
      label: t('reviews.header.menu.Received'),
      value: 'received',
    },
  ];
  if (props.fromType === 'qa') {
    options.push({
      label: t('reviews.header.menu.AnsweredByMe'),
      value: 'answered-by-me',
    });
  }
  return options;
});
const OrginMenuList = computed(() => {
  const data = [
    {
      label: t('reviews.header.menu.BoughtCourses'),
      value: ['posted', 'answered-by-me'],
      key: 'bought-courses',
    },
    {
      label: t('reviews.header.menu.CreatedCourses'),
      value: ['received'],
      key: 'created-courses',
    },
  ];
  if (props.fromType === 'qa') {
    data.unshift({
      label: t('reviews.header.menu.Feed'),
      value: ['posted', 'answered-by-me'],
      key: 'feed',
    });
  }
  return data;
});
const selectType = ref('posted');
const menuType = ref('');
const viewType = ref('list');
const viewTypeList = [
  { value: 'grid', icon: 'fa-grid-2' },
  { value: 'list', icon: 'fa-list' },
];
const filterParams = ref({
  courses: [],
  categorys: [],
  date: null,
  courseType: null,
  status: [],
});

const menuList = computed(() => {
  const data = OrginMenuList.value.filter((item) =>
    item.value.includes(selectType.value),
  );
  return data;
});
watch(
  () => menuList.value,
  () => {
    menuType.value = menuList.value[0]?.key;
  },
  { immediate: true, deep: true },
);

const handleViewType = (item) => {
  viewType.value = item;
};
const handleFiter = (params) => {
  filterParams.value = params;
};
const handleMenuType = (item) => {
  menuType.value = item.key;
};

const onCreate = () => {
  socialStore.answerReset();
  socialStore.creatorVisible = true;
};
const handleCreated = () => {
  emit('change', filterObject.value);
};

const filterObject = computed(() => ({
  selectType: selectType.value,
  viewType: viewType.value,
  menuType: menuType.value,
  ...filterParams.value,
}));

watch(
  () => [selectType.value, viewType.value, menuType.value, filterParams.value],
  () => {
    emit('change', filterObject.value);
  },
);
onMounted(() => {
  emit('change', filterObject.value);
});
</script>
