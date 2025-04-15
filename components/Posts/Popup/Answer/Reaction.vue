<template>
  <div
    class="flex cursor-pointer items-center rounded border border-[#565656]/40 bg-[rgba(0,0,0,0.6)] p-0.5 backdrop-blur-sm transition-all duration-300 active:scale-95"
    data-cy="8e90591ff7f062d2"
    @click="handleClickReact"
  >
    <div
      v-if="socialStore.reactionUsersLoading"
      class="absolute -left-1 right-0 flex h-4 items-center justify-center bg-black/50"
    >
      <i class="fa-solid fa-spinner animate-spin text-xs" />
    </div>
    <div
      v-for="react in reactions.reactions"
      :key="react.reaction"
      class="-ml-1 flex h-3 w-3 items-center justify-center transition-all duration-300 first:!ml-0 group-hover/item:-ml-0.5"
    >
      <img :src="react.url" class="object-contain" alt="" />
    </div>

    <div class="ml-2 text-xs">{{ reactions.allCount }}</div>
  </div>
</template>
<script>
// import Heart from '~/assets/icons/heart.svg';
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
    reactions: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, fluxesStore };
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    // reactions() {
    //   const imgs = {
    //     Like: Heart,
    //     Lovely: Lovely,
    //     Angry: Angry,
    //     Funny: Funny,
    //     Sad: Sad,
    //   };
    //   return this.item.reactions.map((r) => {
    //     r.url = imgs[r.reaction];
    //     return r;
    //   });
    // },
  },
  methods: {
    async handleClickReact() {
      if (this.socialStore.reactionUsersLoading) {
        return;
      }
      this.socialStore.reactionUsersLoading = true;
      await this.getReactionUserData();
      this.socialStore.reactionUsersLoading = false;
      this.socialStore.commentsReactPopup = true;
      this.socialStore.commentsReactPopupData = this.item;
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
            type: 'comment',
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
  },
};
</script>
