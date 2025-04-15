<template>
  <div>
    <iframe
      :src="src"
      class="h-full w-full"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    />
  </div>
</template>

<script>
export default {
  props: {
    src: String,
  },
};
</script>
