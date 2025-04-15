<template>
  <div class="flex items-center gap-2 text-white">
    <i v-if="visibility === 'public' && useIcon" class="fa-light fa-globe" />
    <i v-if="visibility === 'private' && useIcon" class="fa-light fa-ban" />
    {{ visibility === 'public' ? $t('course.visibility.public.title') : '' }}
    {{ visibility === 'private' ? $t('course.visibility.private.title') : '' }}
  </div>
</template>

<script>
export default {
  props: {
    visibility: {
      type: String,
      required: true,
    },
    useIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
