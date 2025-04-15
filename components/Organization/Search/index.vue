<template>
  <div ref="containerRef" class="relative min-h-screen pb-36">
    <div class="mb-4 flex items-center justify-between pl-8 pr-6 pt-6 text-xl">
      <SearchTitle :total="total" data-cy="ca6aa1b33ed3aa96" @close="onClose" />
      <SearchFilter data-cy="38724bb42fe55006" @click="filter = !filter" />
    </div>
    <div class="flex flex-wrap px-6">
      <MarketCardTeacher
        v-for="org in orgs"
        :key="org.id"
        :user="org"
        type="organization"
        from="search"
      />
    </div>
    <div v-if="loading" class="flex overflow-hidden px-6">
      <MarketSkeletonTeacher v-for="n in 10" :key="n" />
    </div>
    <ProfileSearchSuggested />
    <OrganizationSearchFilter :open="filter" @close="filter = false" />
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
const orgs = useState('orgs', () => []);

async function search() {
  try {
    const keys = Object.keys(query.value);
    if (!isEnd.value && keys.length && !loading.value) {
      loading.value = true;
      const { cursor, data } = await searchStore.getOrganizations({
        ...route.query,
        name: query.value.title,
        title: undefined,
        next: next.value,
        limit: 10,
      });
      loading.value = false;
      next.value = cursor.next;
      total.value = cursor.totalItems;
      isEnd.value = !cursor.next;
      orgs.value.push(...data);
    }
  } catch (error) {
    loading.value = false;
    throw error;
  }
}

function onClose() {
  router.push({
    path: '/',
  });
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
  if (orgs.value.length === 0) {
    next.value = null;
    search();
  }
});

onBeforeUnmount(() => {
  orgs.value = [];
  next.value = null;
  total.value = 0;
  isEnd.value = false;
  loading.value = false;
});

watch(
  query,
  () => {
    orgs.value = [];
    next.value = null;
    isEnd.value = false;
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
