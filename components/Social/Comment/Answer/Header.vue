<template>
  <div :class="containerClass">
    <div class="flex items-center gap-2">
      <div
        class="inline-flex items-center gap-2 text-xs font-semibold text-[#D9D9D9] lg:text-sm"
      >
        <span
          class="line-clamp-1 cursor-pointer underline-offset-2 transition-all hover:underline"
          @click="onUserClick"
        >
          {{ item.owner.name || 'Aladia User' }}
        </span>
      </div>
      <div :class="timeAgoClass">
        {{ timeAgo2(item.createdAt) }}
      </div>
    </div>

    <el-popover
      v-model:visible="popoverVisible"
      trigger="click"
      :show-arrow="false"
      :placement="popoverPlacement"
      :popper-style="{
        border: 'none',
        background: 'transparent',
        'box-shadow': 'none',
        padding: '0',
        borderRadius: '0.375rem',
        minWidth: '6.25rem',
        width: 'auto',
        zIndex: 10000,
      }"
    >
      <template #reference>
        <div
          class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/5 active:scale-95"
        >
          <i class="fa-light fa-ellipsis z-10 text-white" />
        </div>
      </template>
      <div class="popupborder bg-[#060606] p-[0.375rem]">
        <ul class="leading-5">
          <BaseMenuItem
            v-if="isMineComment"
            icon-class="fa-regular fa-edit"
            @click="handleEditComment"
          >
            {{ $t('flux.comment.edit') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="isMineComment && !hasReplies"
            icon-class="fa-regular fa-trash"
            @click="handleDeleteComment"
          >
            {{ $t('flux.comment.delete.title') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="!isMineComment"
            icon-class="fa-regular fa-message"
            @click="handleChat"
          >
            Send a Message
          </BaseMenuItem>

          <BaseMenuItem
            v-if="!isMineComment"
            :icon-class="
              isFollowing
                ? 'fa-regular fa-user-minus'
                : 'fa-regular fa-user-plus'
            "
            @click="handleFollow"
          >
            {{ isFollowing ? 'Remove' : 'Add' }} Follower
          </BaseMenuItem>

          <BaseMenuItem
            v-if="type === 'story' || !isMineComment"
            icon-class="fa-regular fa-flag"
            @click="alert('/* FIXME: action missing */')"
          >
            {{ $t('flux.comment.report') }}
          </BaseMenuItem>
        </ul>
      </div>
    </el-popover>

    <template v-if="confirmVisible">
      <BaseComfirm
        v-model:dialog-show="confirmVisible"
        :title="$t('flux.comment.delete.warning')"
        :message="$t('flux.comment.delete.message')"
        @close="confirmVisible = false"
      >
        <template #footer>
          <div class="flex justify-end p-4">
            <BaseButton
              type="tertiary"
              label="$t:base.upload.cancel"
              @click="confirmVisible = false"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              @click="handleConfirmDeleteComment"
            >
              <template #prefix>
                <i
                  v-if="deleteLoading"
                  class="fa-light fa-loader animate-spin text-base"
                />
                <i v-else class="fa-light fa-trash-can" />
              </template>
              {{ $t('base.editor.delete') }}
            </BaseButton>
          </div>
        </template>
      </BaseComfirm>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();
    return { authStore, socialStore, profileStore, fluxesStore };
  },
  data() {
    return {
      deleteLoading: false,
      confirmVisible: false,
      popoverVisible: false,
    };
  },
  computed: {
    isMineComment() {
      return this.profileStore.myProfileDetail.id === this.item.owner?.id;
    },
    isFollowing() {
      return this.item.isFollowing;
    },
    hasReplies() {
      return this.item.numberOf && this.item.numberOf.replies;
    },
    popoverPlacement() {
      return this.type === 'story' ? 'bottom-end' : 'bottom-start';
    },
    containerClass() {
      return this.type === 'story'
        ? 'flex items-center justify-between text-sm'
        : 'mb-1 flex items-center justify-between text-sm';
    },
    timeAgoClass() {
      return this.type === 'story'
        ? 'whitespace-nowrap text-[8px] text-[#707070] xl:text-xs'
        : 'whitespace-nowrap text-xs text-[#707070]';
    },
  },
  methods: {
    onUserClick() {
      this.$emit('onUserClick');
    },
    handleEditComment() {
      this.$emit('edit', this.item);
      this.popoverVisible = false;
    },
    handleDeleteComment() {
      this.confirmVisible = true;
      this.popoverVisible = false;
    },
    async handleConfirmDeleteComment() {
      if (this.deleteLoading) {
        return;
      }

      try {
        this.deleteLoading = true;
        await this.socialStore.deleteComment({ commentId: this.item.id });
        this.$emit('delete', {
          commentId: this.item.id,
          parentId: this.item.parentId,
          subReplies: Math.max(0, this.item?.replies?.length || 0),
        });
        this.confirmVisible = false;
      } finally {
        this.deleteLoading = false;
      }
    },
    handleChat() {
      this.$emit('chat', {
        item: {
          ...this.item.owner,
        },
      });
    },
    async handleFollow() {
      this.$emit('follow', this.item);
    },
  },
};
</script>

<style scoped>
.line-clamp-1 {
  /*
    Tailwind's default `line-clamp-1` doesn't handle unbreakable text properly, 
    so we added `word-break: break-word` and `overflow-wrap: break-word` to 
    ensure proper text wrapping and truncation.
  */

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word; /* Forces breaking of long words */
  overflow-wrap: break-word; /* Ensures wrapping works across browsers */
}
</style>
