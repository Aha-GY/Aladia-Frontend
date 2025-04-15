<template>
  <div class="flex-1">
    <BaseNoData v-if="!listData?.length && !loading" class="pt-36" />
    <div v-else>
      <template v-for="item in listData" :key="item.id || index">
        <template v-if="item.type === 'hidden'">
          <BaseHidden
            :label="$t('post.reel.hidden.label')"
            :title="$t('post.reel.hidden.content')"
          />
        </template>

        <PostsItem
          v-else
          :item="item"
          class="mb-5 last:mb-0"
          @delete="onDelete"
          @hide="onDelete"
        />
      </template>
      <div v-show="loading">
        <PostsSkeleton v-for="n in 2" :key="n" class="mb-5 last:mb-0" />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  filter: {
    type: Object,
    default: () => ({}),
  },
  ownerId: {
    type: String,
    required: true,
  },
});
const socialStore = useSocialStore();
const loading = ref(false);
const listData = ref([]);
const cursorInfo = ref({ totalItems: 0 });
const getPostsList = async (params) => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const { data, cursor } = await socialStore.searchPosts({
      limit: 10,
      type: 'review',
      ownerId: props.ownerId,
      groupBy:
        props.filter.selectType === 'received' ? 'owned-course' : undefined,
      rating: props.filter?.rating,
      startDate: props.filter.date?.startDate,
      endDate: props.filter.date?.endDate,
      courseType: props.filter.courseType?.value,
      status:
        props.filter.status?.map((item) => item.value)?.join(',') || undefined,
      filterEntityIds: props.filter.courses?.map((item) => item.id),
      ...params,
    });
    cursorInfo.value = cursor;
    listData.value = [...listData.value, ...data];
  } finally {
    loading.value = false;
  }
};

const { y } = useScroll(window);
const windowHeight = ref(0);
const isBottom = computed(
  () => y.value + windowHeight.value >= document.documentElement.scrollHeight,
);
onMounted(() => {
  windowHeight.value = window.innerHeight;
});

watch(isBottom, (value) => {
  if (value && cursorInfo.value?.next && !loading.value) {
    getPostsList({
      next: cursorInfo.value.next,
    });
  }
});

watch(
  () => props.filter,
  () => {
    cursorInfo.value = { totalItems: 0 };
    listData.value = [];
    getPostsList();
  },
  { deep: true, immediate: true },
);
</script>
