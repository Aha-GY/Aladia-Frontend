<template>
  <div class="relative min-h-screen pb-36">
    <div class="mb-6">
      <MarketRow
        v-for="item in courses"
        :key="item.id"
        :length="item.courses.length"
        :image="item.image?.url"
        :title="item.name"
        type="category"
        class="min-h-72"
      >
        <template v-for="course in item.courses" :key="course.id">
          <MarketCardCourseFake v-if="course.fake" :index="course.id" />
          <MarketCardCourse v-else :course="course" />
        </template>
      </MarketRow>
    </div>
    <div v-if="loading">
      <MarketRowSkeleton v-for="n in 3" :key="n" />
    </div>
  </div>
</template>

<script setup>
const marketStore = useMarketStore();

const next = useState('next', () => null);
const isEnd = useState('isEnd', () => false);
const loading = useState('loading', () => false);
const courses = useState('courses', () => []);

const route = useRoute();
const categoryId = computed(() => route.query.categoryId);

async function searchCourses() {
  if (categoryId.value && !isEnd.value) {
    loading.value = true;
    courses.value = [];

    const { cursor, data } = await marketStore.searchCoursesByCategory({
      parentId: categoryId.value,
      showCourses: true,
      next: next.value,
      limit: 10,
    });

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.courses.length < 5) {
        for (let j = item.courses.length; j < 5; j++) {
          item.courses.push({ id: j + 1, fake: true });
        }
      }
    }

    courses.value = data;
    loading.value = false;
    next.value = cursor.next;
    isEnd.value = !cursor.next;
  }
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
    isEnd.value = false;
    searchCourses();
  }
});

onBeforeUnmount(() => {
  courses.value.length = 0;
});

watch(categoryId, () => {
  next.value = null;
  isEnd.value = false;
  searchCourses();
});
</script>
