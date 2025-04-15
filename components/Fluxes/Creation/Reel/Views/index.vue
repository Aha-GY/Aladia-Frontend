<template>
  <div v-if="list.length">
    <div
      class="relative flex h-8 w-10 cursor-pointer items-center justify-center"
    >
      <SocialReactionAvatars
        v-for="(user, index) in list.slice(0, 2)"
        :key="index"
        :name="user.reaction"
        :viewer="user?.owner"
        :is-image="true"
        :story-id="user.id"
        :class="[
          reactCountFormat > 1 && !reactionLoading
            ? 'absolute -mr-2 first:z-10 first:!-ml-5 last:z-0'
            : 'absolute',
        ]"
      />
    </div>
    <div class="text-shadow mt-1 w-full text-center text-xs text-[#f1f1f1f1]">
      {{ reactCountFormat }}
    </div>
  </div>
  <div v-else>
    <div
      class="relative flex h-8 w-8 cursor-pointer items-center justify-center"
    >
      <i class="fa-solid fa-eye text-shadow text-[#f1f1f1f1]" />
    </div>
    <div class="text-shadow mt-1 w-full text-center text-xs text-[#f1f1f1f1]">
      {{ reactCountFormat }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
  },
  data() {
    return {
      list: [],
      reactionLoading: false,
      totalCount: 0,
      next: null,
    };
  },
  computed: {
    reactCountFormat() {
      console.log('here');
      const number = ~~this.totalCount;
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
  },
  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.reactionLoading = true;
      try {
        const {
          data,
          cursor: { next, totalItems },
        } = await this.fluxesStore.getSocialReactionList({
          id: this.item.id,
          reaction: undefined,
          type: 'reel',
          sortDirection: 'desc',
          limit: 20,
          next: this.next,
        });

        const reactedUsers = data.filter((item) => item.reaction !== null);
        const noneReactedusers = data.filter((item) => item.reaction === null);
        this.list = [...reactedUsers, ...noneReactedusers];
        this.next = next;
        this.totalCount = totalItems;
      } catch (e) {
        console.log(e);
      } finally {
        this.reactionLoading = false;
      }
    },
  },
};
</script>
