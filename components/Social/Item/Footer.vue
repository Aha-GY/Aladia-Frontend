<template>
  <div class="flex h-10 items-center justify-around text-sm">
    <div
      class="group relative h-10 w-20"
      @mouseenter="onMouseenterGroup"
      @mouseleave="onMouseleaveGroup"
    >
      <div
        class="flex h-10 cursor-pointer items-center transition-all active:scale-95"
        data-cy="f83c303ac5a12d89"
        @click="onClickReact"
      >
        <div ref="react" class="mr-4">
          <SocialItemReact
            :id="item.id"
            :name="nowReactIcon"
            :un-hover="true"
            :un-background="true"
          />
        </div>

        <div
          class="underline-offset-4 transition-all group-hover:font-semibold group-hover:underline"
          :style="{ color: hoverClass }"
        >
          {{ nowReact }}
        </div>
      </div>

      <div
        class="absolute -top-4 left-1/2 z-10 -translate-x-1/2 scale-0 opacity-0 backdrop-blur-sm transition-all duration-300"
        :class="
          reactboxHover
            ? '-translate-x-[6.8rem] -translate-y-7 scale-100 opacity-100'
            : ''
        "
        @mouseenter="reactHover = true"
        @mouseleave="reactHover = false"
      >
        <SocialCommentsReaction
          @on-mouseenter="onMouseenter"
          @on-change="onChangeReact"
        />
      </div>
    </div>

    <slot />

    <el-popover
      trigger="click"
      :show-arrow="false"
      popper-class="-translate-x-[18.1rem]"
      :popper-style="{
        border: 'none',
        background: 'transparent',
        'box-shadow': 'none',
        padding: '0',
      }"
      @hide="handleShareVisible(false)"
      @show="handleShareVisible(true)"
    >
      <template #reference>
        <div class="group flex cursor-pointer transition-all active:scale-95">
          <img
            src="~/assets/social/Share.svg"
            class="mr-4 block transition-all group-hover:hidden"
            alt=""
          />
          <img
            src="~/assets/social/Share-hover.svg"
            class="mr-4 hidden transition-all group-hover:block"
            alt=""
          />
          <div class="underline-offset-2 transition-all group-hover:underline">
            {{ $t('post.content.share') }}
          </div>
        </div>
      </template>
      <div>
        <SocialItemShare v-if="isShareContentVisible" :item="item" />
      </div>
    </el-popover>
  </div>
</template>
<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    return { socialStore, authStore };
  },
  data() {
    return {
      reactHover: false,
      reactboxHover: false,
      isHover: false,
      clickLoading: false,
      isShareContentVisible: false,
    };
  },
  computed: {
    nowReact() {
      return this.reactHover
        ? this.item.tempReact || this.item.userReaction?.type || 'clap'
        : this.item.userReaction?.type || 'clap';
    },
    nowReactIcon() {
      return this.reactHover
        ? this.item.tempReact || this.item.userReaction?.type || 'Frame'
        : this.item.userReaction?.type || 'Frame';
    },
    hoverClass() {
      const colors = {
        Like: '#FEFFD8',
        Lovely: '#FFA0A0',
        Angry: '#FFD9A0',
        Funny: '#FDFFA0',
        Sad: '#686868',
        Frame: '',
      };
      return `${colors[this.nowReactIcon]}`;
    },
  },
  methods: {
    onMouseenter(react) {
      this.item.tempReact = react;
    },
    async createReaction(originReact, react) {
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'post',
            },
          })
          .then((res) => {
            this.item.userReaction = {
              id: res.id,
              type: react,
            };
            this.item.numberOf && this.item.numberOf.reactionsCount++;
            if (this.item.numberOf && this.item.numberOf.reactions) {
              this.item.numberOf.reactions[react] =
                (this.item.numberOf.reactions[react] || 0) + 1;
            }
            if (this.item[_REACT_USERLIST_CACHE]) {
              this.item[_REACT_USERLIST_CACHE] = [
                ...this.item[_REACT_USERLIST_CACHE],
                res,
              ];
            }
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async removeReaction(originReact, react) {
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'post',
            },
          })
          .then(() => {
            this.item.userReaction = null;
            this.item.numberOf && this.item.numberOf.reactionsCount--;
            this.item.numberOf && this.item.numberOf.reactions[react]--;
            if (this.item[_REACT_USERLIST_CACHE]) {
              const index = this.item[_REACT_USERLIST_CACHE].findIndex(
                (user) => user.owner.id === this.$route.params.name,
              );

              if (index !== -1) {
                this.item[_REACT_USERLIST_CACHE].splice(index, 1);
              }
            }
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async updateReaction(originReact, react) {
      const oldReact = originReact.type;
      try {
        await this.socialStore
          .updateReaction({
            id: originReact.id,
            type: react,
          })
          .then((res) => {
            this.item.numberOf && this.item.numberOf.reactions[oldReact]--;
            if (this.item.numberOf && this.item.numberOf.reactions) {
              this.item.numberOf.reactions[react] =
                (this.item.numberOf.reactions[react] || 0) + 1;
            }
            if (this.item[_REACT_USERLIST_CACHE]) {
              const index = this.item[_REACT_USERLIST_CACHE].findIndex(
                (user) => user.owner.id === this.$route.params.name,
              );

              if (index !== -1) {
                this.item[_REACT_USERLIST_CACHE][index] = res;
              }
            }
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async onChangeReact(react, event) {
      if (this.clickLoading) {
        return;
      }
      this.clickLoading = true;
      this.reactboxHover = false;
      const oldReact = cloneDeep(this.item.userReaction);
      // Initialize userReaction data. When there is no data, it is null. When there is data, it is {id: 'xxx', type: 'xx'}
      if (!oldReact) {
        this.item.userReaction = {
          type: react,
          id: '',
        };
      } else {
        const cloneReact = this.item.userReaction;
        cloneReact.type = react;
        this.item.userReaction = cloneReact;
      }
      const target = event.target.getBoundingClientRect();
      const originTaget = this.$refs.react.getBoundingClientRect();
      this.socialStore.reactSelect = {
        name: react,
        target,
        originTarget: originTaget,
      };

      try {
        if (!oldReact) {
          // if !oldReact, it means user has not reacted yet
          await this.createReaction(oldReact, react);
        } else if (oldReact === react) {
          // if oldReact === react, it means user has reacted with the same reaction, so we should remove it
          await this.removeReaction(oldReact, react);
        } else {
          // update reaction
          await this.updateReaction(oldReact, react);
        }
      } finally {
        this.clickLoading = false;
      }
    },
    async onClickReact() {
      if (this.clickLoading) {
        return;
      }
      this.clickLoading = true;
      const oldReact = cloneDeep(this.item.userReaction);

      if (this.nowReactIcon === 'Frame') {
        await this.createReaction(oldReact, 'clap').finally(() => {
          this.clickLoading = false;
        });
      } else {
        await this.removeReaction(oldReact, this.nowReactIcon).finally(() => {
          this.clickLoading = false;
        });
      }
    },
    async onMouseenterGroup() {
      this.isHover = true;
      await sleep(500);
      if (this.isHover) {
        this.reactboxHover = true;
      }
    },
    onMouseleaveGroup() {
      this.item.tempReact = '';
      this.isHover = false;
      this.reactboxHover = false;
    },
    handleShareVisible(status) {
      this.isShareContentVisible = status;
    },
  },
};
</script>
