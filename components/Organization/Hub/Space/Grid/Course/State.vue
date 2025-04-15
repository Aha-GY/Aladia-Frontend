<template>
  <div class="flex items-center gap-2 text-sm">
    <div
      class="flex h-6 items-center rounded bg-black/70 py-1 pl-1 pr-1.5 text-xs backdrop-blur-sm"
    >
      <BaseCourseStatus :status="course.version?.status" class="!gap-1" />
    </div>
    <div
      class="flex h-6 items-center rounded bg-black/70 py-1 pl-1 pr-1.5 text-xs backdrop-blur-sm"
    >
      <BaseCourseType :type="course.type" class="!gap-1" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
};
</script>
