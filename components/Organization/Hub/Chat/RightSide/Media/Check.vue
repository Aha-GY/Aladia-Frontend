<template>
  <div
    class="group/item absolute -bottom-0.5 -right-0.5 flex cursor-pointer items-center justify-center rounded-full bg-black"
    :class="size === 'sm' ? 'size-5' : 'size-7'"
  >
    <div
      class="relative flex items-center justify-center rounded-full ring-1"
      :class="[
        checked ? 'ring-[#f2b54a]' : 'ring-white/60',
        size === 'sm' ? 'size-3' : 'size-5',
      ]"
    >
      <div
        class="flex items-center justify-center rounded-full transition-all"
        :class="[
          checked ? 'scale-100 bg-[#f2b54a]' : 'scale-0',
          size === 'sm' ? 'size-2.5' : 'size-4',
        ]"
      >
        <i
          class="fa-solid fa-check text-black"
          :class="size === 'sm' ? 'scale-75 text-xs' : 'text-sm'"
        />
      </div>
      <div
        v-if="!checked"
        class="absolute rounded-full group-hover/item:bg-white/30"
        :class="
          size === 'sm' ? 'left-0.5 top-0.5 size-2' : 'left-1 top-1 size-3'
        "
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checked: Boolean,
    size: {
      type: String,
      default: 'md', // sm, md
    },
  },
};
</script>
