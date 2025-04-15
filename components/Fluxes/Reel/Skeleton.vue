<template>
  <div
    class="relative mr-3 inline-block h-[390px] w-[20rem] overflow-hidden rounded-5"
  >
    <!-- Video Placeholder Skeleton -->
    <div class="skeleton shimmer absolute inset-0 z-[1]" />

    <!-- Icon Skeleton (top right corner) -->
    <div
      class="skeleton shimmer !absolute right-5 top-5 z-[2] h-6 w-6 rounded-full"
    />

    <!-- Play Count Text Skeleton (bottom gradient area) -->
    <div
      class="absolute inset-x-0 bottom-0 flex items-center bg-gradient-to-b p-3"
      style="
        background-image: linear-gradient(
          to bottom,
          rgba(38, 38, 38, 0),
          rgba(38, 38, 38, 0.8)
        );
      "
    >
      <div class="skeleton shimmer h-4 w-12 rounded" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background-color: #e0e0e0; /* Light gray background */
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmerEffect 1.5s infinite;
}

@keyframes shimmerEffect {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
