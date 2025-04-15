<template>
  <div class="mb-2 flex items-center justify-between">
    <div class="text-2xl font-bold">
      {{ $t('org.hub.analytics.user.count', { count: 256 }) }}
    </div>
    <div class="relative flex items-center justify-end pr-2">
      <div
        v-for="n in 7"
        :key="n"
        class="relative -mr-2 size-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-125"
        :style="{
          zIndex: n,
        }"
      >
        <img
          class="h-full w-full rounded-full border-2 border-white/50 object-cover"
          src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
        />
        <div class="absolute left-0 top-0 size-2 rounded-full bg-[#62ab3b]" />
      </div>
    </div>
  </div>
  <OrganizationHubAnalyticsWidgetsUserList />
</template>
