<template>
  <div ref="containerRef" class="relative min-h-screen p-6 pb-36">
    <div class="mb-4 flex items-center justify-between px-2 text-xl">
      <SearchTitle :total="total" data-cy="214cac26789cb09b" @close="onClose" />
      <SearchFilter data-cy="bb78628176d23219" @click="filter = !filter" />
    </div>
    <div class="flex flex-wrap">
      <MarketCardCourse
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
    <div v-if="loading" class="flex overflow-hidden">
      <MarketSkeletonCourse v-for="n in 10" :key="n" />
    </div>
    <MarketSearchFilter
      :open="filter"
      @apply="onApply"
      @close="filter = false"
    />
  </div>
</template>

<script setup>
const marketStore = useMarketStore();
const searchStore = useSearchStore();

const filter = ref(false);
const route = useRoute();
const router = useRouter();
const containerRef = ref(null);
const query = computed(() => route.query);

const next = useState('next', () => null);
const total = useState('total', () => 0);
const isEnd = useState('isEnd', () => false);
const loading = useState('loading', () => false);
const courses = useState('courses', () => []);

async function search() {
  try {
    const keys = Object.keys(query.value);
    if (!isEnd.value && keys.length && !loading.value) {
      loading.value = true;
      const { cursor, data } = await marketStore.searchCourses({
        ...route.query,
        next: next.value,
        limit: 10,
      });
      loading.value = false;
      next.value = cursor.next;
      total.value = cursor.totalItems;
      isEnd.value = !cursor.next;
      courses.value.push(...data);
    }
  } catch (error) {
    loading.value = false;
    throw error;
  }
}

async function onApply(query) {
  router.push({
    query: {
      ...query,
      title: searchStore.query.title,
    },
  });
}

if (import.meta.server) {
  try {
    await search();
  } catch (error) {
    console.log(error.message);
  }
}

function onClose() {
  router.push({ path: '/marketplace' });
}

onMounted(() => {
  if (courses.value.length === 0) {
    next.value = null;
    search();
  }
});

onBeforeUnmount(() => {
  courses.value = [];
  next.value = null;
  total.value = 0;
  isEnd.value = false;
  loading.value = false;
});

useInfiniteScroll({
  onLoad: search,
  isLoading: loading,
  isEnd,
  containerRef,
});

watch(
  query,
  () => {
    next.value = null;
    isEnd.value = false;
    courses.value = [];
    search();
  },
  {
    deep: true,
  },
);

watch(
  () => searchStore.query.title,
  (value) => {
    if (!value) {
      onClose();
    }
  },
);
</script>
