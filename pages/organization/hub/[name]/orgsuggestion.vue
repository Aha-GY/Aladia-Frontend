<template>
  <div ref="$containerRef" class="hide-scrollbar relative min-h-screen pb-36">
    <div class="mb-4 flex items-center justify-between pl-8 pr-6 pt-6 text-xl">
      <div class="flex items-center gap-4">
        <div class="font-Inter font-semibold">
          {{ $t('category.suggested.org') }}
        </div>
        <template v-if="$isFiltered">
          <SearchTitle
            :total="$total"
            data-cy="ca6aa1b33ed3aa96"
            @close="onClose"
          />
        </template>
      </div>
      <SearchFilter data-cy="38724bb42fe55006" @click="$filter = !$filter" />
    </div>

    <div class="flex w-full flex-wrap px-6">
      <MarketCardTeacher
        v-for="organization in $profiles"
        :key="organization.id"
        :user="organization"
        type="organization"
        from="search"
      />
    </div>

    <div v-if="$loading" class="flex flex-wrap px-6">
      <MarketSkeletonTeacher v-for="n in 20" :key="n" />
    </div>
    <OrganizationSearchFilter :open="$filter" @close="$filter = false" />
  </div>
</template>

<script setup>
import { getOrganizations } from '~/api/v2/org';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const query = computed(() => route.query);

const $filter = ref(false);
const $containerRef = ref(null);
const $next = ref(null);
const $total = ref(0);
const $isEnd = ref(false);
const $loading = ref(false);
const $profiles = ref([]);

async function getSuggestedOrganizations() {
  try {
    $loading.value = true;
    const { cursor, data } = await getOrganizations({
      next: $next.value,
      limit: 20,
      followSuggestion: true,
    });
    $loading.value = false;
    $next.value = cursor.next;
    $total.value = cursor.totalItems;
    $isEnd.value = !cursor.next;
    $profiles.value.push(...data);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
    $loading.value = false;
  }
}

async function search() {
  try {
    const keys = Object.keys(query.value);
    if (!$isEnd.value && keys.length && !$loading.value) {
      $loading.value = true;
      const { cursor, data } = await searchStore.getOrganizations({
        ...route.query,
        text: query.value.title,
        title: undefined,
        next: $next.value,
        limit: 10,
        followSuggestion: true,
      });
      $loading.value = false;
      $next.value = cursor.next;
      $total.value = cursor.totalItems;
      $isEnd.value = !cursor.next;
      $profiles.value.push(...data);
    }
  } catch (error) {
    $loading.value = false;
    throw error;
  }
}

const $isFiltered = computed(() => {
  const keys = Object.keys(query.value);
  return keys.length > 0;
});

function onClose() {
  router.push({ path: route.path, query: {} });
  $next.value = null;
  $isEnd.value = false;
  $profiles.value = [];
  getSuggestedOrganizations();
}

useInfiniteScroll({
  onLoad: $isFiltered.value ? search : getSuggestedOrganizations,
  isLoading: $loading,
  isEnd: $isEnd,
  containerRef: $containerRef,
});

onMounted(() => {
  if ($profiles.value.length === 0) {
    $next.value = null;
    getSuggestedOrganizations();
  }
});

onBeforeUnmount(() => {
  $profiles.value = [];
  $next.value = null;
  $total.value = 0;
  $isEnd.value = false;
  $loading.value = false;
});

watch(
  query,
  () => {
    $next.value = null;
    $isEnd.value = false;
    $profiles.value = [];
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
