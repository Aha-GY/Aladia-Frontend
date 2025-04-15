<template>
  <div class="flex w-full flex-col items-center">
    <div class="pt-[6rem] text-center text-white">
      <h1 class="text-[2.5rem] font-bold">Unlock Your Potential with Aladia</h1>
      <p class="mx-auto mt-3 text-base text-[#B0B0B0]">
        Learn from expert instructors and gain valuable skills.
      </p>
    </div>
    <BaseButton class="m-auto mt-8 h-[2.5rem] px-6" @click="goMarketplace">
      Start Learning Now
    </BaseButton>
    <p class="mt-1 text-center text-xs text-[#B0B0B0]">Join our community!</p>
    <div class="relative mt-[5rem] h-[38.5rem] w-full">
      <div class="absolute left-0 top-0 h-full w-full">
        <div
          class="absolute left-0 top-0 h-full w-full rounded-[30px] border border-[#8b8b8b] bg-gradient-to-l from-[#e0b92c] via-black to-[#b475f0] blur-[3.75rem]"
        />
        <div
          class="absolute left-0 top-0 h-full w-full rounded-[1.875rem] border border-[#8b8b8b] bg-gradient-to-l from-[#e0b92c] via-black to-[#b475f0]"
        />
      </div>
      <img
        class="absolute left-[1rem] top-[1.25rem] h-[36rem] rounded-[1.875px] max-lg:w-[48rem] lg:w-[53rem] min-[1150px]:w-[65.625rem]"
        :src="marketplaceImg"
      />
    </div>
    <div
      class="mt-[5rem] inline-flex h-8 items-center justify-between max-lg:w-[53rem] lg:w-[58rem] min-[1150px]:w-[63.94rem]"
    >
      <img class="h-8 w-[9.15rem]" :src="acme" />
      <img class="h-8 w-[7.8125rem]" :src="quantum" />
      <img class="h-[1.7575rem] w-40" :src="echo" />
      <img class="h-[1.7575rem] w-[7.2125rem]" :src="celestia" />
      <img class="h-[1.40rem] w-[6.3rem]" :src="pulse" />
      <img class="h-[1.7rem] w-[5.33rem]" :src="apex" />
    </div>
  </div>
</template>
<script setup>
import acme from '~/assets/images/homepage/acme.png';
import apex from '~/assets/images/homepage/apex.png';
import celestia from '~/assets/images/homepage/celestia.png';
import echo from '~/assets/images/homepage/echo.png';
import marketplaceImg from '~/assets/images/homepage/Marketplace.png';
import pulse from '~/assets/images/homepage/pulse.png';
import quantum from '~/assets/images/homepage/quantum.png';

const router = useRouter();

const goMarketplace = () => {
  router.push(`/marketplace`);
};
</script>
