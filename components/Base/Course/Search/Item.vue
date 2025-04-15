<template>
  <div
    class="flex cursor-pointer items-center gap-2 rounded-5 p-1.5 pr-3.5 hover:bg-white/5"
    data-cy="ba1f569ca0e4586a"
    @click="onChange"
  >
    <div class="relative h-8 w-12">
      <BaseCourseThumbnail
        class="h-8 w-12 rounded"
        :url="course.thumbnailUrl"
      />
      <div
        class="absolute -bottom-1.5 -right-1.5 rounded-full bg-[#0a0a0a] p-1"
      >
        <BaseCheckboxStyle :state="checked ? 'correctChecked' : 'unchecked'" />
      </div>
    </div>
    <div class="flex-1 truncate text-sm text-white">
      <div v-html="highLightTitle" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
    validator: (value) =>
      value.hasOwnProperty('id') &&
      value.hasOwnProperty('thumbnailUrl') &&
      value.hasOwnProperty('title'),
  },
  selecteds: {
    type: Array,
    default: () => [],
  },
  searchText: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['change']);

const checked = computed(() =>
  props.selecteds.some((selected) => selected.id === props.course.id),
);
const highLightTitle = computed(() => {
  const { title } = props.course;

  if (props.searchText) {
    return highlightKeywords(title || '', [props.searchText]);
  } else {
    return title;
  }
});

function onChange() {
  emits('change', props.course);
}
</script>
