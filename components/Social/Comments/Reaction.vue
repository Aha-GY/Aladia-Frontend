<template>
  <div class="flex h-11 items-center gap-2.5 rounded px-1.5">
    <SocialReact
      name="clap"
      data-cy="ec6d04b1630ddb5f"
      @mouseenter="$emit('onMouseenter', 'clap')"
      @click="onChange('clap', $event)"
    />
    <SocialReact
      name="love"
      data-cy="2706ea108aa6ffa7"
      @mouseenter="$emit('onMouseenter', 'love')"
      @click="onChange('love', $event)"
    />
    <SocialReact
      name="angry"
      data-cy="2caa69b2660a20b1"
      @mouseenter="$emit('onMouseenter', 'angry')"
      @click="onChange('angry', $event)"
    />
    <SocialReact
      name="funny"
      data-cy="c959e83982f3e151"
      @mouseenter="$emit('onMouseenter', 'funny')"
      @click="onChange('funny', $event)"
    />
    <SocialReact
      name="sad"
      data-cy="882076154d049590"
      @mouseenter="$emit('onMouseenter', 'sad')"
      @click="onChange('sad', $event)"
    />
  </div>
</template>
<script>
export default {
  methods: {
    async onChange(type, event) {
      this.$emit('onChange', type, event);
    },
  },
};
</script>
