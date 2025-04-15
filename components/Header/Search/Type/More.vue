<template>
  <div
    class="flex items-center justify-between border-t border-white/50 px-4 py-3"
  >
    <div
      class="inline-flex cursor-pointer items-center gap-2 text-sm text-[#E0B92C]"
      data-cy="881c60cdb5addb79"
      @click="$emit('more')"
    >
      <i class="fa-regular fa-arrow-up-right-from-square text-xs" />
      {{ $t('nav.header.search.result.viewAll') }}
    </div>
  </div>
</template>
