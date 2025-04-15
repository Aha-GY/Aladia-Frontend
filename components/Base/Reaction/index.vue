<template>
  <div class="flex items-center gap-2 rounded-md">
    <BaseReactionItem
      v-for="emoji in emojis"
      :ref="emoji.toLowerCase()"
      :key="emoji"
      :name="emoji"
      :hover-show-text="hoverShowText"
      :hover-text-style="hoverTextStyle"
      data-cy="6d978de0fe38a287"
      @mouseenter="$emit('onMouseenter', emoji)"
      @click="onChange(emoji, $event)"
    />
  </div>
</template>
<script>
export default {
  props: {
    emojis: {
      type: Array,
      default: () => ['Like', 'Lovely', 'Angry', 'Funny', 'Sad'],
    },
    hoverShowText: {
      type: Boolean,
      default: false,
    },
    hoverTextStyle: {
      type: String,
      default: '',
    },
  },
  methods: {
    async onChange(type, event) {
      this.$emit('onChange', type, event);
    },
    async flicker() {
      this.emojis.forEach((emoji) => {
        this.$refs[emoji.toLowerCase()][0].flicker();
      });
    },
  },
};
</script>
