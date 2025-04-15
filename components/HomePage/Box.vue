<template>
  <div
    ref="container"
    class="relative cursor-pointer overflow-hidden bg-[#060606]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- top -->
    <div
      class="absolute right-0 top-0 h-32 w-32 bg-[#171CB6] opacity-70 blur-[5.375rem] transition-all duration-1000 ease-in-out"
      :style="{
        transform: isHovered
          ? `translateX(calc(-${containerWidth}px + 100%))`
          : 'translateX(0)',
      }"
    />
    <slot />
    <!-- bottom -->
    <div
      class="absolute bottom-0 left-0 h-32 w-32 bg-[#171CB6] opacity-70 blur-[5.375rem] transition-all duration-1000 ease-in-out"
      :style="{
        transform: isHovered
          ? `translateX(calc(${containerWidth}px - 100%))`
          : 'translateX(0)',
      }"
    />
  </div>
</template>

<script setup>
const isHovered = ref(false);

const container = ref(null);
const containerWidth = ref(0);

const updateContainerSize = () => {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth;
  }
};

onMounted(() => {
  updateContainerSize();
  window.addEventListener('resize', updateContainerSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize);
});
</script>
