<template>
  <div
    class="relative -top-3 w-16 origin-left scale-90 transition-all"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <img
      v-for="(people, index) in peoples"
      :key="index"
      :src="people"
      class="absolute top-0 h-7 w-7 rounded-full border bg-white transition-all"
      :style="{
        zIndex: index,
        left: hover ? `${index * 1}rem` : `${index * 0.6}rem`,
      }"
    />
    <div
      v-if="typeof number === 'number'"
      class="bg-gradient absolute -top-1 flex h-9 w-9 items-center justify-center rounded-full text-xs transition-all"
      :style="{
        zIndex: 6,
        left: hover ? `${peoples.length * 1}rem` : `${peoples.length * 0.6}rem`,
      }"
    >
      <span class="text-white">{{ number }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    peoples: Array,
    number: Number,
  },
  data() {
    return {
      hover: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.bg-gradient {
  background: transparent
    linear-gradient(
      34deg,
      #d9d9d980 0%,
      #71717111 83%,
      #72727212 92%,
      #6d6d6d0d 100%
    )
    0% 0% no-repeat padding-box;
  border: 1px solid #f1f1f1;
  opacity: 1;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}
</style>
