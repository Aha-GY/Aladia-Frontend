<template>
  <div class="flex h-0 flex-1 flex-col items-center justify-center gap-6">
    <div
      class="flex size-32 items-center justify-center rounded-full bg-white/10"
    >
      <i class="fa-solid fa-calendar scale-[2] text-4xl text-white/20" />
    </div>
    <div class="px-6 text-center text-sm text-white/50">
      {{ $t('org.events.incoming.empty') }}
    </div>
    <OrganizationHubAnalyticsWidgetsAdd />
  </div>
</template>
