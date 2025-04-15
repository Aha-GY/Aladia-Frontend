<template>
  <div class="mb-2 text-sm text-[#E4B53D]">
    {{ $t('org.events.incoming.title', { amount: 12 }) }}
  </div>
  <div class="hide-scrollbar h-0 flex-1 overflow-y-auto text-sm">
    <div
      v-for="n in 16"
      :key="n"
      class="flex items-center justify-between border-t border-white/20 py-2"
    >
      <div>1:00pm</div>
      <div class="flex-1 text-center text-white/50">Natural Wellness</div>
      <img
        class="h-6 w-10 rounded-sm"
        src="~/assets/images/requirements2.png"
      />
    </div>
  </div>
</template>
