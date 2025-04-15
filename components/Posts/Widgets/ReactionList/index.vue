<template>
  <div class="flex h-11 items-center gap-2.5 rounded px-1.5">
    <PostsWidgetsReactionListItem
      name="clap"
      :data-cy="`${dataCy}-post-clap-reaction`"
      @mouseenter="$emit('onMouseenter', 'clap')"
      @click="onChange('clap', $event)"
    />
    <PostsWidgetsReactionListItem
      name="love"
      :data-cy="`${dataCy}-post-love-reaction`"
      @mouseenter="$emit('onMouseenter', 'love')"
      @click="onChange('love', $event)"
    />
    <PostsWidgetsReactionListItem
      name="angry"
      :data-cy="`${dataCy}-post-angry-reaction`"
      @mouseenter="$emit('onMouseenter', 'angry')"
      @click="onChange('angry', $event)"
    />
    <PostsWidgetsReactionListItem
      name="funny"
      :data-cy="`${dataCy}-post-funny-reaction`"
      @mouseenter="$emit('onMouseenter', 'funny')"
      @click="onChange('funny', $event)"
    />
    <PostsWidgetsReactionListItem
      name="sad"
      :data-cy="`${dataCy}-post-sad-reaction`"
      @mouseenter="$emit('onMouseenter', 'sad')"
      @click="onChange('sad', $event)"
    />
  </div>
</template>
<script>
export default {
  props: {
    dataCy: {
      type: String,
      default: 'default',
    },
  },
  methods: {
    async onChange(type, event) {
      this.$emit('onChange', type, event);
    },
  },
};
</script>
