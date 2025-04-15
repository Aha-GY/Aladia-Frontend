<template>
  <div class="h-[13.4375rem]" style="perspective: 1000px">
    <div
      class="relative h-full w-full transition-all duration-700"
      style="transform-style: preserve-3d"
      :style="flipped ? 'transform: rotateY(180deg)' : ''"
    >
      <div
        class="absolute h-full w-full overflow-hidden rounded-2xl border border-[#565656]/20 bg-black/20 backdrop-blur-xl"
        style="backface-visibility: hidden"
        data-cy="78bc411be6f5953e"
        @click.stop="handleFlip(true)"
      >
        <div
          class="absolute -left-[11rem] -top-[1rem] h-[16rem] w-[28.5rem] skew-x-[61deg] bg-gradient-to-br from-[#1c2124] to-[#101315] shadow-[inset_0px_0px_5px_3px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        />
        <div
          class="absolute left-5 top-4 z-10 flex h-7 w-10 items-center justify-center rounded bg-gradient-to-bl from-[#ffecc7] to-[#b69b50]"
        >
          <div class="absolute top-2 h-[1px] w-full bg-[#333]" />
          <div class="absolute top-[0.875rem] h-[1px] w-full bg-[#333]" />
          <div class="absolute top-5 h-[1px] w-full bg-[#333]" />
          <div class="absolute left-5 h-full w-[1px] bg-[#333]" />
          <div
            class="z-10 h-5 w-4 rounded border border-[#3a3a3a] bg-gradient-to-b from-[#ffecc7] to-[#c2aa68]"
          />
          <div
            class="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-full"
          >
            <img src="/payment/wave.svg" class="object-cover" alt="" />
          </div>
        </div>

        <!-- logo -->
        <div class="absolute right-2 top-2 z-10 h-11 w-[4.75rem]">
          <img src="/payment/card-logo.png" class="-mr-2 object-cover" alt="" />
        </div>

        <!-- card number -->
        <div class="relative z-10 px-5 pt-[5.625rem] leading-none">
          <div class="mb-9 flex">
            <div class="-ml-2 h-6 px-2 text-2xl leading-none">
              **** **** **** ****
            </div>
          </div>
          <div class="-ml-2 flex items-center justify-between">
            <div class="mr-3 flex-1 truncate px-2">
              <div class="mb-2 text-xs leading-none tracking-wider opacity-70">
                {{ $t('payment.card.holder') }}
              </div>
              <div class="truncate text-base uppercase leading-none">
                {{ $t('payment.fName') }}
              </div>
            </div>
            <div class="w-18 px-2">
              <div class="mb-2 text-xs leading-none tracking-widest opacity-70">
                {{ $t('payment.card.expire') }}
              </div>
              <div class="truncate text-base uppercase leading-none">
                {{ `MM / YYYY` }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute h-full w-full overflow-hidden rounded-2xl bg-gradient-to-tl from-[#1c2124] to-[#101315]"
        style="backface-visibility: hidden; transform: rotateY(180deg)"
        data-cy="9d032df7fc102380"
        @click.stop="handleFlip(false)"
      >
        <div class="mb-3 mt-5 h-10 w-full bg-black" />
        <div class="relative ml-4 mr-5 flex h-9 rounded bg-[#2B2B2B]">
          <div
            class="absolute left-0 top-1 h-full w-[85%] overflow-hidden truncate pl-1 text-xl capitalize"
            style="font-family: Ettlora"
          >
            {{ $t('payment.fName') }}
          </div>
          <div class="flex flex-1 flex-col justify-around py-1">
            <div class="h-1 w-full bg-[#1C1C1C]" />
            <div class="h-1 w-full bg-[#1C1C1C]" />
            <div class="h-1 w-full bg-[#1C1C1C]" />
          </div>
          <div class="flex w-10 items-center pl-2 text-sm">***</div>
        </div>
        <div class="mt-1 pr-5 text-right font-light tracking-widest">
          {{ $t('payment.card.security.code') }}
        </div>
        <div
          class="absolute bottom-9 left-4 h-2 w-28 rounded-sm bg-[#2B2B2B]"
        />
        <div
          class="absolute bottom-[1.375rem] left-4 h-2 w-36 rounded-sm bg-[#1C1C1C]"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const emits = defineEmits(['flip']);

const flipped = ref(false);

const handleFlip = (param) => {
  flipped.value = param;
  emits('flip');
};
</script>
