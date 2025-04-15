<template>
  <div
    class="relative aspect-video w-full min-w-[16.8rem] shrink-0 rounded-md bg-[#202020] transition-all"
  >
    <div class="relative h-full rounded-t-md bg-[#6f6f6f]">
      <div
        class="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-[#202020] px-1.5 py-1"
      >
        <div class="skeleton h-4 w-4 rounded-[50%]" />
        <div class="skeleton h-[0.625rem] w-[4.0625rem] rounded" />
      </div>
      <div
        class="absolute bottom-2 right-0 flex items-center gap-1 rounded-l-md bg-[#202020] px-1.5 py-1"
      >
        <div class="skeleton h-4 w-4 rounded-[50%]" />
        <div class="skeleton h-[0.625rem] w-[4.0625rem] rounded" />
      </div>
    </div>
    <div class="flex h-16 flex-col gap-3 p-3">
      <div class="flex gap-3">
        <div class="h-9 w-9 rounded-[50%] bg-[#737373]" />
        <div class="ml-2 flex w-0 flex-1 flex-col gap-1.5">
          <div class="skeleton h-2 w-[6.5rem] rounded" />
          <div class="skeleton h-[0.625rem] w-[9.68rem] rounded" />
          <div class="skeleton h-[0.625rem] w-[11.81rem] rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
