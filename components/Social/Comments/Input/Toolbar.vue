<template>
  <div
    id="reply-toolbar"
    class="absolute left-0 -translate-x-1 transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'opacity-100'
        : 'pointer-events-none opacity-0'
    "
  />
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>

<style lang="scss">
#reply-toolbar {
  .ql-toolbar.ql-snow {
    padding: 0;
    border: none;
  }

  .ql-snow .ql-fill {
    fill: #fff;
  }

  .ql-snow .ql-stroke {
    stroke: #fff;
  }

  .ql-snow.ql-toolbar button {
    opacity: 0.5;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  .ql-snow.ql-toolbar button:hover {
    opacity: 1;
    background-color: transparent;
    border: 1px solid #565656;
  }

  .ql-snow.ql-toolbar button.ql-active {
    opacity: 1;
    background-color: black;
    border: 1px solid #f1f1f1;
  }
}
</style>
