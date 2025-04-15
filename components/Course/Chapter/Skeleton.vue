<template>
  <div class="flex flex-col gap-6 pl-4 pr-2">
    <div v-for="n in 5" :key="n" class="flex gap-2">
      <div class="skeleton h-[3.5rem] w-[6.23rem] rounded" />
      <div class="flex-1 pt-1">
        <div class="skeleton mb-2 h-4 w-40 rounded-sm" />
        <div class="skeleton h-4 w-52 rounded-sm" />
      </div>
      <div class="skeleton mt-7 h-4 w-3 rounded" />
    </div>
  </div>
</template>
