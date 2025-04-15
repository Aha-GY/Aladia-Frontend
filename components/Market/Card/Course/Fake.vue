<template>
  <div class="w-[80%] shrink-0 p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
    <div
      class="group/course relative flex w-full flex-col overflow-hidden rounded bg-black"
    >
      <div class="relative h-40 rounded-t bg-black p-[1px]">
        <BaseCourseThumbnail
          class="h-full w-full rounded-b-none rounded-t bg-black text-4xl transition-all duration-300"
          :url="`/images/courses/${index}.png`"
        />
        <div
          class="absolute left-2 top-2 z-20 flex h-6 max-w-28 items-center overflow-hidden rounded bg-black/70 px-1 text-xs backdrop-blur-sm transition-all duration-300"
        >
          <BaseCourseType type="live" />
        </div>
        <div
          class="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-xs text-white/80 shadow-md backdrop-blur transition-all duration-300"
        >
          <i class="fa-regular fa-cart-shopping text-xs" />
          {{ moneyFormat(1024) }} $
        </div>
        <div class="absolute inset-0 z-20 flex items-center justify-center">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-black/50"
          >
            <i class="fa-solid fa-circle-pause" />
          </div>
        </div>
        <div class="absolute bottom-0 left-1 right-1 z-30 h-1 bg-white/20">
          <div class="h-full w-1/3 bg-red-600" />
        </div>
      </div>
      <div class="flex h-16 items-center gap-2 p-2">
        <BaseAvatarNext size="md" picture="/logo/image.png" />
        <div class="flex-1">
          <div class="flex h-4 items-center gap-1 text-13 text-white/50">
            Lincoln Torff
          </div>
          <div class="line-clamp-2 max-w-48 text-13 leading-4">
            How to survive: Wildlife course interactive
          </div>
        </div>
      </div>
      <div
        class="absolute inset-0 z-30 flex scale-105 items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="rounded bg-black/50 px-2 py-1 text-sm">Coming soon</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 5,
    },
  },
};
</script>
