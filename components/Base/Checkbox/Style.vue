<template>
  <div
    class="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
  >
    <div
      v-if="state === 'checked'"
      class="flex h-full w-full items-center justify-center rounded-full border border-[#f2b54a] bg-black/80 hover:opacity-80"
      :class="disabled ? 'cursor-not-allowed bg-[#373737] opacity-30' : ''"
    >
      <div class="h-3 w-3 rounded-full bg-[#f2b54a]" />
    </div>
    <div
      v-if="state === 'unchecked'"
      class="flex h-full w-full items-center justify-center rounded-full border border-[#707070] bg-black/80 hover:bg-[#373737]"
      :class="disabled ? 'cursor-not-allowed bg-[#373737] opacity-30' : ''"
    />
    <div
      v-if="state === 'halfChecked'"
      class="flex h-full w-full items-center justify-center rounded-full border border-[#f2b54a] bg-black/80 hover:opacity-80"
      :class="disabled ? 'cursor-not-allowed bg-[#373737] opacity-30' : ''"
    >
      <div class="h-0.5 w-2 bg-[#f2b54a]" />
    </div>
    <div
      v-if="state === 'correctChecked'"
      class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-[#f2b54a] bg-black/80 hover:opacity-80"
      :class="disabled ? 'cursor-not-allowed bg-[#373737] opacity-30' : ''"
    >
      <div
        class="flex h-3 w-3 items-center justify-center rounded-full bg-[#f2b54a]"
      >
        <i class="fa-solid fa-check translate-y-px text-10 text-black" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      type: String,
      validator: (value) =>
        ['checked', 'unchecked', 'halfChecked', 'correctChecked'].includes(
          value,
        ),
    },
    disabled: Boolean,
  },
};
</script>
