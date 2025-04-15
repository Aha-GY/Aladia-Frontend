<template>
  <div>
    <div
      v-for="index in 5"
      :key="index"
      class="mb-2 flex items-center rounded bg-white/5 px-3 py-2"
    >
      <div>
        <div class="flex cursor-pointer items-center gap-3">
          <div
            class="flex size-5 shrink-0 items-center justify-center rounded bg-white/5"
          />
          <div class="h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>
