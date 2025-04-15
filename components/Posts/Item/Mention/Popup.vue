<template>
  <div
    ref="popup"
    class="__mention-popup fixed bottom-0 left-0 right-0 top-0 z-[90] flex h-full w-full items-center justify-center bg-black/20 text-white backdrop-blur"
    @mousedown.self="onCloseClick"
  >
    <div
      class="popupborder relative ml-16 max-h-[95%] w-[43.75rem] bg-black py-4 backdrop-blur transition-all duration-300 max-md:ml-0 max-md:w-[96%]"
      :class="classStyle"
    >
      <div class="px-4">
        <PostsItemMentionHeader
          :item="postItem"
          :is-popup="true"
          @delete="handleDelete"
        />
      </div>
      <client-only>
        <div
          class="overflow-y-auto !py-2"
          :style="{
            maxHeight: `calc(95vh - 28.25rem)`,
          }"
        >
          <PostsItemInfo :item="postItem" :is-popup="true" class="!my-3 px-4" />
          <div
            class="mx-4 mb-2 rounded-5 border-[0.75px] border-[#707070] px-[20px] py-2"
          >
            <PostsItemHeader
              :item="mentionItem"
              :is-popup="true"
              :is-repost="!!postItem"
              @delete="handleDelete"
            />
            <PostsItemInfo :item="mentionItem" :is-popup="true" />
          </div>
        </div>
      </client-only>

      <client-only>
        <div class="flex flex-col py-2">
          <PostsItemMentionPopupAnswers
            :is-show-skeleton="inputSkeleton"
            :is-question="isQuestion"
          />
          <PostsPopupInput v-if="!inputSkeleton && isCommentAllowed" />
          <PostsPopupInputSkeleton v-if="inputSkeleton && isCommentAllowed" />
        </div>
      </client-only>
      <PostsItemReactPopup
        v-if="socialStore.commentsReactPopup"
        :item="socialStore.commentsReactPopupData"
        :is-comment="true"
      />
    </div>
  </div>
</template>
<script>
import WebSocketService from '~/utils/websocket';

export default {
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
    mentionItem() {
      return this.socialStore.mentionItem;
    },
    postItem() {
      return this.socialStore.postItem;
    },
    isQuestion() {
      return this.mentionItem?.type === 'question';
    },
    classStyle() {
      return [
        this.animation ? 'opacity-100' : 'opacity-0',
        this.socialStore.popupExpand && this.isQuestion
          ? 'w-[59.25rem]'
          : 'w-[43.75rem]',
      ];
    },
    isCommentAllowed() {
      if (this.postItem) {
        return !!this.postItem.isCommentAllowed;
      }
      return !!this.mentionItem.isCommentAllowed;
    },
  },
  mounted() {
    this.websocket.on('broadcast', this.handleUserConnectStatus);
    setTimeout(() => {
      this.animation = true;
    }, 100);
    disableScroll(this.$refs.popup);
    this.getData();
  },

  beforeUnmount() {
    this.socialStore.answerReplying = false;
    this.websocket.off('broadcast', this.handleUserConnectStatus);
    this.socialStore.resetEditComment();
    enableAllScroll();
  },
  unmounted() {
    this.socialStore.postItem = null;
  },
  methods: {
    getData() {
      this.socialStore.commentsData = [];
      this.socialStore.commentsLoading = true;
      this.socialStore.gif = '';
      this.socialStore.getComments().then(() => {
        this.socialStore.commentsLoading = false;
        // 根据需求，显示所有层级的评论数量
        // this.socialStore.mentionItem.numberOf.comments = this.socialStore.commentsData.length;
        this.inputSkeleton = false;
        if (this.isCommentAllowed) {
          this.$nextTick(() => {
            this.socialStore.answerReplying = true;
          });
        }
      });
    },
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
  },
};
</script>
