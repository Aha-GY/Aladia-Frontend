<template>
  <div
    v-if="website"
    class="line-clamp-1 max-w-[15.625rem] cursor-pointer text-base text-[#CFA200] underline-offset-4 transition-all hover:underline"
    data-cy="5834cc09a1e6e969"
    @click="openLink(website)"
  >
    {{ website || $t('personal.website') }}
  </div>
</template>
<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const website = computed(() => props.detail.domain || '');
const openLink = (link) => {
  if (link) {
    const location = link.includes('http') ? link : `https://${link}`;
    window.open(location, '_blank');
  } else {
    // profileStore.openDialog();
  }
};
</script>
