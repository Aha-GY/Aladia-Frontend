<template>
  <div
    :data-cy="`${dataCy}-info`"
    class="__post-item-info --mention-link-enabled"
    :class="
      isTypeReel
        ? 'relative -mt-[4.448rem] mb-0 p-0'
        : 'relative mb-4 mt-5 text-sm'
    "
  >
    <div
      v-if="item.title && !isTypeAutopost"
      class="mb-4 break-words text-[0.9375rem] font-semibold text-[#B0B0B0]"
    >
      {{ item.title }}
    </div>

    <div ref="content" class="overflow-hidden transition-all duration-300">
      <client-only>
        <PostsItemContentAutopost
          v-if="isTypeAutopost"
          :item="item"
          :is-popup="isPopup"
          @show-popup="handleShowDetail"
        />
        <template v-else-if="isTypeReel">
          <PostsItemContentReel :item="item" :is-popup="isPopup" />
        </template>

        <template v-else>
          <el-collapse-transition>
            <div v-show="open">
              <div class="relative text-sm">
                <div
                  class="relative overflow-hidden rounded-[0.3125rem] text-justify transition-all duration-300"
                  :class="limitHeightClass"
                >
                  <client-only>
                    <div ref="bubble">
                      <PostsItemWidgetsBubble
                        v-if="item.content"
                        class="text-[#B0B0B0]"
                        :body="item.content"
                        :data-cy="isPopup ? 'post-popup' : dataCy"
                      />
                    </div>
                  </client-only>
                  <div
                    v-if="btnShow || (questionBtnShow && !isTextonlyPost)"
                    class="pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t from-[#060606] via-transparent to-transparent transition-all duration-500 ease-in-out"
                  />
                </div>

                <div v-if="btnShow || questionBtnShow" class="relative">
                  <div class="text-right">
                    <span
                      v-if="btnShow"
                      class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
                      data-cy="0368e06cfa1c5ffa"
                      @click="handleShowDetail"
                    >
                      {{ $t('post.show.more') }}
                    </span>
                  </div>

                  <div class="text-center">
                    <span
                      v-if="questionBtnShow"
                      class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
                      data-cy="fc455f03c5497460"
                      @click="handleShowDetail"
                    >
                      {{ $t('post.show.full') }}
                    </span>
                  </div>
                </div>
              </div>

              <PostsItemWidgetsMediaCarousel
                v-if="medias.length"
                :media-list="medias"
                @media-click="handleImageClick"
              />

              <div v-if="files.length !== 0" class="mt-4 !w-full">
                <PostsItemWidgetsAttachment :files="files" />
              </div>

              <div v-if="item.gif" class="mt-4 !w-full">
                <PostsItemWidgetsGif :item="item" />
              </div>
            </div>
          </el-collapse-transition>
        </template>
      </client-only>
    </div>

    <div
      v-if="isPopup && isOnlyQuestionType"
      class="next-icon absolute -bottom-3 left-0 right-0 flex w-full cursor-pointer items-center justify-center rounded-b text-13"
      data-cy="33cffba3b9dca4eb"
      @click.stop="handleOpen(!open)"
    >
      <div
        v-if="open"
        class="flex items-center leading-none transition-all hover:-translate-y-1 active:scale-95"
      >
        <i class="fa-regular fa-chevrons-up" />
      </div>
      <div
        v-else
        class="flex items-center leading-none transition-all hover:translate-y-1 active:scale-95"
      >
        <i class="fa-regular fa-chevrons-down" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isPopup: Boolean,
    dataCy: {
      type: String,
      default: 'posts-card-item',
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const socialStore = useSocialStore();
    return { socialStore, hubChatStore };
  },
  data() {
    return {
      btnShow: false,
      questionBtnShow: false,
      open: true,
      contentHeight: 0,
    };
  },
  computed: {
    postType() {
      return this.item.type;
    },
    isTypeReel() {
      return this.postType === 'reel';
    },
    isTypeAutopost() {
      return this.item.type === 'auto-post';
    },
    images() {
      return (this.item.files || []).filter((r) =>
        r.metadata.mimetype.includes('image'),
      );
    },
    videos() {
      return (this.item.files || []).filter((r) =>
        r.metadata.mimetype.includes('video'),
      );
    },
    looms() {
      return (this.item.loomUrls || []).map((r, index) => ({
        url: r,
        metadata: {
          mimetype: 'loom',
        },
        fileId: index,
      }));
    },
    location() {
      return this.item.location && this.item.location.displayMap
        ? [
            {
              location: this.item.location,
              metadata: {
                mimetype: 'location',
              },
              fileId: 'location',
            },
          ]
        : [];
    },
    medias() {
      return [...this.images, ...this.videos, ...this.looms, ...this.location];
    },
    shouldShowLocation() {
      return (
        this.item.location &&
        this.item.location.displayMap &&
        this.item.files.length === 0 &&
        this.item.loomUrls.length === 0
      );
    },
    files() {
      const filteredFiles = (this.item.files || []).filter((r) =>
        r.metadata.mimetype.includes('application'),
      );

      return filteredFiles.map((item) => {
        const metadata = item.metadata;
        return {
          name: metadata.name,
          url: item.url,
          type: metadata.mimetype,
          size: metadata.size,
          fileId: item.id,
        };
      });
    },
    limitHeightClass() {
      if (this.isPopup) {
        return '';
      }

      if (this.btnShow) {
        return 'max-h-[3.75rem]';
      }

      return '';
    },
    isPostWithFile() {
      return this.item?.files?.length > 0 && this.item.type === 'post';
    },
    isTextonlyPost() {
      return (
        this.item.type === 'post' &&
        !this.item?.files?.length &&
        !this.item?.loomUrls?.length &&
        !this.item?.location?.displayMap
      );
    },
    isQuestion() {
      return this.item.type === 'question' || this.item.type === 'review';
    },
    isOnlyQuestionType() {
      return this.item.type === 'question';
    },
    // collapseStyle() {
    //   if (!this.isPopup) return '';
    //   if (!this.isOnlyQuestionType) return '';

    //   return {
    //     maxHeight: this.open ? this.contentHeight + 'px' : '0px',
    //     opacity: this.open ? 1 : 0,
    //   };
    // },
  },
  mounted() {
    this.$nextTick(() => {
      this.initShowMore();
    });
  },
  methods: {
    initShowMore() {
      if (this.isPopup) {
        const content = this.$refs.content;
        const contentDomHeight = content?.scrollHeight;
        this.contentHeight = ~~contentDomHeight + 500 || 0;
        return;
      }

      const bubble = this.$refs.bubble;
      const dom = bubble?.getBoundingClientRect();

      if (!dom) {
        return;
      }

      const height = dom.height;
      const _maxLessContentHeight = 60;

      if (height > _maxLessContentHeight) {
        this.btnShow = true;
      } else {
        this.btnShow = false;
      }
    },
    handleShowDetail() {
      this.$emit('show-popup');
    },
    async handleOpen(status) {
      await this.$nextTick();
      this.open = status;
    },
    handleImageClick(id) {
      // console.log('handleImageClick id:', id);
      const { open, post2MediaList } = useFullscreenPreview();
      const mediaList = post2MediaList(this.item);
      // console.log('mediaList', mediaList);
      open(mediaList, id);
    },
  },
};
</script>
