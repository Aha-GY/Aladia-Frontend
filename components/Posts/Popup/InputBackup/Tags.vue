<template>
  <div
    ref="tagRef"
    class="absolute right-2 z-40 w-72 rounded-xl border border-white/20 bg-black/50 p-3 shadow-[0px_2px_6px_#000000] backdrop-blur transition-all duration-300"
    :class="
      socialStore.answerShowTags
        ? 'bottom-16 opacity-100'
        : 'pointer-events-none bottom-12 opacity-0'
    "
  >
    <div class="mb-2 text-sm">
      {{ $t('post.people') }}
    </div>
    <div class="mb-2 h-8 rounded-md border border-white/10 bg-white/10">
      <input
        v-model.trim="input"
        maxlength="20"
        :placeholder="$t('post.search')"
        class="h-full w-full bg-transparent px-2 text-sm outline-none placeholder:text-white/30"
        data-cy="ec1be1c70e24ae22"
      />
    </div>
    <div class="h-48 overflow-y-auto">
      <div
        v-for="(item, index) in tags"
        :key="index"
        class="mb-2 flex cursor-pointer items-center gap-1 rounded-md border border-[#ddd042] p-0.5 transition-all active:scale-95"
        data-cy="33e049efc1644ce9"
        @click="addUserTag(item)"
      >
        <img
          :src="item.image"
          class="h-6 w-6 rounded-md border border-[#ddd042] object-cover"
        />
        <span class="w-0 flex-1 truncate text-sm">{{ item.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const tagRef = ref(null);
    const socialStore = useSocialStore();
    onClickOutside(tagRef, () => {
      socialStore.answerShowTags = false;
    });
    return { tagRef, socialStore };
  },
  data() {
    return {
      input: '',
    };
  },
  computed: {
    question() {
      return this.socialStore.postItem;
    },
    tags() {
      if (this.input) {
        return this.socialStore.answerTags.filter((item) =>
          item.username.toLowerCase().includes(this.input.toLowerCase()),
        );
      } else {
        return this.socialStore.answerTags;
      }
    },
  },
  mounted() {
    // this.getUserTags();
  },
  methods: {
    // getUserTags() {
    //   this.courseStore.getUserTags({
    //     username: "",
    //     questionId: this.question.id,
    //   });
    // },
    addUserTag(tag) {
      const quill = window['answer-quill'];
      quill.getModule('mention').insertItem(
        {
          denotationChar: '@',
          id: tag.username,
          value: tag.username,
        },
        true,
      );
    },
  },
};
</script>
