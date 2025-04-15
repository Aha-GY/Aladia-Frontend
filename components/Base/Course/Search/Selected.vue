<template>
  <div v-if="selecteds.length" class="mb-4">
    <div class="hide-scrollbar flex max-h-52 flex-wrap gap-1 overflow-y-auto">
      <div
        v-for="course in selectedList"
        :key="course.id"
        class="mb-1 flex items-center gap-2 rounded-3xl bg-white/5 p-1 text-white/70 hover:bg-white/10"
      >
        <BaseCourseThumbnail
          class="h-6 w-9 rounded"
          :url="course.thumbnailUrl"
        />
        <div class="flex-1 truncate text-sm text-white">
          {{ course.title }}
        </div>

        <div
          class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          data-cy="0d97c32bd7259787"
          @click="onRemove(course)"
        >
          <i class="fa-solid fa-close text-xs" />
        </div>
      </div>
      <div
        v-show="selecteds.length > 6"
        class="w-28 cursor-pointer rounded-3xl bg-white/5 p-1 text-white/70 hover:bg-white/10"
        @click="showMore = !showMore"
      >
        <div class="flex flex-grow-0 items-center gap-2">
          <div
            class="flex size-6 items-center justify-center rounded-full bg-white/5 text-sm"
          >
            <i class="fa-regular fa-rectangle-history" />
          </div>
          <div class="truncate text-13 text-white">{{ label }}</div>
          <div
            class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          >
            <i
              class="fa-light fa-chevron-down text-xs transition-all"
              :class="showMore ? 'rotate-180' : ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  selecteds: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(['remove']);
const { t } = useI18n();
const showMore = ref(false);
const selectedList = computed(() =>
  showMore.value ? props.selecteds : props.selecteds.slice(0, 6),
);
const label = computed(() =>
  showMore.value
    ? t('flux.less', { length: props.selecteds.length - 6 })
    : t('flux.more', { length: props.selecteds.length - 6 }),
);

function onRemove(course) {
  emits('remove', course);
}
</script>
