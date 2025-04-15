<template>
  <div
    class="flex cursor-pointer items-center rounded backdrop-blur-sm transition-all duration-300 active:scale-95"
    data-cy="61a4c6f6347c5442"
    @click="handleClickReact"
  >
    <div
      v-if="socialStore.reactionUsersLoading"
      class="absolute -left-1 right-0 flex h-4 items-center justify-center bg-black/50"
    >
      <i class="fa-solid fa-spinner animate-spin text-xs" />
    </div>

    <div class="relative flex items-center gap-2">
      <div class="ml-2 text-xs text-white">{{ reactions.allCount }}</div>
      <div class="relative flex items-center">
        <div
          v-for="react in reactions.reactions.slice(0, 2)"
          :key="react.reaction"
          class="-ml-[6px] flex h-3 w-3 items-center justify-center transition-all duration-300 first:!ml-0 group-hover/item:-ml-0.5"
        >
          <img :src="react.url" class="object-contain" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
