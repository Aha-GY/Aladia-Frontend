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
          <div
            v-if="btnShow"
            class="pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t from-[#060606] via-transparent to-transparent transition-all duration-500 ease-in-out"
          />
        </div>

        <div v-if="btnShow" class="relative">
          <div class="text-right">
            <span
              v-if="btnShow && !isPopup"
              class="cursor-pointer text-xs leading-6 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
              data-cy="0368e06cfa1c5ffa"
              @click="handleShowDetail"
            >
              {{ $t('post.show.more') }}
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
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: true,
      contentHeight: 0,
      btnShow: false,
    };
  },
  computed: {
    limitHeightClass() {
      if (this.item.bodyShow) {
        return '';
      }

      if (this.btnShow) {
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
      if (this.isPopup) {
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
  },
};
</script>
