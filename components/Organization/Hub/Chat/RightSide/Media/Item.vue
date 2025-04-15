<template>
  <div
    ref="media"
    class="relative h-20 w-20 cursor-pointer rounded-5 hover:brightness-90"
    @click="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <div v-if="loading" class="h-full w-full">
      <BaseSkeleton :length="1" height="5rem" class="w-full" />
    </div>
    <img
      v-if="item.mimetype.includes('image')"
      :src="item.url"
      class="h-full w-full rounded-md object-cover transition-all duration-300"
      :style="{ opacity: loading ? 0 : 1 }"
      alt=""
      @load="onLoad"
    />
    <video
      v-else
      :src="item.url"
      class="h-full w-full rounded-md object-cover transition-all duration-300"
      :style="{ opacity: loading ? 0 : 1 }"
      @loadedmetadata="item.duration = $event.target.duration"
      @loadeddata="onLoad"
    />
    <div
      v-if="item.mimetype.includes('video')"
      class="absolute bottom-0 left-0 flex w-full items-center gap-1.5 bg-gradient-to-b from-[rgba(30,30,30,0)] to-[#070707] pl-1"
    >
      <div class="flex h-3.5 w-3.5 items-center justify-center text-white/70">
        <i class="fa-regular fa-video text-xs" />
      </div>
      <div v-if="item.duration" class="text-xs text-white/80">
        {{ secondToTime(item.duration) }}
      </div>
    </div>
    <div
      v-else-if="item.mimetype.includes('gif')"
      class="absolute bottom-0 left-0 flex w-full items-center gap-1.5 bg-gradient-to-b from-[rgba(30,30,30,0)] to-[#070707] pl-1"
    >
      <div class="flex h-3.5 w-3.5 items-center justify-center text-white/70">
        <i class="fa-light fa-gif text-xs" />
      </div>
    </div>
    <OrganizationHubChatRightSideMediaCheck
      v-if="isSelect"
      :checked="checkedIds.includes(item.id)"
    />
  </div>
  <client-only>
    <el-popover
      :virtual-ref="media"
      :visible="popoverShow"
      :popper-style="{
        border: 'none',
        background: 'transparent',
        'box-shadow': 'none',
        padding: '0',
      }"
      :offset="-10"
      :width="180"
      :show-arrow="false"
      virtual-triggering
    >
      <OrganizationHubChatRightSideMediaOptions
        :id="item.id"
        :item="item"
        :is-select="isSelect"
        :on-select="onSelect"
        :on-delete="onDelete"
        :on-cancel="onCancel"
        :on-forward="onForward"
        @locate-message="$emit('locate-message', $event)"
      />
    </el-popover>
  </client-only>
</template>
<script>
export default {
  props: {
    item: Object,
    isSelect: Boolean,
    checkedIds: Array,
    onPreview: Function,
    onCheck: Function,
    rightId: String,
    onRight: Function,
    onSelect: Function,
    onDelete: Function,
    onCancel: Function,
    onForward: Function,
  },
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    const media = ref();
    const popoverShow = ref(false);
    onClickOutside(media, () => {
      popoverShow.value = false;
    });
    return { media, popoverShow, hubChatStore };
  },
  data() {
    return {
      checked: false,
      loading: true,
    };
  },
  watch: {
    rightId(id) {
      if (id !== this.item.id) {
        this.popoverShow = false;
      }
    },
  },
  methods: {
    onClick() {
      if (this.isSelect) {
        this.onCheck(this.item.id);
      } else {
        this.onPreview(this.item.id);
      }
    },
    onContextmenu() {
      this.onRight(this.item.id);
      this.popoverShow = true;
    },
    async onLoad() {
      this.loading = false;
    },
  },
};
</script>
