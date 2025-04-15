<template>
  <div class="my-3 flex h-5 items-center justify-center gap-4">
    <div
      v-for="item in tabList"
      :key="item.key"
      class="cursor-pointer px-0.5 text-sm text-white/50 transition-all hover:font-bold hover:text-white/80"
      :class="isActive(item.key) ? 'font-bold text-white/80' : ''"
      data-cy="c1289569b579113e"
      @click="onChange(item.key)"
    >
      {{ $t(item.name) }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: String,
  },
  data() {
    return {
      tabList: [
        {
          name: 'org.tab.all',
          key: 'All',
        },
        {
          name: 'org.tab.spaces',
          key: 'Spaces',
        },
        {
          name: 'org.tab.rooms',
          key: 'Rooms',
        },
      ],
    };
  },
  methods: {
    isActive(name) {
      if (this.modelValue) {
        return this.modelValue === name;
      } else {
        return name === 'All';
      }
    },
    onChange(name) {
      if (name === 'All') {
        this.$emit('update:modelValue', 'All');
      } else {
        this.$emit('update:modelValue', name);
      }
    },
  },
};
</script>
