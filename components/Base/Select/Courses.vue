<template>
  <div class="flex flex-col gap-1 rounded-md p-1 text-xs text-[#555555]">
    <div
      v-infinite-scroll="loadData"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="flex max-h-32 w-64 flex-col gap-1 overflow-y-auto"
    >
      <div
        v-for="item in coursesData"
        :key="item.id"
        class="flex cursor-pointer items-center rounded px-2 py-2 font-medium text-[#E5E5E5] hover:bg-white/5"
        data-cy="a36cdfeef954f920"
        @click="onClick(item.title)"
      >
        <img :src="item.thumbnail?.url" class="mr-2 h-5 w-8 rounded" />
        <div class="line-clamp-1 flex-1 text-sm text-white">
          {{ item.title }}
        </div>
      </div>
      <BaseSkeleton v-show="loading" height="1.5rem" class="w-full" />
      <div
        v-if="coursesData.length"
        class="cursor-pointer border-t border-[#303030] pt-2 text-center text-[#E9C238] hover:opacity-80"
        data-cy="a8fd711699a574b2"
        @click="onClick(name)"
      >
        {{ $t('base.search.seeAll') }}
      </div>
    </div>
    <div
      v-if="!coursesData.length && !loading"
      class="w-full px-2 py-1 text-center"
    >
      {{ $t('base.search.noResult') }}
    </div>
  </div>
</template>

<script setup>
import { searchCourses } from '~/api/v2/course';

const props = defineProps({
  showSearchData: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  profileId: {
    type: String,
    default: '',
  },
  enrollmentType: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  active: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['select']);
const loading = ref(false);
const coursesData = ref([]);
const next = ref(null);
const timer = ref(null);
watch(
  () => [props.showSearchData, props.name],
  () => {
    if (props.showSearchData) {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        init();
      }, 500);
    } else {
      next.value = null;
      coursesData.value = [];
    }
  },
  { immediate: true, deep: true },
);
const init = async () => {
  next.value = null;
  coursesData.value = [];
  loadData();
};
const loadData = async () => {
  loading.value = true;
  const params = {
    profileId: props.profileId,
    enrollmentType: props.enrollmentType,
    type: props.type || undefined,
    next: next.value || undefined,
    name: props.name || undefined,
  };

  try {
    const { data, cursor } = await searchCourses(params);
    next.value = cursor.next;
    coursesData.value = [...coursesData.value, ...data];
  } finally {
    loading.value = false;
  }
};
const onClick = (name) => {
  emit('select', name);
};
</script>
