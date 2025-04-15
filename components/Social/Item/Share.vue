<template>
  <div
    ref="share"
    class="relative w-[29rem] rounded border border-[#565656]/40 px-6 transition-all md:px-0"
  >
    <div class="flex items-center justify-between rounded-t bg-black px-4 py-2">
      <div class="flex items-center font-semibold">
        <img src="~/assets/social/share-logo.svg" class="mr-4 h-4 w-4" alt="" />
        {{ $t('meet.banner.share.with') }}
      </div>
      <!-- <div
        @click="socialStore.shareId = null"
        class="group border border-[#565656]/20 bg-[#070707] shadow-[0px_4px_4px_rgba(0,0,0,0.6)] rounded p-2 cursor-pointer transition-all duration-300 hover:border-white" data-cy="c5251483bd9812ff">
        <img
          src="~/assets/social/option-close.svg"
          class="w-3 h-3 transition-all duration-300 group-hover:rotate-90 group-hover:scale-125"
          alt=""
        />
      </div> -->
    </div>
    <div class="absolute left-0 top-10 z-10 w-full px-8 md:!px-4">
      <div
        class="shadow-[0px_4px_4px_rgba(0,0,0,0.4) relative flex items-center overflow-hidden rounded bg-black pl-2 pr-6"
        :class="inputHover ? 'border-anim' : ''"
        @mouseenter="!searchFocus && (inputHover = true)"
        @mouseleave="inputHover = false"
      >
        <input
          v-model="searchValue"
          :placeholder="$t('post.users.search')"
          class="h-[1.375rem] w-full cursor-pointer rounded bg-transparent text-xs outline-none transition-all"
          autocomplete="off"
          type="text"
          data-cy="58fb5116cb6b7ed8"
          @focus="
            searchFocus = true;
            inputHover = false;
          "
          @blur="searchFocus = false"
          @input="handleSearchValue"
          @keydown.enter="handleSearchValue"
        />
        <span
          v-if="searchValue"
          class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm"
          data-cy="708efe8bc8fd8dc3"
          @click.stop="onClose"
        >
          <i class="fa-regular fa-xmark" />
        </span>
        <div class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full" />
      </div>
    </div>
    <div class="relative h-52 bg-black px-2 pb-10 pt-8 text-xs backdrop-blur">
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar h-full w-full overflow-hidden overflow-y-auto"
      >
        <div
          v-for="item in members"
          :key="item.id"
          class="group relative mb-[0.375rem] flex h-[2.375rem] items-center px-2 after:absolute after:left-0 after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
          :class="
            checkeds.includes(item.id) ? 'after:h-full after:opacity-100' : ''
          "
        >
          <div
            class="mr-5 h-[1.625rem] w-[1.625rem] overflow-hidden rounded"
            data-ref="share"
            @mouseenter="onMouseenter($event, item)"
            @mouseleave="onMouseleave"
          >
            <BaseAvatarNext
              :picture="item.picture"
              size="sm"
              :show-online="false"
            />
          </div>
          {{ item.fullName }}
          <div
            class="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-sm border opacity-0 transition-all duration-300 active:scale-95 group-hover:opacity-100"
            :class="checkeds.includes(item.id) ? 'bg-white opacity-100' : ''"
            data-cy="788c090fd5699da3"
            @click="onChecked(item.id)"
          >
            <img
              v-if="checkeds.includes(item.id)"
              src="~/assets/social/checked.svg"
              class="object-cover"
              alt=""
            />
          </div>
        </div>
        <BaseSkeleton v-show="loading" :length="4" />
      </div>
    </div>
    <div
      class="absolute bottom-0 left-0 flex w-full items-center justify-between rounded-b bg-black px-8 py-2 md:!px-4"
    >
      <div class="flex h-full items-center">
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#1877F2]"
        >
          <img src="~/assets/social/share-social1.svg" class="h-4 w-4" alt="" />
        </div>
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#B73291]"
        >
          <img src="~/assets/social/share-social2.svg" class="h-4 w-4" alt="" />
        </div>
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#F1F1F1]"
        >
          <img src="~/assets/social/share-social3.png" class="h-4 w-4" alt="" />
        </div>
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#42D54B]"
        >
          <img src="~/assets/social/share-social4.svg" class="h-4 w-4" alt="" />
        </div>
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#26A4E3]"
        >
          <img src="~/assets/social/share-social5.svg" class="h-4 w-4" alt="" />
        </div>
        <div
          class="mr-3 cursor-pointer rounded border border-[#0B0B0B] bg-[#0B0B0B] p-0.5 transition-all hover:border-[#F1F1F1]"
        >
          <img src="~/assets/social/share-social6.svg" class="h-4 w-4" alt="" />
        </div>
      </div>
      <div
        class="cursor-pointer rounded border border-[#565656]/20 bg-[#070707] p-1 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white"
      >
        <img src="~/assets/social/share-send.svg" class="h-3 w-3" alt="" />
      </div>
    </div>
    <SocialItemUser
      :style="userStyle"
      :item="userItem"
      @mouseenter="onUserMouseenter"
      @mouseleave="onMouseleave"
    />
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const globalStore = useGlobalStore();
    const socialStore = useSocialStore();
    return { socialStore, globalStore };
  },
  data() {
    return {
      searchFocus: false,
      list: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
      ],
      checkeds: [],
      animation: false,
      userStyle: {
        top: 0,
        opacity: 0,
      },
      userItem: null,
      inputHover: false,
      next: null,
      members: [],
      loading: false,
      timer: null,
      searchValue: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
    this.init();
  },
  methods: {
    async init() {
      this.next = null;
      this.members = [];
      this.load();
    },
    async load() {
      this.loading = true;
      const {
        data,
        cursor: { next },
      } = await this.globalStore.searchProfile({
        next: this.next,
        limit: 20,
        text: this.searchValue,
      });
      this.next = next;
      this.members = [...this.members, ...data];
      this.loading = false;
    },
    handleSearchValue() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
    onChecked(id) {
      const index = this.checkeds.indexOf(id);
      if (index === -1) {
        this.checkeds.push(id);
      } else {
        this.checkeds.splice(index, 1);
      }
    },
    onMouseenter(e, item) {
      const share = this.$refs.share.getBoundingClientRect();
      const target = e.target.getBoundingClientRect();
      this.userStyle.top = `${target.top - share.top + 13}px`;
      this.userStyle.opacity = 1;
      this.userItem = item;
    },
    onMouseleave() {
      this.userStyle.opacity = 0;
    },
    onUserMouseenter() {
      this.userStyle.opacity = 1;
    },
    onClose() {
      this.searchValue = '';
      this.init();
    },
  },
};
</script>
