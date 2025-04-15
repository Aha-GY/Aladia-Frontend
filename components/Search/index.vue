<template>
  <div class="relative pb-36 pt-6">
    <SearchCourses
      v-if="courses.length || courseLoading"
      :courses="courses"
      :loading="courseLoading"
    />
    <SearchUsers
      v-if="users.length || userLoading"
      :users="users"
      :loading="userLoading"
    />
    <SearchOrgs
      v-if="orgs.length || orgLoading"
      :orgs="orgs"
      :loading="orgLoading"
    />
    <SearchPosts
      v-if="posts.length || postLoading"
      :posts="posts"
      :loading="postLoading"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const searchStore = useSearchStore();
const title = computed(() => route.query.title);

const loading = ref(false);
const courseLoading = ref(false);
const userLoading = ref(false);
const orgLoading = ref(false);
const postLoading = ref(false);

const posts = ref([]);
const courses = ref([]);
const users = ref([]);
const orgs = ref([]);
const length = computed(
  () =>
    posts.value.length +
    courses.value.length +
    users.value.length +
    orgs.value.length,
);

async function searchCourses() {
  courseLoading.value = true;
  const { data } = await searchStore.searchCourses({
    limit: 10,
    title: title.value,
  });
  courses.value = data;
  courseLoading.value = false;
}

async function searchUsers() {
  userLoading.value = true;
  const { data } = await searchStore.searchProfile({
    limit: 10,
    text: title.value,
  });
  users.value = data;
  userLoading.value = false;
}

async function searchPosts() {
  postLoading.value = true;
  const { data } = await searchStore.searchPosts({
    limit: 4,
    text: title.value,
  });
  posts.value = data;
  postLoading.value = false;
}

async function searchOrgs() {
  orgLoading.value = true;
  const { data } = await searchStore.getOrganizations({
    limit: 10,
    name: title.value,
  });
  orgs.value = data;
  orgLoading.value = false;
}

async function search() {
  loading.value = true;
  await Promise.all([
    searchCourses(),
    searchUsers(),
    searchPosts(),
    searchOrgs(),
  ]);
  loading.value = false;
}

if (import.meta.server) {
  try {
    await search();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(async () => {
  if (length.value === 0) {
    await search();
  }
});
</script>
