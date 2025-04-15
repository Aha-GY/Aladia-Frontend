<template>
  <div class="flex w-full flex-col items-center py-[4rem]">
    <img src="~/assets/images/homepage/logo.png" class="w-[10rem]" />
    <div class="mt-6 flex items-center gap-4 text-3xl font-bold">
      <i class="fa-brands fa-facebook" />
      <i class="fa-brands fa-instagram" />
      <i class="fa-brands fa-youtube" />
      <i class="fa-brands fa-linkedin" />
      <i class="fa-brands fa-x-twitter" />
      <i class="fa-brands fa-tiktok" />
    </div>
    <div
      class="mt-4 cursor-pointer text-base text-gray-500 hover:underline"
      @click="openAddress"
    >
      via San Martino della battaglia, 8A, Brescia, Italia
    </div>
    <div class="text-base text-gray-500">copyright‌ ©2025</div>
  </div>
</template>
<script setup>
const openAddress = () => {
  window.open(
    'https://www.google.com/maps/place/Via+S.+Martino+della+Battaglia,+8a,+25121+Brescia+BS',
  );
};
</script>
