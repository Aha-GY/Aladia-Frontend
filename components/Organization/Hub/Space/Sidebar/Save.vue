<template>
  <div
    class="flex h-9 cursor-pointer items-center justify-center rounded bg-[#121212] hover:bg-[#1f1f1f]"
    data-cy="991e6bf9e603c595"
    @click="$emit('save')"
  >
    <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
    <span v-else class="text-sm font-semibold">
      {{ $t('base.upload.save') }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
};
</script>
