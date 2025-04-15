<template>
  <div
    class="absolute right-4 flex size-6 cursor-pointer items-center justify-center rounded-lg hover:bg-white/10"
    :class="[status !== '' ? 'top-6' : 'top-4']"
  >
    <div
      v-if="isFilesOpen && lecture.attachments?.length"
      class="flex h-full w-full items-center justify-center rounded bg-white/10"
    >
      <i class="fa-thin fa-xmark" />
    </div>
    <div
      v-else
      class="relative scale-95 transition-all ease-in-out hover:scale-75"
    >
      <i class="fa-solid fa-file text-sm" />
      <div
        v-if="lecture.attachments?.length"
        class="absolute -bottom-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#dabb4b] text-xs text-black"
      >
        {{ lecture.attachments?.length || 0 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lecture: {
      type: Object,
      required: true,
    },
    isFilesOpen: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
};
</script>
