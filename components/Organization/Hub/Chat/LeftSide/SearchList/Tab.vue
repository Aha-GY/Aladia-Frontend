<template>
  <div class="flex justify-between px-2 text-sm text-white/80">
    <div
      v-for="(tab, index) in tabs"
      :key="tab"
      class="cursor-pointer border-b border-transparent px-1 py-1 transition-all"
      :class="active === tab ? 'border-b-[#CFA200] text-[#CFA200]' : ''"
      data-cy="3280c645f9fe66a9"
      @click="onTab(index)"
    >
      {{ $t(tabsList[index]) }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 'Chat',
      tabs: ['Chat', 'Groups', 'Spaces'],
      tabsList: ['org.tab.chats', 'org.tab.groups', 'org.tab.spaces'],
    };
  },
  methods: {
    onTab(index) {
      this.active = this.tabs[index];
      this.$emit('tab', index);
    },
  },
};
</script>
