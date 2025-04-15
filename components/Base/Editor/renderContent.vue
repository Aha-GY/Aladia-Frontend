<template>
  <div
    ref="editorContentRef"
    class="ql-editor-content ql-editor-content--rendered"
    :class="{
      'hide-copy-button': hideCopyButton,
    }"
    v-html="content"
  />
</template>
<script setup>
import hljs from 'highlight.js';

defineProps({
  content: {
    type: String,
    default: '',
  },
  hideCopyButton: {
    type: Boolean,
    default: true,
  },
});

const editorContentRef = ref(null);

onMounted(() => {
  nextTick(() => {
    if (editorContentRef.value) {
      const syntaxs = editorContentRef.value.querySelectorAll('.ql-syntax');
      for (let index = 0; index < syntaxs.length; index++) {
        const syntax = syntaxs[index];
        hljs.highlightElement(syntax);
      }
    }
  });
});
</script>
<style lang="scss">
.ql-editor-content--rendered {
  ol,
  ul,
  menu {
    margin: 0;
    padding: revert;
  }
  ol {
    list-style: decimal outside;
  }
  ul {
    list-style: disc outside;
  }
  &.hide-copy-button {
    .hljs-copy-button {
      display: none;
    }
  }
}
</style>
