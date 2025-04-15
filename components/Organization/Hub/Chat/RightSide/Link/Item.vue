<template>
  <div
    ref="media"
    class="group/item relative flex flex-1 cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/10"
    @click="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <div
      class="relative flex h-11 w-12 flex-shrink-0 items-center justify-center rounded-5 border-white/20 text-white/80"
      :class="!item.image ? 'border' : ''"
    >
      <img
        v-if="item.image"
        :src="item.image"
        class="h-11 w-12 rounded-5 object-cover"
      />
      <i
        v-else
        class="fa-regular fa-link text-xl text-white/60 group-hover/item:text-white/80"
      />
      <OrganizationHubChatRightSideMediaCheck
        v-if="isSelect"
        :checked="checkedIds.includes(item.id)"
        size="sm"
      />
    </div>

    <div class="flex flex-1 flex-col gap-0.5 truncate">
      <div class="flex items-center justify-between">
        <div v-html="title" />
        <span class="text-xs text-white/40">
          {{ formatDate(new Date(), 'DD/MM/YYYY') }}
        </span>
      </div>
      <div class="truncate text-xs text-white/80" v-html="description" />
      <div class="truncate text-xs text-[#CFA200]">
        {{ item.url }}
      </div>
    </div>
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
    query: String,
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
    };
  },
  computed: {
    title() {
      return this.query && this.item.title
        ? highlightKeywords(this.item.title, [this.query])
        : this.item.title;
    },
    description() {
      return this.query && this.item.description
        ? highlightKeywords(this.item.description, [this.query])
        : this.item.description;
    },
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
      }
    },
    onContextmenu() {
      // if (this.isSelect) return;
      this.onRight(this.item.id);
      this.popoverShow = true;
    },
  },
};
</script>
