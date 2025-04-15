<template>
  <div class="flex w-full flex-wrap">
    <div v-for="index in 6" :key="index" class="flex aspect-square w-1/3">
      <div
        class="skeleton m-2 flex w-full items-center overflow-hidden rounded-[0.3125rem]"
      />
    </div>
  </div>
</template>
