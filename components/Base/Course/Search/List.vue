<template>
  <div class="relative flex h-full w-full flex-col gap-2">
    <BaseInput
      v-model="searchName"
      fixed
      search
      class="px-3 py-1"
      :placeholder="$t('base.search.course')"
    >
      <template #suffix>
        <div
          v-if="searchName"
          class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="27e6ead6119bd918"
          @click="searchName = ''"
        >
          <i class="fa-light fa-close text-xs text-[#FAFAFA]" />
        </div>
        <div
          class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="d1fe373d5221acd2"
          @click="emits('add')"
        >
          <i
            class="fa-solid fa-rectangle-history-circle-plus text-xs text-[#FAFAFA]"
          />
        </div>
      </template>
    </BaseInput>
    <div
      class="hide-scrollbar flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto"
    >
      <BaseCourseSearchListItem
        v-for="course in filterCourses"
        :key="course.id"
        :course="course"
        :search-text="searchName"
        @remove="handleRemove"
      />
    </div>
    <div
      class="-mx-2 -mb-2 flex items-center justify-between bg-white/5 px-4 pb-4 pt-2"
    >
      <BaseButton
        icon="fa-arrow-turn-left"
        label="$t:base.dialog.close"
        type="red-cancel"
        data-cy="454c375a6e8fe875"
        @click="emits('close')"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(['close', 'add', 'remove']);

const searchName = ref('');
const filterCourses = computed(() =>
  props.courses.filter((course) => {
    const name = course.title.toLowerCase();
    return name.includes(searchName.value.toLowerCase());
  }),
);

function handleRemove(courseItem) {
  emits('remove', courseItem);
}
</script>
