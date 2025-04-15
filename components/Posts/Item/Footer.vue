<template>
  <div
    class="__post-item-footer relative z-10 flex items-center justify-around text-sm"
    :class="isSearch ? '' : 'border-t-[1px] border-[#3D3D3D] pt-4'"
  >
    <div
      class="group relative flex w-1/3 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-transparent py-1 leading-5 transition-all hover:bg-[#B0B0B0]/10 active:scale-95"
      @mouseenter="onMouseenterGroup"
      @mouseleave="onMouseleaveGroup"
    >
      <div
        class="flex cursor-pointer items-center"
        :data-cy="`${dataCy}-post-react-button`"
        @click="onClickReact"
      >
        <div ref="react" :class="nowReactIcon !== 'Frame' ? 'mr-2' : ''">
          <PostsItemReactItem
            :id="item.id"
            class="group-active:text-[#E0B92C]"
            :name="nowReactIcon"
            :un-hover="true"
            :un-background="true"
          />
        </div>

        <div :style="{ color: hoverClass }">
          {{ nowReact }}
        </div>
      </div>

      <div
        class="absolute -top-4 left-1/2 z-10 scale-0 opacity-0 backdrop-blur-sm transition-all duration-300"
        :class="{
          '-translate-x-1/2': !reactboxHover,
          '-translate-y-7 scale-100 opacity-100': reactboxHover,
          '-translate-x-[6.8rem]': reactboxHover && !isSearch,
          '-translate-x-[4.5rem]': isSearch,
        }"
        @mouseenter="reactHover = true"
        @mouseleave="reactHover = false"
      >
        <PostsWidgetsReactionList
          class="backdrop-blur-sm"
          :data-cy="`${dataCy}-post-react-list`"
          @on-mouseenter="onMouseenter"
          @on-change="onChangeReact"
        />
      </div>
    </div>

    <template v-if="item.type === 'question'">
      <div
        v-if="item.status === 'solved'"
        class="group relative flex w-1/3 cursor-pointer items-center justify-center whitespace-nowrap rounded-[0.3125rem] bg-transparent py-1 leading-5 text-[#B0B0B0] transition-all hover:bg-[#B0B0B0]/10 active:scale-95 active:text-[#E0B92C]"
        data-cy="0dbe007d3f135f66"
        @click="handleShowDetail"
      >
        <span
          class="block opacity-100 group-hover:hidden group-hover:opacity-0"
        >
          <i class="fa-regular fa-lightbulb-on mr-2" />
        </span>
        <span
          class="hidden opacity-0 group-hover:block group-hover:opacity-100"
        >
          <i class="fa-solid fa-lightbulb-on mr-2" />
        </span>
        {{ $t('post.question.solved') }}
      </div>

      <div
        v-if="item.status !== 'solved'"
        class="group relative flex w-1/3 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-transparent py-1 leading-5 text-[#B0B0B0] transition-all hover:bg-[#B0B0B0]/10 active:scale-95 active:text-[#E0B92C]"
        data-cy="12c5982a0825372e"
        @click="handleShowDetail"
      >
        <span
          class="block opacity-100 group-hover:hidden group-hover:opacity-0"
        >
          <i class="fa-regular fa-lightbulb mr-2" />
        </span>
        <span
          class="hidden opacity-0 group-hover:block group-hover:opacity-100"
        >
          <i class="fa-solid fa-lightbulb mr-2" />
        </span>
        {{ $t('post.question.solve') }}
      </div>
    </template>

    <div
      v-else
      class="group relative flex w-1/3 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-transparent py-1 leading-5 text-[#B0B0B0] transition-all hover:bg-[#B0B0B0]/10 active:scale-95 active:text-[#E0B92C]"
      :data-cy="`${dataCy}-post-comment-button`"
      @click="handleShowDetail"
    >
      <span class="block opacity-100 group-hover:hidden group-hover:opacity-0">
        <i class="fa-regular fa-comment mr-2" />
      </span>
      <span class="hidden opacity-0 group-hover:block group-hover:opacity-100">
        <i class="fa-solid fa-comment mr-2" />
      </span>
      {{ $t('post.comments') }}
    </div>

    <div
      v-if="!isChat"
      class="group relative flex w-1/3 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-transparent py-1 leading-5 text-[#B0B0B0] transition-all hover:bg-[#B0B0B0]/10 active:scale-95 active:text-[#E0B92C]"
      :data-cy="`${dataCy}-post-share-button`"
      @click="isShareContentVisible = true"
    >
      <span class="block opacity-100 group-hover:hidden group-hover:opacity-0">
        <i class="fa-regular fa-share mr-2" />
      </span>
      <span class="hidden opacity-0 group-hover:block group-hover:opacity-100">
        <i class="fa-solid fa-share mr-2" />
      </span>
      {{ $t('post.share.label') }}
    </div>
    <div
      v-else
      class="group relative flex w-1/3 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-transparent py-1 leading-5 text-[#B0B0B0] transition-all hover:bg-[#B0B0B0]/10 active:scale-95 active:text-[#E0B92C]"
      :data-cy="`${dataCy}-post-share-button`"
      @click="handleShowDetail"
    >
      <span class="block opacity-100 group-hover:hidden group-hover:opacity-0">
        <i class="fa-regular fa-eye mr-2" />
      </span>
      <span class="hidden opacity-0 group-hover:block group-hover:opacity-100">
        <i class="fa-solid fa-eye mr-2" />
      </span>
      {{ $t('post.view.label') }}
    </div>
    <template v-if="isShareContentVisible">
      <PostsItemShare
        :open="isShareContentVisible"
        :item="isRepost ? parentItem : item"
        :parent-item="parentItem"
        @close="isShareContentVisible = false"
      />
    </template>
  </div>
