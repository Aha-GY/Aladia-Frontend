<template>
  <div class="flex flex-col gap-6">
    <ProfilePostList :is-view="isView" />
  </div>
</template>
<script>
export default {
  props: {
    goTab: {
      type: Function,
      default: () => {},
    },
    isView: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
