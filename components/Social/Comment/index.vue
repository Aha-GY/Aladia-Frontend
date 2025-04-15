<template>
  <div
    class="flex h-full flex-col overflow-hidden rounded-t-5 bg-[#060606] bg-opacity-60"
  >
    <div class="sticky top-0 z-[150] px-4 pb-3 pt-4 text-center text-white">
      <div class="flex justify-between">
        <div>
          <span class="text-[0.875rem] font-normal leading-[14px]">
            {{ $t('flux.comment.plural') }}
          </span>
          <span class="ml-2">{{ postItem?.numberOf?.comments }}</span>
        </div>

        <BaseIconClose
          class="!size-6 !text-[#fafafa] hover:!bg-transparent"
          data-cy="bcaa1e5ec656ffb"
          @click="handleClose"
        />
      </div>
    </div>

    <client-only>
      <div
        class="flex flex-col overflow-y-hidden px-4"
        :style="{ height: `calc(95vh - 8rem)` }"
      >
        <SocialCommentAnswers :is-show-skeleton="inputSkeleton" :type="type" />
        <div>
          <SocialCommentInputSkeleton v-if="inputSkeleton" />
        </div>
      </div>
    </client-only>

    <div class="sticky bottom-0 z-10">
      <SocialCommentInput v-if="!inputSkeleton" :type="type" />
    </div>

    <SocialCommentItemReactPopup
      v-if="socialStore.commentsReactPopup"
      :item="socialStore.commentsReactPopupData"
      :is-comment="true"
    />
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const websocket = WebSocketService.getInstance();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, websocket, fluxesStore };
  },
  data() {
    return {
      animation: false,
      inputSkeleton: true,
    };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    classStyle() {
      return [this.animation ? 'opacity-100' : 'opacity-0'];
    },
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);

    if (this.fluxesStore?.isCommentPopupOpen) {
      this.$emit('open', true);
    }
    disableScroll(this.$refs.popup);
    this.socialStore.commentsData = [];
    this.socialStore.commentsLoading = true;
    this.socialStore.getComments().then(() => {
      this.socialStore.commentsLoading = false;
      this.inputSkeleton = false;
      this.$nextTick(() => {
        this.socialStore.answerReplying = true;
      });
    });
  },
  beforeUnmount() {
    this.socialStore.answerReplying = false;
    this.websocket.off('broadcast', this.handleUserConnectStatus);
    this.socialStore.resetEditComment();
    enableAllScroll();
  },
  methods: {
    onCloseClick(event) {
      if (event.button !== 0 || this.socialStore.commentsLoading) {
        return;
      }
      this.socialStore.hidePostsPopup();
    },
    handleUserConnectStatus(data) {
      if (!data || !data.data) {
        return;
      }

      const { userId, online } = data.data;

      this.handleTargetUserStatus(
        this.socialStore.commentsData || [],
        userId,
        online,
      );
    },
    handleTargetUserStatus(list, userId, online) {
      // members list
      (list || []).forEach((item) => {
        if (item.owner?.id === userId) {
          item.owner.online = online;
        }
        if (item.replies) {
          this.handleTargetUserStatus(item.replies, userId, online);
        }
      });
    },
    handleDelete(item) {
      this.$emit('delete', item);
    },
    handleClose() {
      this.$emit('close', false);
    },
  },
};
</script>
