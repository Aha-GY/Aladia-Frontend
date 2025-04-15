<template>
  <div
    v-if="!$device.isMobile"
    class="flex h-[15.3125rem] gap-4 overflow-hidden rounded-md bg-black/60 py-4"
  >
    <!-- pie chart and balance detail on the left -->
    <OrganizationHubPaymentWidgetsPaymentBalance />

    <div class="h-full w-[1px] flex-shrink-0 scale-x-50 bg-[#D9D9D9]" />
    <OrganizationHubPaymentWidgetsPaymentBank />
    <div class="h-full w-[1px] flex-shrink-0 scale-x-50 bg-[#D9D9D9]" />
    <OrganizationHubPaymentWidgetsPaymentMethod />
  </div>
  <!-- todo 手机端样式 -->
  <div
    v-else
    class="flex h-[15.3125rem] gap-4 overflow-x-auto rounded-md bg-black/60 py-4"
  >
    <OrganizationHubPaymentWidgetsPaymentBalance />
    <div class="h-full w-[1px] flex-shrink-0 scale-x-50 bg-[#D9D9D9]" />
    <OrganizationHubPaymentWidgetsPaymentMethod />
  </div>
</template>

<script setup></script>
