<template>
  <div class="flex h-0 flex-1 flex-col items-center justify-center gap-4">
    <img src="~/assets/images/space-Illustration.svg" class="h-0 flex-1" />
    <div class="px-6 text-center text-sm text-white/50">
      {{ $t('org.space.empty') }}
    </div>
    <OrganizationHubAnalyticsWidgetsAdd />
  </div>
</template>
