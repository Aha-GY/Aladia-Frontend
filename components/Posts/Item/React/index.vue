<template>
  <div
    v-if="shouldShowReactions"
    class="__post-item-reactions mb-2 flex items-center justify-between gap-8"
  >
    <div class="relative z-10 flex h-6 gap-3 text-xs leading-6">
      <div v-if="reactionsCount" class="flex items-center">
        <PostsItemReactMain
          v-for="react in reactions"
          :id="item.id"
          :key="react.reaction"
          :item="item"
          :name="react.reaction"
          :un-hover="hoverReactionHide"
          class="-ml-2 first:ml-0"
          :data-cy="`${dataCy}-${react.reaction}`"
          @react-hover="handleReactHover"
          @mouseenter="showHoverBox(false)"
        />
        <PostsItemReactMain
          v-if="reactionsCount"
          :id="item.id"
          :item="item"
          :un-hover="hoverReactionCountHide"
          :number="reactionsCount"
          :data-cy="`${dataCy}`"
          @react-hover="handleReactHover"
          @mouseenter="showHoverBox(true)"
        />
      </div>
      <div
        v-if="item.numberOf?.reposts"
        class="flex h-6 items-center gap-2 text-sm text-[#B0B0B0]"
      >
        <i class="fa-light fa-arrows-retweet" />
        <p>{{ item.numberOf?.reposts }}</p>
      </div>
    </div>
    <div
      class="flex flex-auto items-center justify-end gap-4 text-sm text-[#B0B0B0]"
    >
      <div
        v-if="item.numberOf?.comments"
        class="group flex cursor-pointer whitespace-nowrap underline-offset-2 transition-all hover:text-[#B0B0B0] hover:underline"
        data-cy="f7d90a5505737dab"
        @click="handleCommentClick"
      >
        <div>{{ item.numberOf.comments }}&nbsp;</div>
        <div>{{ $t('post.comments') }}</div>
      </div>
      <div
        v-if="item.numberOf?.shares"
        class="group flex whitespace-nowrap underline-offset-2 transition-all group-hover:text-[#B0B0B0]"
      >
        <div>{{ item.numberOf.shares }}&nbsp;</div>
        <div>{{ $t('post.shares') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
    dataCy: {
      type: String,
      default: 'default',
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, fluxesStore };
  },
  data() {
    return {
      hoverReactionHide: true,
      hoverReactionCountHide: true,
    };
  },
  computed: {
    shouldShowReactions() {
      return (
        this.item?.numberOf?.reactionsCount > 0 ||
        this.item?.numberOf?.reposts > 0 ||
        this.item?.numberOf?.comments > 0 ||
        this.item?.numberOf?.shares > 0
      );
    },
    reactions() {
      if (!this.item?.numberOf?.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.numberOf.reactions) {
        const count = this.item.numberOf.reactions[key];
        if (count && count > 0) {
          reactions.push({
            reaction: key,
            count,
          });
        }
      }
      return reactions;
    },
    reactionsCount() {
      return this.item?.numberOf?.reactionsCount || 0;
    },
  },
  methods: {
    async handleReactHover() {
      if (this.socialStore.reactionUsersLoading) {
        return;
      }
      this.socialStore.reactionUsersLoading = true;
      await this.getReactionUserData();
      this.socialStore.reactionUsersLoading = false;
    },
    showHoverBox(reaction) {
      if (reaction) {
        this.hoverReactionCountHide = false;
        this.hoverReactionHide = true;
      } else {
        this.hoverReactionCountHide = true;
        this.hoverReactionHide = false;
      }
    },
    async getReactionUserData() {
      if (this.item[_REACT_USERLIST_CACHE]) {
        return this.item[_REACT_USERLIST_CACHE];
      }

      return new Promise(async (resolve) => {
        try {
          const { data } = await this.fluxesStore.getSocialReactionList({
            id: this.item.id,
            reaction: undefined,
            type: 'post',
            sortDirection: this.socialStore.sortDirection,
            limit: 0,
          });
          this.item[_REACT_USERLIST_CACHE] = data || [];
          resolve(data);
        } catch (error) {
          resolve([]);
        }
      });
    },
    handleCommentClick() {
      this.$emit('show-popup');
    },
  },
};
</script>
