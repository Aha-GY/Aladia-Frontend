<template>
  <div class="relative flex w-full flex-wrap items-start">
    <div class="relative flex items-center gap-4 sm:gap-2">
      <!-- Avatar -->
      <div
        class="skeleton h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#232323]"
      />

      <div class="w-full">
        <div class="mb-1 flex flex-wrap items-center gap-2 px-2">
          <div
            class="skeleton h-3 w-1/4 overflow-hidden rounded bg-[#232323] sm:w-16"
          />
          <div
            class="skeleton h-7 w-1/3 overflow-hidden rounded-[6.25rem] bg-[#232323] sm:w-24"
          />
        </div>
        <div
          class="group relative mb-3 flex flex-wrap items-center gap-3 rounded-5 p-2 sm:gap-5"
        >
          <div
            class="skeleton h-9 w-[12rem] overflow-hidden rounded bg-[#232323] 2xl:w-[16rem]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
