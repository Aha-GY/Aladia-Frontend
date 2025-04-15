<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[80] flex items-center justify-center bg-white/10"
    >
      <div
        class="px-2 transition-all duration-300"
        :class="animation ? '-mt-20 opacity-100' : '-mt-40 opacity-0'"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      animation: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
  },
};
</script>
