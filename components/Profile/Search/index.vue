<template>
  <div ref="containerRef" class="relative min-h-screen pb-36">
    <div class="mb-4 flex items-center justify-between pl-8 pr-6 pt-6 text-xl">
      <SearchTitle :total="total" data-cy="a03e2d6f0e5d039f" @close="onClose" />
      <SearchFilter data-cy="ccb8b603da09eaeb" @click="filter = !filter" />
    </div>
    <div class="flex flex-wrap px-6">
      <MarketCardUser v-for="user in profiles" :key="user.id" :user="user" />
    </div>
    <div v-if="loading" class="flex overflow-hidden px-6">
      <MarketSkeletonUser v-for="n in 10" :key="n" />
    </div>
    <ProfileSearchSuggested />
    <ProfileSearchFilter :open="filter" @close="filter = false" />
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const query = computed(() => route.query);

const filter = ref(false);
const containerRef = ref(null);
const next = useState('next', () => null);
const total = useState('total', () => 0);
const isEnd = useState('isEnd', () => false);
const loading = useState('loading', () => false);
const profiles = useState('profiles', () => []);

async function search() {
  try {
    const keys = Object.keys(query.value);
    if (!isEnd.value && keys.length && !loading.value) {
      loading.value = true;
      const { cursor, data } = await searchStore.searchProfile({
        ...route.query,
        text: query.value.title,
        title: undefined,
        next: next.value,
        limit: 10,
      });
      loading.value = false;
      next.value = cursor.next;
      total.value = cursor.totalItems;
      isEnd.value = !cursor.next;
      profiles.value.push(...data);
    }
  } catch (error) {
    loading.value = false;
    throw error;
  }
}

function onClose() {
  router.push({ path: '/' });
}

useInfiniteScroll({
  onLoad: search,
  isLoading: loading,
  isEnd,
  containerRef,
});

if (import.meta.server) {
  try {
    await search();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(() => {
  if (profiles.value.length === 0) {
    next.value = null;
    search();
  }
});

onBeforeUnmount(() => {
  profiles.value = [];
  next.value = null;
  total.value = 0;
  isEnd.value = false;
  loading.value = false;
});

watch(
  query,
  () => {
    next.value = null;
    isEnd.value = false;
    profiles.value = [];
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
