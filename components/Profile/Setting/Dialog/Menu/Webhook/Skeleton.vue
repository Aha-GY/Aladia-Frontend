<template>
  <div
    class="mb-0.5 flex h-[3.5rem] w-full items-center gap-2 rounded-md p-1.5"
  >
    <div class="flex h-11 items-center">
      <BaseSkeleton
        :class="
          isRoom ? 'h-10 w-10 [&_div]:rounded-full' : 'h-8 w-11 rounded-md'
        "
        :length="1"
        :height="isRoom ? '2.5rem' : '2rem'"
      />
    </div>
    <div class="flex flex-1 flex-col gap-2">
      <div class="flex items-center justify-between">
        <BaseSkeleton class="h-3 w-[50%] rounded" :length="1" height="2rem" />
        <BaseSkeleton
          class="h-2 w-4 animate-pulse rounded"
          :length="1"
          height="2rem"
        />
      </div>
      <BaseSkeleton class="h-2 w-[70%] rounded" :length="1" height="2rem" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isRoom: Boolean,
  },
};
</script>
