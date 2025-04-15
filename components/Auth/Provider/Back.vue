<template>
  <div
    class="group relative mb-6 flex cursor-pointer justify-center font-semibold"
  >
    <div class="group-hover:hidden">{{ $t('auth.forgot.recovery.title') }}</div>
    <div class="hidden text-white/50 group-hover:flex">
      {{ $t('auth.button.back') }}
    </div>
    <div class="absolute left-0">
      <i
        class="fa-regular fa-arrow-left text-white/50 transition-all group-hover:text-white"
      />
    </div>
  </div>
</template>
