<template>
  <div
    class="cursor-pointer truncate rounded-md bg-white/10 px-3 py-1 text-center text-sm text-[#D9D9D9]/40"
  >
    {{ lecture || '---' }}
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    entity() {
      return this.item.entity || {};
    },
    lecture() {
      if (this.entity?.type === 'lecture') {
        return `${this.$t('course.index.chapter', { index: this.entity.chapterIndex + 1 })} - ${this.$t('course.index.lecture', { index: this.entity.lectureIndex + 1 })}`;
      } else {
        return this.entity?.title || 'General';
      }
    },
  },
};
</script>
