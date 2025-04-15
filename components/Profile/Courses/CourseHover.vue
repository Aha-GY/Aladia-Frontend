<template>
  <div
    class="absolute left-1/2 z-[60] w-[20.5rem] shrink-0 -translate-x-1/2 overflow-hidden rounded-md bg-black shadow-[0rem_0.25rem_0.3125rem_rgba(0,0,0,0.4)] transition-all duration-300"
  >
    <div class="relative h-[11.5625rem] rounded-t-md bg-white/80">
      <div class="absolute left-0 top-0 h-full w-full bg-black/20">
        <div
          class="absolute left-2 top-2 flex gap-2 rounded-md bg-black/80 p-1.5"
        >
          <div class="h-8 w-8 rounded-full bg-white/80" />
          <div class="flex flex-col">
            <div class="text-11 text-[#707070]">{{ $t('org.name') }}</div>
            <div class="truncate text-xs font-medium">EkoOrg</div>
          </div>
        </div>
        <div class="absolute right-2 top-2 rounded-md p-1.5">
          <BaseStars value="4" />
        </div>

        <div
          class="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white"
        >
          <i
            class="fa-solid fa-play ml-[0.8125rem] mt-2 text-[1.5625rem] text-white"
          />
        </div>
        <div
          class="absolute bottom-0 left-0 flex w-full items-center justify-between p-2"
        >
          <div class="text-base font-medium">
            {{ $t('course.trailer') }}
          </div>
          <div class="text-xs font-medium">0:00/5:20</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-5 p-3">
      <div class="flex gap-3">
        <div class="h-10 w-10 rounded-full bg-white/80" />
        <div class="flex w-0 flex-1 flex-col gap-1.5">
          <div class="text-xs text-[#707070]">Ryan Middelton</div>
          <div class="truncate text-sm font-semibold leading-4">
            {{ $t('personal.generate.name') }}
          </div>
        </div>
      </div>
      <div class="hide-scrollbar max-h-20 overflow-y-auto text-xs">
        {{ $t('personal.generate.description') }}
      </div>
      <div class="flex items-center">
        <div class="w-0 flex-1 truncate text-xs text-[#707070]">
          23 lectures • 25 h 21 m
        </div>
        <BaseButton
          class="text-xs"
          icon="fa-solid fa-cart-shopping"
          label="300.23$"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
