<template>
  <div
    class="rounded border-b border-[#f1f1f1]/10 bg-black shadow-[0px_4px_4px_rgba(0,0,0,0.7)] backdrop-blur-lg"
  >
    <div class="relative flex px-5 py-4">
      <div class="skeleton mr-2 h-12 w-12 rounded-full" />
      <div class="flex flex-col justify-around">
        <div class="skeleton h-3 w-28 rounded" />
        <div class="skeleton h-3 w-20 rounded" />
      </div>
      <div
        class="absolute bottom-0 left-4 right-4 h-[1px] border-t border-[#3D3D3D]"
      />
    </div>
    <div class="h-40" />
    <div class="relative flex h-10 items-center justify-around py-3">
      <div
        class="absolute left-4 right-4 top-0 h-[1px] border-t border-[#3D3D3D]"
      />
      <div class="skeleton flex h-4 w-24 items-center rounded" />
      <div class="skeleton flex h-4 w-24 items-center rounded" />
      <div class="skeleton flex h-4 w-24 items-center rounded" />
    </div>
    <!-- <SocialItemBorder /> -->
  </div>
</template>
