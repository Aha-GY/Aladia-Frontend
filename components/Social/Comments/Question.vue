<template>
  <div class="relative z-10 mb-4 flex items-start justify-between gap-3">
    <div
      class="flex w-44 items-center gap-2 rounded bg-black p-3 shadow-[0px_3px_6px_#000000]"
      data-cy="f4043eed4a018fbd"
      @click="handleUserClick"
    >
      <BaseAvatarNext
        :picture="user.picture"
        :show-online="false"
        size="md"
        class="size-16 cursor-pointer bg-transparent"
      />
      <div class="w-20">
        <div
          class="line-clamp-2 cursor-pointer leading-[1.3] underline-offset-2 transition-all hover:underline"
        >
          {{ user.name }}
        </div>
        <div class="mt-1 text-xs text-[rgba(112,112,112,0.47)]">
          {{ formatDate(postItem.createdAt, 'DD MMM YYYY') }}
        </div>
      </div>
    </div>
    <div class="relative flex-1">
      <div
        class="relative z-10 flex flex-col justify-between rounded bg-black p-3 shadow-[0px_3px_6px_#00000050]"
      >
        <div
          class="mb-4 flex max-w-[32rem] items-center truncate font-semibold"
        >
          {{ postItem.title }}
        </div>
        <div
          class="text-sm transition-all"
          :class="
            open
              ? 'mb-4 max-h-72 overflow-y-auto opacity-100'
              : 'mb-1 max-h-0 overflow-hidden opacity-0'
          "
        >
          <SocialCommentsBubble class="question" :body="postItem.content" />

          <div
            v-if="postItem.files?.length"
            class="flex items-center gap-3 overflow-hidden transition-all"
            :class="
              open ? 'max-h-36 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'
            "
          >
            <img
              v-for="file in postItem.files"
              :key="file.id"
              class="aspect-video h-24 rounded object-cover"
              :src="file.url"
            />
          </div>
        </div>
        <div class="flex w-full items-center justify-between text-13">
          <div class="flex items-center gap-2 text-white/50">
            <!-- <div>{{ item.lectureReference }}</div>
            <div class="w-0.5 h-0.5 rounded-full bg-white/50"></div> -->
            <div>
              {{ $t('space.activity.title') }}
              <span class="text-white">
                {{ timeAgo(postItem.updatedAt) }}
              </span>
            </div>
            <!-- <CourseQaPeople
              :people-active="postItem.peopleActive"
              :number-of-users="postItem.numberOfUsers"
            /> -->
          </div>
        </div>
        <div
          v-if="postItem.status === 'solved'"
          class="solved-bg absolute right-0 top-0 flex items-center gap-2 rounded-bl rounded-tr px-2 py-1 text-13"
        >
          <div
            class="flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs"
          >
            <i class="fa-solid fa-check text-[#295d1b]" />
          </div>
          {{ $t('course.question.status.solved') }}
        </div>
      </div>
      <div
        class="next-icon absolute -bottom-12 left-0 right-0 flex h-12 w-full items-center justify-center rounded-b text-13"
        :class="open ? 'bg-white/5 backdrop-blur-lg' : 'bg-[#020202]'"
      >
        <div
          v-if="open"
          class="flex cursor-pointer flex-col items-center leading-none transition-all active:scale-95"
          data-cy="c5cf8aec15264aba"
          @click.stop="open = false"
        >
          <BaseNext class="-rotate-90" />
          <div>
            {{ $t('post.show.less') }}
          </div>
        </div>
        <div
          v-else
          class="flex cursor-pointer flex-col items-center leading-none transition-all active:scale-95"
          data-cy="fec17d5cb2c59735"
          @click.stop="open = true"
        >
          <div>
            {{ $t('post.show.more') }}
          </div>
          <BaseNext class="rotate-90" />
        </div>
      </div>
      <div
        v-if="postItem.status === 'solved'"
        class="absolute bottom-4 right-5 z-0 h-12 w-1/2 rounded bg-[#56a33e] blur-xl"
      />
    </div>
    <SocialCommentsBorder :item="postItem" />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { socialStore, profileStore };
  },
  data() {
    return {
      open: true,
    };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    user() {
      return this.postItem.owner;
    },
  },
  methods: {
    onReplyClick() {
      this.socialStore.answerTo = this.postItem;
      this.socialStore.answerReplying = true;
    },
    handleUserClick() {
      this.profileStore.gotoProfilePage(this.user);
    },
  },
};
</script>
<style scoped>
.solved-bg {
  background: linear-gradient(180deg, #11a710 0%, rgba(17, 167, 16, 0) 100%);
}
</style>
