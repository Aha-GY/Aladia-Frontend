<template>
  <div class="relative mb-6 flex items-start">
    <div class="flex gap-2">
      <div
        class="skeleton h-12 w-12 overflow-hidden rounded-full bg-[#232323]"
        :class="avatarSize === 'sm' ? 'mt-2 h-8 w-8' : ''"
      />
      <div>
        <div
          class="group relative mb-3 flex h-16 items-center gap-5 rounded bg-[#101010] p-2"
        >
          <div
            class="skeleton h-5 w-40 overflow-hidden rounded-5 bg-[#232323]"
          />
          <div
            class="skeleton h-5 w-40 overflow-hidden rounded-5 bg-[#232323]"
          />
        </div>
        <div class="flex items-center gap-2 px-2">
          <div
            class="skeleton h-4 w-16 overflow-hidden rounded-5 bg-[#232323]"
          />
          <div
            class="skeleton h-4 w-16 overflow-hidden rounded-5 bg-[#232323]"
          />
          <div
            class="skeleton h-4 w-16 overflow-hidden rounded-5 bg-[#232323]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    avatarSize: {
      type: String,
      default: 'md',
    },
  },
};
</script>
