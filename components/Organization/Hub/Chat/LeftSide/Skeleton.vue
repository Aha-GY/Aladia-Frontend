<template>
  <div
    class="mb-0.5 flex h-[3.75rem] w-full items-center gap-2 rounded-md p-1.5 pl-2"
  >
    <div class="flex h-14 w-14 items-center justify-center">
      <BaseSkeleton
        :class="
          isRoom
            ? 'h-12 w-12 [&_div]:rounded-full'
            : 'aspect-video w-14 rounded-md'
        "
        :length="1"
        :height="isRoom ? '3rem' : '2.5rem'"
      />
    </div>
    <div class="flex flex-1 flex-col justify-center gap-2">
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
