<template>
  <div class="flex items-center gap-4 md:pl-20">
    <div
      v-if="$device.isMobile"
      class="flex h-8 w-8 items-center justify-center"
    >
      <i
        class="fa-solid fa-house"
        data-cy="79b8c40e42e3c3a3"
        @click="onHomeClick"
      />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onHomeClick() {
      this.$router.push('/marketplace');
    },
  },
};
</script>
