<template>
  <div class="relative w-full">
    <div
      class="relative z-20 flex h-[3.75rem] w-full flex-1 items-center justify-between bg-black px-2 py-2 max-sm:px-0"
    >
      <OrganizationHubChatContentHeaderSelection
        v-if="isSelect"
        :is-select="isSelect"
        :on-select="onSelect"
        :actives="actives"
        :room-id="room?.id"
        :room="room"
      />

      <OrganizationHubChatContentHeaderChat
        v-else
        :is-popup="isPopup"
        :on-select="onSelect"
        :is-lateral="isLateral"
        :on-search="onSearch"
      />
    </div>
    <div
      v-if="!isRoomDisabled"
      class="absolute left-0 right-0 top-0 z-10 bg-black/80 shadow-[2px_2px_4px_rgba(0,0,0,0.25)] transition-all duration-300"
      :class="searchShow ? 'top-[3.125rem]' : ''"
    >
      <OrganizationHubChatContentHeaderSearch
        v-if="searchShow"
        :room-id="room?.id"
        :on-search="onSearch"
        @locate-message="$emit('locate-message', $event)"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isSelect: Boolean,
    onSelect: Function,
    actives: Array,
    isPopup: Boolean,
    isLateral: Boolean,
  },
  emits: ['locate-message', 'on-search'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      searchShow: false,
    };
  },
  computed: {
    room() {
      return this.isLateral
        ? this.hubChatStore.lateralChatInfo
        : this.isPopup
          ? this.hubChatStore.popupChatInfo
          : this.hubChatStore.chatInfo;
    },
    isRoomDisabled() {
      return this.room?.deleted || this.room?.locked;
    },
  },
  methods: {
    onSearch() {
      this.searchShow = !this.searchShow;
      this.$emit('on-search', this.searchShow);
    },
  },
};
</script>
