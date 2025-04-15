<template>
  <div class="relative mb-6 flex w-full flex-wrap items-start">
    <div class="relative flex items-start gap-4 sm:gap-2">
      <!-- Avatar -->
      <div
        class="skeleton z-50 flex-shrink-0 overflow-hidden rounded-full bg-[#232323]"
        :class="[level > 1 ? 'size-8' : 'size-12']"
      />

      <div class="min-w-44">
        <div
          class="group relative mb-3 flex flex-wrap items-center gap-3 rounded sm:gap-5"
        >
          <div
            class="skeleton min-h-[3.25rem] w-full overflow-hidden rounded bg-[#232323]"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div
            class="skeleton h-4 w-1/4 overflow-hidden rounded bg-[#232323] sm:w-16"
          />
          <div
            class="skeleton h-4 w-1/4 overflow-hidden rounded bg-[#232323] sm:w-16"
          />
          <div
            class="skeleton h-4 w-1/4 overflow-hidden rounded bg-[#232323] sm:w-16"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  level: {
    type: Number,
    default: 1,
  },
});
</script>
