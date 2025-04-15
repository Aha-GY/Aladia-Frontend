<template>
  <div>
    <div
      class="flex h-12 w-full items-center justify-between border-b border-[#56565690] px-5"
    >
      <div data-cy="69373f8758b87a10" @click="goBack">
        <i class="fa-solid fa-chevron-left" />
      </div>
      <div class="flex flex-1 items-center justify-center">{{ title }}</div>
      <div><slot /></div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: 'Aladia',
  },
});
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>
