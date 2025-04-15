<template>
  <div class="truncate py-1 text-sm">
    {{ content }}
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    content() {
      return this.removeHtmlEntities(stripHtml(this.item.content || '---'));
    },
  },
  methods: {
    removeHtmlEntities(str) {
      return str.replace(/&[a-zA-Z0-9#]+;/g, '');
    },
  },
};
</script>
