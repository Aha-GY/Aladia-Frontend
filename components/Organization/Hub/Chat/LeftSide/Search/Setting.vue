<template>
  <div
    class="flex flex-col gap-1 rounded-md bg-[#0A0A0A]/80 p-1 shadow-[4px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur"
  >
    <div
      v-for="item in list"
      :key="item.icon"
      class="flex cursor-pointer gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      :data-cy="`menu-item-${item.label}`"
      @click="onChange(item.label)"
    >
      <div class="text-sm">
        <i class="mr-2 text-xs" :class="item.icon" />
        {{ $t(item.name) }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectChange: Function,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      list: [
        {
          icon: 'fa-solid fa-plus',
          name: 'org.activity.room.new',
          label: 'New Room',
        },
        // {
        //   icon: 'fa-regular fa-circle-check',
        //   label: 'Select chats',
        // },
        // {
        //   icon: 'fa-solid fa-thumbtack',
        //   label: 'Pin',
        // },
        // {
        //   icon: 'fa-solid fa-circle-question',
        //   label: 'FAQ',
        // },
        {
          icon: 'fa-solid fa-gear',
          name: 'org.calendar.setting.title',
          label: 'Settings',
        },
      ],
    };
  },
  methods: {
    onChange(label) {
      switch (label) {
        case 'New Room':
          this.hubChatStore.rightSiderType = 'create';
          this.hubChatStore.roomId = -1;
          this.$emit('onClose');
          break;
        // case 'Select chats':
        //   this.selectChange(true);
        //   this.$emit('onClose');
        //   break;
        // case 'FAQ':
        //   this.$emit('onClose');
        //   break;
        case 'Settings':
          this.hubChatStore.isSetting = true;
          this.$emit('onClose');
          break;
      }
    },
  },
};
</script>
