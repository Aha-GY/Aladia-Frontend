<template>
  <div
    ref="media"
    class="relative flex flex-1 cursor-pointer items-center gap-1 rounded-5 p-2 text-sm hover:bg-white/10"
    @click="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <div class="relative flex size-10 items-center">
      <i
        class="fa-solid text-4xl"
        :class="getFileType(item.name || item.title)"
      />
      <OrganizationHubChatRightSideMediaCheck
        v-if="isSelect"
        :checked="checkedIds.includes(item.id)"
        size="sm"
      />
    </div>

    <div class="flex flex-1 flex-col gap-0.5">
      <div class="flex items-center justify-between">
        {{ item.name || item.title }}
        <span class="text-xs text-white/40">
          {{ formatDate(new Date(), 'DD/MM/YYYY') }}
        </span>
      </div>
      <span class="text-xs text-white/40">{{ formatFileSize(item.size) }}</span>
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
import { icons } from '~/constant/files';

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
    getFileType(url = '') {
      const type = url.split('.').pop().toLowerCase();
      return icons[type] || 'fa-file-image';
    },
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
    formatFileSize(size) {
      if (size < 1024) {
        return `${size} B`;
      }
      const i = Math.floor(Math.log(size) / Math.log(1024));
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    },
  },
};
</script>
