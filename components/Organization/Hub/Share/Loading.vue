<template>
  <div
    class="absolute inset-0 z-10 flex items-center justify-center bg-[#101010]"
  >
    <img
      class="absolute size-64 object-cover"
      src="~/assets/images/splash/bg.gif"
    />
    <img
      v-if="logo"
      :src="logo"
      class="z-20 mb-3 size-36 animate-zoomLoop rounded-full bg-[#101010]"
    />
  </div>
</template>

<script>
export default {
  props: {
    logo: {
      type: String,
      required: false,
    },
  },
};
</script>
