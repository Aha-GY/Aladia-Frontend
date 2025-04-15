<template>
  <div v-if="common.loading" class="mb-6">
    <MarketRowSkeleton v-for="n in 3" :key="n" />
  </div>
  <div v-else class="relative mb-6 w-full">
    <MarketRow
      v-if="authStore.logged && common.continue.length > 0"
      :length="common.continue.length"
      icon="fa-video"
      :title="$t('course.play.continue')"
      type="continue"
    >
      <MarketCardPlayed
        v-for="course in common.continue"
        :key="course.id"
        :course="course"
      />
    </MarketRow>
    <MarketRow
      :length="common.top.length"
      icon="fa-star"
      :title="$t('course.header.top')"
      type="top"
    >
      <MarketCardTop
        v-for="(course, index) in common.top"
        :key="course.id"
        :course="course"
        :index="index"
      />
    </MarketRow>
    <MarketRow
      :length="common.popular.length"
      icon="fa-users"
      :title="$t('course.header.popular')"
      type="popular"
    >
      <MarketCardCourse
        v-for="course in common.popular"
        :key="course.id"
        :course="course"
        type="popular"
      />
    </MarketRow>
    <MarketRow
      :length="common.instructors.length"
      icon="fa-chalkboard-user"
      :title="$t('course.header.instructors')"
      type="instructors"
    >
      <MarketCardTeacher
        v-for="user in common.instructors"
        :key="user.id"
        :user="user"
      />
    </MarketRow>
    <MarketRow
      :length="common.organizations.length"
      icon="fa-building-user"
      :title="$t('course.header.organizations')"
      type="organizations"
    >
      <MarketCardTeacher
        v-for="user in common.organizations"
        :key="user.id"
        :user="user"
        type="organization"
      />
    </MarketRow>
    <MarketVideo />
    <MarketRow
      :length="common.new.length"
      icon="fa-circle-exclamation"
      :title="$t('course.header.new')"
      type="new"
    >
      <MarketCardCourse
        v-for="course in common.new"
        :key="course.id"
        :course="course"
        type="new"
      />
    </MarketRow>
    <MarketRow
      :length="common.suggested.length"
      icon="fa-users-rectangle"
      :title="$t('course.header.suggested')"
      type="suggested"
    >
      <MarketCardUser
        v-for="user in common.suggested"
        :key="user.id"
        :user="user"
      />
    </MarketRow>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const marketStore = useMarketStore();
const common = computed(() => marketStore.common);

if (import.meta.server) {
  try {
    await marketStore.getCommonCarousel();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(() => {
  if (marketStore.common.new.length === 0) {
    marketStore.getCommonCarousel();
  }

  if (authStore.logged) {
    marketStore.getCompletions();
  }
});
</script>
