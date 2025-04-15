<template>
  <div
    class="ai inline-flex cursor-pointer items-center justify-center gap-3 rounded px-2 py-1.5 text-sm"
  >
    <slot />
  </div>
</template>

<style scoped>
.ai {
  background: linear-gradient(
    93deg,
    #6617b6 3.11%,
    #b0308c 41.66%,
    #6515b4 79.41%,
    #4d52d8 102.27%
  );
}
</style>
