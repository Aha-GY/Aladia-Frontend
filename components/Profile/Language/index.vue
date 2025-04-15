<template>
  <div class="flex flex-col gap-3">
    <ProfileLanguageSearch :change="onChange" />

    <ProfileLanguageItem
      v-for="(item, index) in actions"
      :key="index"
      :item="item"
      @delete="actions.splice(index, 1)"
    />
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      language: '',
      optionShow: false,
    };
  },
  methods: {
    onChange(item) {
      this.actions.push(item);
      console.log(this.actions);
    },
  },
};
</script>
