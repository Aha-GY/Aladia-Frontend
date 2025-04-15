<template>
  <div class="grid w-[20rem] grid-cols-4 gap-2 bg-[#131313]">
    <div v-for="item in 4" :key="item">
      <div class="flex flex-col items-center">
        <div class="skeleton mb-1 size-[3.5rem] shrink-0 rounded-full" />
        <div class="skeleton mb-0.5 h-2.5 w-2/3 rounded-5" />
        <div class="skeleton h-2.5 w-3/4 rounded-5" />
      </div>
    </div>
  </div>
</template>
