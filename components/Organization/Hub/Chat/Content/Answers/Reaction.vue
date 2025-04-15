<template>
  <div v-if="total" class="flex flex-wrap gap-2">
    <template v-for="reaction in reactions" :key="reaction.type">
      <client-only>
        <el-popover
          :visible="showReaction[reaction.type]"
          :width="230"
          :show-arrow="true"
          :offset="5"
          placement="top"
          :popper-style="{
            border: 'none',
            borderRadius: '0.3125rem',
          }"
        >
          <template #reference>
            <div
              class="flex shrink-0 cursor-pointer items-center rounded-full bg-white/10 hover:bg-white/15"
              :class="[
                userReaction === reaction.type
                  ? '!bg-[#514410] !text-white/80 hover:!bg-[#766416]'
                  : '',
                reaction.count < 4
                  ? 'gap-5 pl-[0.375rem]'
                  : 'gap-2 px-[0.375rem] py-1',
              ]"
              data-cy="cfa48529aa4f6744"
              @contextmenu.stop.prevent="openReaction(reaction.type)"
              @click.stop.prevent="react(reaction.type)"
            >
              <img :src="reaction.url" class="w-5 object-cover" />
              <div class="flex items-center">
                <template v-if="reaction.count < 4">
                  <BaseAvatarNext
                    v-for="(avatar, index) in reaction.avatars"
                    :key="index"
                    :picture="avatar"
                    :show-online="false"
                    size="sm"
                    class="!-ml-4"
                    :style="{
                      zIndex: 5 - index,
                    }"
                  />
                </template>
                <div v-else class="pr-1 text-white/80">
                  {{ reaction.count }}
                </div>
                <i
                  v-if="loading"
                  class="fa-solid fa-spinner mr-1 animate-spin text-xs"
                />
              </div>
            </div>
          </template>
          <OrganizationHubChatContentAnswersReactionList
            v-if="showReaction[reaction.type]"
            :message-id="item.id"
            :reaction-type="reactionType"
            @hide="showReaction[reaction.type] = false"
          />
        </el-popover>
      </client-only>
    </template>
  </div>
</template>
<script>
// import Heart from '~/assets/icons/heart.svg';
import Angry from '~/assets/social/react/Angry.svg';
import Clap from '~/assets/social/react/Clap.svg';
import Funny from '~/assets/social/react/Funny.svg';
import Lovely from '~/assets/social/react/Lovely.svg';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    item: Object,
    scrollValue: Number,
    userReaction: String,
    changeReaction: Function,
  },
  emits: ['react'],
  setup() {
    const hubChatStore = useHubChatStore();
    const showReaction = ref({
      Like: false,
      Lovely: false,
      Angry: false,
      Funny: false,
      Sad: false,
    });
    return { hubChatStore, showReaction };
  },
  data() {
    return {
      list: [],
      totalUsers: 0,
      loading: false,
      totalReactions: 0,
      reactLoading: false,
    };
  },
  computed: {
    total() {
      return Object.keys(this.item.reactions.count).reduce(
        (acc, cur) => acc + this.item.reactions.count[cur],
        0,
      );
    },
    reactions() {
      const imgs = {
        Like: Clap,
        Lovely,
        Angry,
        Funny,
        Sad,
      };
      if (!this.item.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.reactions.count) {
        const count = this.item.reactions.count[key];
        if (count && count > 0) {
          reactions.push({
            show: false,
            type: key,
            count,
            url: imgs[key],
            avatars:
              this.item.reactions && this.item.reactions.data[key]
                ? this.item.reactions.data[key]
                    .filter((r) => r.reaction === key)
                    .slice(0, 3)
                    .map((r) => r.userProfile.image)
                : [],
          });
        }
      }
      return reactions;
    },
  },
  watch: {
    scrollValue() {
      Object.keys(this.showReaction).forEach((key) => {
        this.showReaction[key] = false;
      });
    },
  },
  methods: {
    openReaction(type) {
      this.reactionType = type;
      this.showReaction[type] = true;
      Object.keys(this.showReaction).forEach((key) => {
        if (key !== type) {
          this.showReaction[key] = false;
        }
      });
    },
    async react(type) {
      await this.changeReaction(type, true);
    },
  },
};
</script>
