<template>
  <div
    class="relative flex flex-col items-center justify-center bg-black/80 p-4 text-[#D9D9D9] shadow-[0.375rem_0.5rem_0.375rem_rgba(0,0,0,0.4)] backdrop-blur"
  >
    <div
      class="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#707070] transition-all hover:bg-white/5 hover:text-[#D9D9D9] active:scale-95"
      data-cy="c4b7ed2f385bc94c"
      @click="$emit('close')"
    >
      <i class="fa-light fa-xmark text-xl" />
    </div>
    <div
      class="mb-9 mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5"
    >
      <i class="fa-solid fa-check text-[2.5rem] text-[#E5BF33]" />
    </div>
    <div class="bold mb-5 text-[1.5625rem]">
      {{ $t('calendar.congrats') }}
    </div>
    <div class="mb-8 px-3 text-center text-xs">
      <slot />
    </div>
    <BaseButton
      class="mb-5"
      :label="label"
      data-cy="2ccb5747ff07d5b6"
      @click="$emit('submit')"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>
