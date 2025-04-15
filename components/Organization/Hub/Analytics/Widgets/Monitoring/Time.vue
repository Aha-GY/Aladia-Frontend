<template>
  <div
    class="pointer-events-none absolute top-4 flex w-full items-center justify-center gap-2"
  >
    <div
      class="next-icon pointer-events-auto flex cursor-pointer items-center justify-center"
    >
      <BaseNextWhite class="rotate-180" />
    </div>
    <div class="text-sm">{{ $t('org.dashboard.time.thisWeek') }}</div>
    <div
      class="next-icon pointer-events-auto flex cursor-pointer items-center justify-center"
    >
      <BaseNextWhite />
    </div>
  </div>
</template>
