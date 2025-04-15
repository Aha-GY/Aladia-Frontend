<template>
  <div class="relative text-sm">
    <div
      v-if="item.title"
      class="mb-4 break-words text-[0.9375rem] font-semibold text-[#B0B0B0]"
    >
      {{ item.title }}
    </div>
    <div
      class="overflow-hidden break-all rounded-[0.3125rem] transition-all duration-300"
      :class="limitHeightClass"
    >
      <client-only>
        <div ref="bubble">
          <PostsItemWidgetsBubble class="text-[#B0B0B0]" :body="item.content" />
        </div>
      </client-only>
    </div>

    <div v-if="btnShow || questionBtnShow" class="relative">
      <div class="text-right">
        <span
          v-if="btnShow"
          class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
        >
          {{ $t('post.show.more') }}
        </span>
      </div>

      <div class="text-center">
        <span
          v-if="questionBtnShow"
          class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
        >
          {{ $t('post.show.full') }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      btnShow: false,
      questionBtnShow: false,
    };
  },
  computed: {
    limitHeightClass() {
      if (this.item.bodyShow) {
        return '';
      }

      if (this.btnShow && this.isTextonlyPost) {
        return 'max-h-[37.5rem]';
      }
      if (this.btnShow && this.isPostWithFile) {
        return 'max-h-[3.75rem]';
      }

      if (this.questionBtnShow) {
        return 'max-h-[37.5rem]';
      }

      return '';
    },
    isPostWithFile() {
      return this.item?.files?.length > 0 && this.item.type === 'post';
    },
    isTextonlyPost() {
      return this.item.type === 'post' && !this.item?.files?.length;
    },
    isQuestion() {
      return this.item.type === 'question' || this.item.type === 'review';
    },
  },
  mounted() {
    this.$nextTick(() => {
      const bubble = this.$refs.bubble;
      const dom = bubble?.getBoundingClientRect();
      this.initShowMore(dom?.height);
    });
  },
  methods: {
    initShowMore(height) {
      const _maxMoreContentHeight = 600;
      const _maxLessContentHeight = 60;

      if (this.isQuestion) {
        if (height > _maxMoreContentHeight) {
          this.questionBtnShow = true;
          this.bodyShow = false;
        } else {
          this.questionBtnShow = false;
          this.bodyShow = true;
        }
      } else if (this.isPostWithFile) {
        if (height > _maxLessContentHeight) {
          this.btnShow = true;
          this.bodyShow = false;
        } else {
          this.btnShow = false;
          this.bodyShow = true;
        }
      } else if (this.isTextonlyPost) {
        if (height > _maxMoreContentHeight) {
          this.btnShow = true;
          this.bodyShow = false;
        } else {
          this.btnShow = false;
          this.bodyShow = true;
        }
      }
    },
  },
};
</script>
