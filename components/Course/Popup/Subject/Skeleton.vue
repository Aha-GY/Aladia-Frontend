<template>
  <div
    v-for="n in 5"
    :key="n"
    class="group mb-2 rounded bg-white/10 p-3 transition-all"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center pl-5">
        <div class="skeleton h-5 w-72 rounded" />
      </div>
      <div class="flex items-center gap-4 pr-2 text-xs">
        <div class="flex items-center gap-2">
          <div class="skeleton h-4 w-4 rounded-full" />
          <div class="skeleton h-4 w-20 rounded" />
        </div>
        <div class="flex items-center gap-2">
          <div class="skeleton h-4 w-4 rounded-full" />
          <div class="skeleton h-4 w-20 rounded" />
        </div>
        <div class="flex items-center gap-2">
          <div class="skeleton h-4 w-4 rounded-full" />
          <div class="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.skeleton {
  background: linear-gradient(90deg, #f0efef 25%, #fdfdfd 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