</template>
<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
    isPopup: Boolean,
    isSearch: Boolean,
    isRepost: {
      type: Boolean,
      default: false,
    },
    parentItem: {
      type: Object,
      default: () => ({}),
    },
    dataCy: {
      type: String,
      default: 'default',
    },
    isChat: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, authStore, fluxesStore };
  },
  data() {
    return {
      reactHover: false,
      reactboxHover: false,
      isHover: false,
      clickLoading: false,
      isShareContentVisible: false,
      commentHover: false,
      itemHover: false,
    };
  },
  computed: {
    nowReact() {
      return this.reactHover
        ? this.item.tempReact || this.item.userReaction?.type || 'Like'
        : this.item.userReaction?.type || 'Like';
    },
    nowReactIcon() {
      return this.reactHover ? this.hoverReactName : this.unhoverReactName;
    },
    hoverReactName() {
      return this.item.tempReact || this.item.userReaction?.type || 'Frame';
    },
    unhoverReactName() {
      return this.item.userReaction?.type || 'Frame';
    },
    currItem() {
      return this.item;
    },
    hoverClass() {
      const colors = {
        like: '#FEFFD8',
        lovely: '#FFA0A0',
        angry: '#FFD9A0',
        funny: '#FDFFA0',
        sad: '#686868',
        Frame: '#B0B0B0',
      };
      return `${colors[this.nowReactIcon]}`;
    },
    getColor() {
      return this.item.type === 'question'
        ? this.item.status === 'solved'
          ? '#00CA00'
          : '#c90000'
        : '#f1f1f1';
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
          .deleteSocialReaction({
            id: this.item.id,
            type: 'feed',
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
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'post',
            },
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
      console.log('this is the react', react, oldReact, event);
      try {
        if (!oldReact) {
          // if !oldReact, it means user has not reacted yet
          await this.createReaction(oldReact, react);
        } else if (oldReact?.type === react) {
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
      this.reactboxHover = false;
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
      if (this.clickLoading) {
        return;
      }
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
    handleShowDetail() {
      if (this.isPopup) {
        // 根据需求，当在弹框中点击 “Solve” 按钮时，需要聚焦编辑器输入框
        // 这里分两步来做了两件事：(1) 聚焦编辑器输入框，(2) 设置光标位置到最底部
        // 理论上 (2) 会自动实现 (1)，但由于 (2) 的依赖较多，可能出问题，因此分两步走

        // 这里拿到的是 contenteditable="true" 的元素，用来聚焦
        const eEditorInner = document.querySelector(
          '.__post-popup-input .ql-editor',
        );
        // 不知为何，直接 `import Quill from 'quill'` 会导致 Vite 报错
        // 因此这里借用 Quill.vue 挂载到 window 上的 Quill 类
        const Quill = window.Quill;
        // 这里拿到的是 Quill 实例，用来设置光标位置
        const quill = eEditorInner
          ? Quill?.find(eEditorInner.closest('.quill-editor'))
          : null;
        // console.log('this is the editor', editor);
        if (eEditorInner) {
          eEditorInner.focus();
          if (quill) {
            // 光标移动到最底部
            quill.setSelection(quill.getLength(), 0);
          }
        }
      } else {
        this.$emit('show-popup');
      }
    },
  },
};
</script>
