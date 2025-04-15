<template>
  <div
    class="group/item flex flex-1 cursor-pointer gap-2 truncate rounded-md px-1 py-2 hover:bg-white/5"
    data-cy="a560bfdf43ae5526"
    @click="openLink"
  >
    <div
      v-if="item.image && loaded"
      class="max-h-[5.625rem] max-w-[10rem] rounded-5"
    >
      <img
        :src="item.image"
        class="h-full w-full rounded-5 object-cover"
        @error="onError"
      />
    </div>
    <div class="flex flex-1 flex-col truncate">
      <div class="mb-2 truncate text-sm font-medium leading-4 text-white/70">
        {{ item.title }}
      </div>
      <div class="leading-3.5 truncate text-xs text-white/30">
        {{ item.description }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    date: [Date, String],
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      loaded: true,
    };
  },
  methods: {
    dateFormat(date) {
      try {
        return formatDate(date, 'DD/MM/YY');
      } catch (error) {
        return '';
      }
    },
    openLink() {
      window.open(this.item.url, '_blank');
    },
    onError() {
      this.loaded = false;
    },
  },
};
</script>
