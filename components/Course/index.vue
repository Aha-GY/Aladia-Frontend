<template>
  <Head>
    <Title>{{ course.title }} - Aladia</Title>
    <Meta name="description" :content="description" />

    <!-- Open Graph -->
    <Meta property="og:title" :content="course.title" />
    <Meta property="og:description" :content="description" />
    <Meta property="og:image" :content="thumbnail" />
    <Meta property="og:url" :content="url" />
    <Meta property="og:type" content="course" />
    <Meta
      property="og:site_name"
      :content="`Aladia - ${$t('index.hero.title')} 2`"
    />
    <Meta property="og:locale" content="en" />

    <!-- Twitter Card -->
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" :content="course.title" />
    <Meta name="twitter:description" :content="description" />
    <Meta name="twitter:image" :content="thumbnail" />

    <!-- Canonical URL -->
    <Link rel="canonical" :href="url" />
  </Head>
  <div
    v-if="course.id && loadding"
    id="course-wrapper"
    class="relative z-10"
    :style="{ height: `calc(100vh - 3.5rem)` }"
    :class="{
      'overflow-hidden': logged,
    }"
  >
    <Meet
      v-if="roomId && status !== 'past'"
      :room-id="roomId"
      :calendar-id="event.calendarId"
      :event-id="event.id"
      :course="course"
      :class="$route.query.from ? '!pt-14' : ''"
    />
    <CoursePlayer v-else />
    <div id="player-detail" class="pointer-events-none absolute inset-0 z-20">
      <CourseBreadcrumb />
      <CourseShadow v-if="!roomId || status === 'past'" />
      <CourseInfo v-if="!roomId || status === 'past'" />
      <CourseChapter />
      <CoursePopup />
    </div>
  </div>
</template>

<script setup>
import { courseEvent } from '~/constant/eventBus';
import { DOMAIN_URL } from '~/constant/index';

const authStore = useAuthStore();
const courseStore = useCourseStore();
const { $eventBus } = useNuxtApp();

const route = useRoute();
const loadding = ref(false);
const logged = computed(() => authStore.logged);
const course = computed(() => courseStore.course);
const current = computed(() => courseStore.current);
const event = computed(() => current.value?.event);
const roomId = computed(() => event.value?.live?.roomId);
const courseId = computed(() => route.params.name);
const lectureId = computed(() => route.query.lectureId);
const videoId = computed(() => route.query.videoId);
const url = computed(() => DOMAIN_URL + route.fullPath);

const status = computed(() => {
  const { startDate, endDate } = event.value?.dates || {};
  if (startDate && endDate) {
    return getCurrentTimeStatus(startDate, endDate);
  }
  return ''; // 'live', 'future', 'past'
});

const description = computed(
  () => stripHtml(course.value?.description) || course.value?.title,
);

const thumbnail = computed(
  () => course.value?.thumbnail?.url || `${DOMAIN_URL}/logo/image.png`,
);

async function getCourse() {
  await courseStore.getCourse({
    courseId: courseId.value,
  });
}

async function getChapters() {
  await courseStore.getChapters({
    courseId: courseId.value,
  });
  loadding.value = true;
}

async function getSubjects() {
  await courseStore.getSubjects({
    courseId: courseId.value,
    version: 'latest',
    showChapters: true,
  });
}

async function getCompletion() {
  if (logged.value) {
    await courseStore.getCompletion({
      courseId: courseId.value,
    });
  }
}

function refreshCourse() {
  courseStore.refresh({
    courseId: courseId.value,
  });
}

if (import.meta.server) {
  try {
    await getCourse();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(async () => {
  $eventBus.on(courseEvent.PURCHASED_SUCCESS, refreshCourse);
  if (courseId.value) {
    try {
      await getCourse();
      await getChapters();
      await getCompletion();
      await getSubjects();
    } catch (error) {
      showError({
        statusCode: error.response?.status || 500,
        statusMessage: error.message,
      });
    }
  }
});

onBeforeUnmount(() => {
  courseStore.$reset();
  $eventBus.off(courseEvent.PURCHASED_SUCCESS, refreshCourse);
});

watch(lectureId, () => {
  courseStore.routeLecture();
});
watch(videoId, () => {
  courseStore.routeLecture();
});
</script>
