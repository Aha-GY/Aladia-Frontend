<template>
  <div class="fixed left-1/2 top-24 w-[19.5rem] translate-x-[26rem]">
    <SocialSidebarGeneral v-if="socialStore.tabIndex === 0" />
    <SocialSidebarSocial v-if="socialStore.tabIndex === 1" />
    <SocialSidebarQuestion v-if="socialStore.tabIndex === 2" />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>
