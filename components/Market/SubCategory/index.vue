<template>
  <div ref="containerRef" class="relative min-h-screen pb-36">
    <div class="px-6" :class="{ 'mb-6': courses.length }">
      <div
        v-if="subCategory"
        class="mb-4 flex items-center justify-between px-2 text-xl"
      >
        <MarketTitle
          :image="subCategory?.image?.url"
          :title="subCategory?.name"
        />
        <SearchFilter data-cy="bb78628176d23219" @click="filter = !filter" />
      </div>
      <div v-if="courses.length && !loading" class="flex flex-wrap">
        <MarketCardCourse
          v-for="course in courses"
          :key="course.id"
          :course="course"
        />
      </div>
      <div v-else-if="!loading" class="flex overflow-hidden">
        <MarketCardCourseFake v-for="i in 5" :key="i" :index="i" />
      </div>
    </div>
    <MarketRowSkeleton v-if="loading" :disabled-title="!!subCategory" />
    <MarketSearchFilter
      :open="filter"
      @apply="onApply"
      @close="filter = false"
    />
  </div>
</template>

<script setup>
const courseStore = useCourseStore();
const marketStore = useMarketStore();

const next = useState('next', () => null);
const isEnd = useState('isEnd', () => false);
const loading = useState('loading', () => false);
const courses = useState('courses', () => []);
const subCategory = useState('subCategory', () => null);
const containerRef = useState('containerRef', () => null);

const route = useRoute();
const router = useRouter();
const filter = ref(false);
const query = computed(() => route.query);
const subCategoryId = computed(() => route.query.subCategoryId);

async function searchCourses() {
  if (subCategoryId.value && !isEnd.value) {
    loading.value = true;
    subCategory.value = null;

    if (!next.value) {
      courses.value = [];
    }

    subCategory.value = await courseStore.getCategory({
      id: subCategoryId.value,
    });

    const { cursor, data } = await marketStore.searchCourses({
      ...query.value,
      next: next.value,
      limit: 10,
    });

    if (next.value) {
      courses.value.push(...data);
    } else {
      courses.value = data;
    }

    loading.value = false;
    next.value = cursor.next;
    isEnd.value = !cursor.next;
  }
}

async function onApply(query) {
  router.push({
    query: {
      ...query,
      categoryId: route.query.categoryId,
      subCategoryId: route.query.subCategoryId,
    },
  });
}

if (import.meta.server) {
  try {
    await searchCourses();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(() => {
  if (courses.value.length === 0) {
    next.value = null;
    searchCourses();
  }
});

onBeforeUnmount(() => {
  courses.value.length = 0;
});

useInfiniteScroll({
  onLoad: searchCourses,
  isLoading: loading,
  containerRef,
  isEnd,
});

watch(
  query,
  () => {
    next.value = null;
    isEnd.value = false;
    searchCourses();
  },
  {
    deep: true,
  },
);
</script>
