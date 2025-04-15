<template>
  <div
    class="absolute -bottom-4 right-4 flex items-center gap-2 rounded border border-white/10 bg-[#101010] px-2 py-1 shadow-[0px_3px_6px_#000000]"
    :class="
      logged
        ? 'cursor-pointer transition-all active:scale-95'
        : 'pointer-events-none'
    "
  >
    <i v-if="liked" class="fa-solid fa-heart" />
    <i v-else class="fa-regular fa-heart text-red-600" />
    {{ item.numberOfLikes }}
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    return { socialStore, authStore };
  },
  computed: {
    liked() {
      return false;
    },
    logged() {
      return this.authStore.logged;
    },
  },
};
</script>
