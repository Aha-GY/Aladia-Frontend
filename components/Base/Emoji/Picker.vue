<template>
  <EmojiPicker
    theme="dark"
    :native="true"
    :display-recent="false"
    :disable-skin-tones="true"
    :additional-groups="{
      my_custom_group: [
        { n: ['', 'funny'], u: '1F602' },
        { n: ['', 'heart_eyes'], u: '1F60D' },
        { n: ['', 'clap'], u: '1F44F' },
        { n: ['', 'sad'], u: '1F622' },
        { n: ['', 'angry'], u: '1F620' },
      ],
    }"
    :group-names="{ my_custom_group: $t('base.emoji.groups.frequentlyUsed') }"
    @select="onSelectEmoji"
  />
</template>

<script>
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';

export default {
  components: {
    EmojiPicker,
  },
  methods: {
    onSelectEmoji(emoji) {
      this.$emit('change', emoji);
    },
  },
};
</script>
