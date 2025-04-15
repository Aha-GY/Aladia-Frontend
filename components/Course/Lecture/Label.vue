<template>
  <div class="absolute -top-2 right-0 text-xs leading-none">
    <div
      v-if="status === 'live'"
      class="flex items-center gap-1 rounded-bl rounded-tr bg-[#8d231c] px-1 py-1 text-white"
    >
      <div class="size-3 rounded-full border bg-[#6a130c]" />
      {{ $t('course.stream.live') }}
    </div>
    <div
      v-if="status === 'past'"
      class="flex items-center gap-1 rounded-bl rounded-tr bg-[#dabb4b] px-1 py-1 text-black"
    >
      <i class="fa-solid fa-clock-rotate-left text-10" />
      {{ $t('course.stream.past') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
};
</script>
