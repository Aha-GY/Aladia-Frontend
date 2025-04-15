<template>
  <div class="flex flex-col gap-2">
    <div v-for="n in length" :key="n" class="mr-2" :style="{ height }">
      <div class="flex items-center justify-between px-3">
        <div class="flex gap-1.5">
          <div class="skeleton size-12 overflow-hidden rounded-full" />
          <div class="flex flex-col justify-center gap-1">
            <div class="skeleton h-[0.8rem] w-[10rem] rounded" />

            <div class="skeleton h-[0.8rem] w-[3rem] rounded" />
          </div>
        </div>
        <div class="skeleton h-[1rem] w-[3rem] rounded" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '4rem',
    },
    length: {
      type: Number,
      default: 10,
    },
  },
};
</script>
