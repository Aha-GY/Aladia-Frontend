<template>
  <div class="flex items-center justify-end gap-4 text-[#D9D9D9]">
    <BaseMemberPreview
      :add="false"
      :remove="false"
      :max="4"
      :length="participants.length"
      :members="participants"
    />
    <el-popover
      v-model:visible="optionsShow"
      trigger="click"
      :width="186"
      :show-arrow="false"
    >
      <template #reference>
        <div
          class="flex h-7 cursor-pointer items-center rounded-md px-1.5 transition-all hover:bg-white/5"
          data-cy="b9748c4e8b85bebf"
          @click.stop
        >
          <i class="fa-light fa-ellipsis-vertical text-xl" />
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <BaseButton
          type="tertiary"
          icon="fa-solid fa-messages-question"
          label="$t:org.open"
          data-cy="f678d592ed0ba6f0"
          @click="onOpen"
        />
        <BaseButton
          v-if="item.status === 4"
          class="text-[#88C359]"
          type="tertiary"
          icon="fa-solid fa-rotate-left"
          label="$t:org.restore"
          data-cy="8c999ae7bf762ecc"
          @click="onRestore"
        />
        <BaseButton
          v-else
          class="text-[#C62828]"
          type="tertiary"
          icon="fa-solid fa-triangle-exclamation"
          label="$t:org.report"
          data-cy="3fd4ec3c832be2c3"
          @click="onReport"
        />
        <BaseButton
          type="tertiary"
          :icon="
            deleteLoading
              ? 'fa-light fa-loader animate-spin text-base'
              : 'fa-solid fa-trash'
          "
          label="$t:base.editor.delete"
          data-cy="6d14469fed06a976"
          @click="handleDeletePost"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    const hubQaStore = useHubQaStore();
    return { socialStore, hubQaStore };
  },
  data() {
    return {
      optionsShow: false,
      deleteLoading: false,
    };
  },
  computed: {
    participants() {
      return this.item.participants || [];
    },
  },
  methods: {
    onOpen() {
      this.socialStore.postItem = this.item;
      this.socialStore.postPopup = true;
      this.optionsShow = false;
    },
    onRestore() {
      //
    },
    onReport() {
      //
    },
    handleClose() {
      this.$nextTick(() => {
        this.socialStore.optionId = null;
        this.socialStore.hidePostsPopup();
      });
    },
    async handleDeletePost() {
      if (this.deleteLoading) {
        return;
      }
      try {
        this.deleteLoading = true;
        await this.socialStore.removePost({
          postId: this.item?.id,
        });

        this.$toast.success('Post deleted sucessfully');
        this.optionsShow = false;
        this.handleClose();
        this.hubQaStore.getPosts();
      } finally {
        this.deleteLoading = false;
      }
    },
  },
};
</script>
