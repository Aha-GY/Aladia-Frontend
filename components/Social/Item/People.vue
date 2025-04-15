<template>
  <div
    class="relative flex h-4 w-16 items-center transition-all"
    @mouseenter="avatarHover = true"
    @mouseleave="avatarHover = false"
  >
    <img
      v-for="(cLient, index) in List"
      :key="index"
      src="~/assets/blank.png"
      class="absolute top-0 h-4 w-4 rounded-full border border-black bg-white transition-all"
      :style="{
        zIndex: index,
        left: avatarHover ? `${index * 0.6}rem` : `${index * 0.35}rem`,
      }"
    />
    <div
      class="absolute -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#65615c] to-[#bdb0a2] text-xs text-white transition-all"
      :style="{
        zIndex: 6,
        left: avatarHover
          ? `${List.length * 0.6}rem`
          : `${List.length * 0.35}rem`,
      }"
    >
      {{ List.length || 0 }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
  },
  data() {
    return {
      avatarHover: false,
    };
  },
  computed: {
    List() {
      return this.data || [];
    },
  },
};
</script>
