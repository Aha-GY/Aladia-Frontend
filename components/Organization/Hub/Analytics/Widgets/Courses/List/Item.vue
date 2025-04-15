<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 hover:bg-white/10"
  >
    <div class="flex w-0 flex-1 items-center gap-2">
      <img src="/logo/image.png" class="h-6 w-9 rounded-sm object-cover" />
      <div class="flex-1 truncate text-xs font-light">
        {{ $t('org.title') }}
      </div>
    </div>
    <div class="relative flex items-center justify-end pr-2">
      <div
        v-for="m in 3"
        :key="m"
        class="relative -mr-2 size-6 rounded-full"
        :style="{
          zIndex: m,
        }"
      >
        <img
          class="h-full w-full rounded-full object-cover"
          src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
        />
      </div>
    </div>
  </div>
</template>
