<template>
  <BaseCheckboxStyle
    :state="length ? 'checked' : 'unchecked'"
    data-cy="3b74c5510542ac4c"
    @click="onClick"
  />
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  computed: {
    length() {
      return this.hubReviewStore.selects.length;
    },
  },
  methods: {
    onClick() {
      if (this.length) {
        this.hubReviewStore.selects = [];
      } else {
        this.hubReviewStore.selects = [...this.hubReviewStore.users];
      }
    },
  },
};
</script>
