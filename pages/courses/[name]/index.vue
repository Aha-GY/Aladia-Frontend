<template>
  <NuxtLayout class="overflow-hidden">
    <Course />
  </NuxtLayout>
</template>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    this.globalStore.routePath = to.path;
    next();
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const globalStore = useGlobalStore();

    if (route.params.name?.length !== 24) {
      showError({
        statusCode: 404,
        statusMessage: `${t('course.notFound')}: ${route.params.name}`,
      });
    }

    return { authStore, courseStore, globalStore };
  },
  computed: {
    logged() {
      return this.authStore.logged;
    },
  },
  mounted() {
    this.globalStore.routePath = this.$route.path;
  },
  beforeUnmount() {
    this.courseStore.$reset();
  },
};
</script>
