<template>
  <div
    ref="emoji"
    class="absolute right-2 z-40 rounded-xl border border-white/20 shadow-[0px_2px_6px_#000000] transition-all duration-300"
    :class="
      socialStore.answerShowEmoji
        ? 'bottom-16 opacity-100'
        : 'pointer-events-none bottom-12 opacity-0'
    "
  >
    <LazyBaseEmojiPicker @change="onSelectEmoji" />
  </div>
</template>

<script>
export default {
  setup() {
    const emoji = ref(null);
    const socialStore = useSocialStore();
    onClickOutside(emoji, () => {
      socialStore.answerShowEmoji = false;
    });
    return { emoji, socialStore };
  },
  methods: {
    onSelectEmoji(emoji) {
      const quill = window['answer-quill'];
      const cursor = quill.selection.savedRange.index;
      quill.insertEmbed(cursor, emoji.i);
      quill.setSelection(cursor + emoji.i.length);
    },
  },
};
</script>
