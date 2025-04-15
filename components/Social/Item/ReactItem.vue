<template>
  <div class="relative z-10 flex h-10 justify-between py-2 pl-4 pr-2 text-xs">
    <div class="flex items-center">
      <SocialItemReactLoad
        v-for="react in reactions"
        :id="item.id"
        :key="react.reaction"
        :item="item"
        :name="react.reaction"
        @react-hover="handleReactHover"
      />
      <!-- <SocialItemReact name="Angry" :id="item.id" />
      <SocialItemReact name="Like" :id="item.id" />
      <SocialItemReact name="Funny" :id="item.id" />
      <SocialItemReact name="Sad" :id="item.id" /> -->
      <SocialItemReactLoad
        v-if="reactionsCount"
        :id="item.id"
        :item="item"
        :number="reactionsCount"
        @react-hover="handleReactHover"
      />
    </div>
    <div class="flex items-center">
      <div
        v-if="item.numberOf.comments"
        class="group flex cursor-pointer underline-offset-2 transition-all hover:underline"
        data-cy="9bb2775c3a853d76"
        @click="handleCommentClick"
      >
        <div class="transition-all group-hover:font-bold">
          {{ item.numberOf.comments }}&nbsp;
        </div>
        <div
          class="mr-3 text-[#707070] transition-all group-hover:text-[#f1f1f1]"
        >
          {{ $t('flux.comment.plural') }}
        </div>
      </div>
      <div
        v-if="item.numberOf.shares"
        class="group flex w-[3.875rem] underline-offset-2 transition-all hover:underline"
      >
        <div class="transition-all group-hover:font-bold">
          {{ item.numberOf.shares }}&nbsp;
        </div>
        <div
          class="mr-3 text-[#707070] transition-all group-hover:text-[#f1f1f1]"
        >
          {{ $t('course.share') }}
        </div>
      </div>
    </div>
    <div class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full" />
  </div>
</template>
<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
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
    async getReactionUserData() {
      if (this.item[_REACT_USERLIST_CACHE]) {
        return this.item[_REACT_USERLIST_CACHE];
      }

      const params = {
        entityId: this.item.id,
        limit: 0, // get all reactions
        sortDirection: this.socialStore.sortDirection,
      };

      return new Promise(async (resolve) => {
        try {
          const { data } = await this.socialStore.getAllReaction(params);
          this.item[_REACT_USERLIST_CACHE] = data || [];
          // reset new reactions detail
          const { typeCount, totalCount } = (data || []).reduce(
            (acc, { type }) => {
              acc.typeCount[type] = (acc.typeCount[type] || 0) + 1;
              acc.totalCount++;
              return acc;
            },
            { typeCount: {}, totalCount: 0 },
          );
          this.item.numberOf.reactionsCount = totalCount;
          this.item.numberOf.reactions = typeCount;
          resolve(data);
        } catch (error) {
          resolve([]);
        }
      });
    },
    handleCommentClick() {
      this.$emit('onCommentClick');
    },
  },
};
</script>
