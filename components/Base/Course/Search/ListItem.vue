<template>
  <div
    class="flex cursor-pointer items-center gap-2 rounded-5 p-1.5 pr-3.5 hover:bg-white/5"
    data-cy="ba1f569ca0e4586a"
  >
    <div class="relative h-8 w-12">
      <BaseCourseThumbnail
        class="h-8 w-12 rounded"
        :url="course.thumbnailUrl"
      />
    </div>
    <div class="flex-1 truncate text-sm text-white">
      <div v-html="highLightTitle" />
    </div>

    <el-popover
      v-model:visible="open"
      :width="172"
      trigger="click"
      :show-arrow="false"
      placement="bottom-end"
    >
      <template #reference>
        <div
          class="relative flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        >
          <i class="fa-light fa-ellipsis text-xs text-[#FAFAFA]" />
        </div>
      </template>
      <div
        class="flex cursor-pointer flex-col gap-1.5 p-1.5 text-xs font-medium text-[#E5E5E5]"
      >
        <div
          class="flex cursor-pointer items-center gap-2 rounded-5 bg-[#961D1D26] p-1 hover:bg-white/5"
          @click.stop="onRemove"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-solid fa-trash" />
          </div>
          {{ $t('base.member.invite.remove') }}
        </div>
      </div>
    </el-popover>
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
  searchText: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['remove']);

const open = ref(false);
const highLightTitle = computed(() => {
  const { title } = props.course;

  if (props.searchText) {
    return highlightKeywords(title || '', [props.searchText]);
  } else {
    return title;
  }
});

function onRemove() {
  emits('remove', props.course);
}
</script>
