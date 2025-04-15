<template>
  <div
    v-if="status.includes(course.status)"
    class="absolute -bottom-0.5 -right-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full border border-black bg-black"
  >
    <div
      v-if="course.status === 'published' || course.status === 'updated'"
      class="flex size-[13px] items-center justify-center rounded-full bg-[#1d3b1b] text-[#1D8D2F]"
    >
      <i class="fa-solid fa-check -translate-x-[0.5px] scale-75 text-xs" />
    </div>
    <div
      v-if="course.status === 'rejected'"
      class="flex size-[13px] items-center justify-center rounded-full bg-[#2f0f14] text-[#9D1B32]"
    >
      <i class="fa-solid fa-close scale-75 text-xs" />
    </div>
    <div
      v-if="course.status === 'verifying'"
      class="flex size-[13px] items-center justify-center rounded-full bg-[#332554] text-[#7E50D1]"
    >
      <i class="fa-solid fa-clock scale-75 text-xs" />
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
  data() {
    return {
      status: ['published', 'updated', 'rejected', 'verifying'],
    };
  },
};
</script>
