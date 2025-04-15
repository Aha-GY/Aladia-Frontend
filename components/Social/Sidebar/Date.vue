<template>
  <div class="relative z-10 flex items-center justify-center text-[#707070]">
    <div
      class="flex h-7 w-16 cursor-pointer items-center justify-center underline-offset-4 transition-all hover:text-[#f1f1f1] hover:underline active:scale-95 active:font-semibold active:text-[#f1f1f1] active:underline"
      :class="dateType === 0 ? 'text-[#f1f1f1] underline' : ''"
      data-cy="fcbd0aa1f78c8213"
      @click="dateType = 0"
    >
      {{ $t('course.price.timeline.day') }}
    </div>
    <div
      class="flex h-7 w-16 cursor-pointer items-center justify-center underline-offset-4 transition-all hover:text-[#f1f1f1] hover:underline active:scale-95 active:font-semibold active:text-[#f1f1f1] active:underline"
      :class="dateType === 1 ? 'text-[#f1f1f1] underline' : ''"
      data-cy="253af2349a6c7f60"
      @click="dateType = 1"
    >
      {{ $t('course.price.timeline.week') }}
    </div>
    <div
      class="flex h-7 w-16 cursor-pointer items-center justify-center underline-offset-4 transition-all hover:text-[#f1f1f1] hover:underline active:scale-95 active:font-semibold active:text-[#f1f1f1] active:underline"
      :class="dateType === 2 ? 'text-[#f1f1f1] underline' : ''"
      data-cy="5f40b23d540ff1e9"
      @click="dateType = 2"
    >
      {{ $t('course.price.timeline.month') }}
    </div>
    <div
      class="flex h-7 w-16 cursor-pointer items-center justify-center underline-offset-4 transition-all hover:text-[#f1f1f1] hover:underline active:scale-95 active:font-semibold active:text-[#f1f1f1] active:underline"
      :class="dateType === 3 ? 'text-[#f1f1f1] underline' : ''"
      data-cy="935a376fb8f24889"
      @click="dateType = 3"
    >
      {{ $t('course.price.timeline.year') }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateType: 0,
    };
  },
};
</script>
