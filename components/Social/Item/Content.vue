<template>
  <div class="relative my-3 text-sm">
    <div v-if="item.title" class="mb-4 px-6 font-bold">{{ item.title }}</div>
    <div
      class="overflow-hidden break-all px-6 transition-all duration-300"
      :class="item.bodyShow ? '' : 'max-h-24'"
    >
      <client-only>
        <div ref="bubble">
          <SocialCommentsBubble :body="item.content" />
        </div>
      </client-only>
    </div>

    <!-- <div class="px-4 pb-2 pt-6 max-h-[20.5rem]" v-else>Rich Text Content</div> -->

    <div
      v-if="btnShow"
      class="absolute -bottom-1 right-6 h-6 w-[6.8rem] cursor-pointer text-right text-xs font-bold leading-6 text-[#E3C213] underline-offset-2 transition-all hover:font-bold hover:underline active:scale-95"
      style="
        background: linear-gradient(
          270deg,
          #000 62.36%,
          rgba(0, 0, 0, 0) 135.39%
        );
      "
      data-cy="8d540242f7ea3338"
      @click="
        item.bodyShow = true;
        btnShow = false;
      "
    >
      {{ $t('post.content.more') }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      btnShow: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const bubble = this.$refs.bubble;
      const dom = bubble?.getBoundingClientRect();
      const isCodeBlock = bubble?.querySelector('.hljs-copy-wrapper');
      const isBlockquote = bubble?.querySelector('blockquote');
      const isList = bubble?.querySelector('ul');

      if (isCodeBlock || isBlockquote || isList) {
        this.item.bodyShow = true;
      } else if (dom?.height > 96) {
        this.btnShow = true;
      }
    });
  },
};
</script>
