<template>
  <div class="flex h-8 items-center">
    <div v-if="billing.installmentNumber">
      {{ billing.installmentNumber }}
    </div>
    <div v-else>---</div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    billing() {
      return this.course.billing || {};
    },
  },
};
</script>
