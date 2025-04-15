<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center gap-1">
      <div class="flex h-7 w-7 items-center justify-center">
        <i class="fa-solid fa-gear text-base text-[#D9D9D9]/80" />
      </div>
      <div class="w-0 flex-1 text-base font-semibold text-[#D9D9D9]/80">
        {{ $t('calendar.function') }}
      </div>
    </div>
    <div class="flex items-center gap-1">
      <div class="flex h-7 w-7 items-center justify-center">
        <i
          class="fa-solid fa-right-from-bracket rotate-180 text-sm text-[#881D15]"
        />
      </div>
      <div class="w-0 flex-1 text-base font-semibold text-[#D52B1EA1]/60">
        {{ $t('calendar.logout') }}
      </div>
    </div>
  </div>
</template>
