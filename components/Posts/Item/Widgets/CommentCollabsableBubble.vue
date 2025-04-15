<template>
  <el-collapse-transition>
    <div>
      <div class="relative text-sm">
        <div
          class="relative overflow-hidden rounded-[0.3125rem] text-justify transition-all duration-300"
          :class="limitHeightClass"
        >
          <client-only>
            <div ref="bubble">
              <PostsItemWidgetsBubble
                class="text-[#B0B0B0]"
                :body="item.content"
              />
            </div>
          </client-only>
        </div>

        <div v-if="showMore || showLess" class="relative">
          <div class="text-right">
            <span
              v-if="showMore"
              class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
              data-cy="0368e06cfa1c5ffa"
              @click="handleShowDetail"
            >
              {{ $t('post.show.more') }}
            </span>
            <span
              v-if="showLess"
              class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
              data-cy="0368e06cfa1c5ffa"
              @click="handleShowLess"
            >
              {{ $t('post.show.less') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-collapse-transition>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      open: true,
      contentHeight: 0,
      showMore: true,
      showLess: false,
    };
  },
  computed: {
    limitHeightClass() {
      if (this.showMore) {
        return 'max-h-[3.75rem]';
      }

      return '';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initShowMore();
    });
  },
  methods: {
    initShowMore() {
      const bubble = this.$refs.bubble;
      const dom = bubble?.getBoundingClientRect();

      if (!dom) {
        return;
      }

      const height = dom.height;

      const _maxLessContentHeight = 60;

      if (height > _maxLessContentHeight) {
        this.showMore = true;
      } else {
        this.showMore = false;
      }
    },

    handleShowDetail() {
      this.showMore = false;
      this.showLess = true;
      this.$emit('expand');
    },
    handleShowLess() {
      this.showMore = true;
      this.showLess = false;
      this.$emit('expand');
    },
  },
};
</script>
