<template>
  <div
    class="relative w-[20.5rem] shrink-0 rounded-md bg-white/5 transition-all hover:bg-black/80 hover:shadow-[0.5rem_0.4375rem_0.3125rem_rgba(0,0,0,0.7)]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <ProfileCoursesCourseHover
      :class="
        hover
          ? '-top-4 scale-105 opacity-100'
          : 'pointer-events-none top-0 opacity-0'
      "
    />
    <div class="relative h-[11.5625rem] rounded-t-md bg-white/80">
      <div
        class="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-1"
      >
        <div class="text-sm font-semibold">4.0</div>
        <i class="fa-solid fa-star text-11" />
      </div>

      <div
        class="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-1"
      >
        <i class="fa-light fa-video text-xs" />
        <div class="text-xs font-medium">
          {{ $t('base.courses.type.onLive') }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3 p-3">
      <div class="flex gap-3">
        <div class="h-10 w-10 rounded-full bg-white/80" />
        <div class="flex w-0 flex-1 flex-col gap-1.5">
          <div class="text-xs text-[#707070]">Ryan Middelton</div>
          <div class="truncate text-sm font-semibold leading-4">
            {{ $t('personal.generate.name') }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-0 flex-1 truncate text-xs text-[#707070]">
          23 lectures • 25 h 21 m
        </div>
        <BaseButton
          class="text-xs"
          type="secondary"
          icon="fa-solid fa-cart-shopping"
          label="300.23$"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
    };
  },
};
</script>
