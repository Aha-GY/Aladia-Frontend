<template>
  <div class="relative flex h-full w-full flex-col">
    <div class="px-2">
      <BaseInput
        v-model="courseName"
        search
        clear
        fixed
        class="mb-3 text-sm"
        :placeholder="$t('flux.search.course')"
        @focus="openSlider = true"
        @enter="onEnter"
      />
      <BaseCourseSearchSelected :selecteds="selecteds" @remove="onRemove" />
    </div>
    <div
      class="flex flex-1 flex-col overflow-hidden transition-all duration-300"
    >
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar flex-1 overflow-y-auto"
      >
        <BaseCourseSearchItem
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :selecteds="selecteds"
          :search-text="courseName"
          @change="onChange"
        />
        <BaseSkeleton v-if="loading" :length="10" height="2.5rem" />
        <div v-if="!loading && courses.length === 0" class="h-[28rem]">
          <BaseCourseSearchEmpty v-if="courseName.length" />
          <BaseNoData v-else />
        </div>
      </div>
      <div
        class="flex shrink-0 items-center justify-between bg-white/5 px-4 py-2"
      >
        <BaseButton
          icon="fa-arrow-turn-left"
          label="$t:base.dialog.close"
          type="red-cancel"
          data-cy="7add911074671039"
          @click="onClose"
        />
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:text-white active:scale-95"
          data-cy="41821e0e49ce4f91"
          @click="onSave"
        >
          <i class="fa-light fa-plus text-sm" />
          {{ $t('base.upload.insert') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { paymentCoursesSearch } from '~/api/v2/payment';

const props = defineProps({
  showClose: {
    type: Boolean,
    default: false,
  },
  clear: {
    type: Boolean,
    default: false,
  },
  actives: {
    type: Array,
    default: () => [],
  },
  height: {
    type: String,
    default: 'h-full',
  },
  isEnter: {
    type: Boolean,
    default: true,
  },
  isOwnCourses: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['close', 'save', 'change']);

const authStore = useAuthStore();

const courseName = ref('');
const next = ref(null);
const courses = ref([]);
const loading = ref(false);
const timer = ref(null);
const selecteds = ref([]);
const openSlider = ref(false);

watch(
  courseName,
  () => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      init();
    }, 500);
  },
  // immediate: true,
);

watch(openSlider, (open) => {
  if (open) {
    init();
  } else {
    clearTimeout(timer.value);
    loading.value = false;
    next.value = null;
    courses.value = [];
  }
});

onMounted(() => {
  init();
});

async function init() {
  selecteds.value = props.actives;
  next.value = null;
  courses.value = [];
  await load();
}

async function load() {
  try {
    loading.value = true;
    const searchParams = {
      limit: 20,
      next: next.value || undefined,
      title: courseName.value || undefined,
    };
    if (props.isOwnCourses) {
      searchParams.enrollmentType = 'owner';
      searchParams.profileId = authStore.context;
    } else {
      searchParams.enrollmentType = 'enrolled';
      searchParams.profileId = authStore.context;
    }
    const {
      data,
      cursor: { next: nextCursor },
    } = await paymentCoursesSearch(searchParams);
    next.value = nextCursor;
    courses.value = [
      ...courses.value,
      ...data.map((item) => ({
        thumbnailUrl: item.thumbnail?.url,
        id: item.id,
        title: item.title,
      })),
    ];
  } catch (err) {
    console.error('err when search course', err);
  } finally {
    loading.value = false;
  }
}

function onClose() {
  openSlider.value = false;
  emits('close', selecteds.value);
}

function onSave() {
  openSlider.value = false;
  emits('save', selecteds.value);
}

function onChange(course) {
  const includes = selecteds.value.some((item) => item.id === course.id);
  if (includes) {
    onRemove(course);
  } else {
    selecteds.value = [...selecteds.value, course];
  }
}

function onEnter() {
  const input = courseName.value.trim();
  if (!selecteds.value.find((s) => s.email === input)) {
    selecteds.value.push({
      id: input,
      isInput: true,
      email: input,
      invited: true,
    });
    courseName.value = '';
  }
}

function onRemove(course) {
  selecteds.value = selecteds.value.filter((item) => item.id !== course.id);
}
</script>
