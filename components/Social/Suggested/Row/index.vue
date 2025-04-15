<template>
  <div
    ref="rowRef"
    class="relative mb-5 w-full max-w-[42.5rem] overflow-hidden rounded-lg bg-[#060606] px-3"
  >
    <div class="flex w-full items-center justify-between py-2">
      <div class="flex items-center justify-center">
        <BaseIconClose v-if="!showSuggestion" class="mr-4" />
        <div class="my-2">
          <h2
            class="px-2 text-[1rem] font-medium leading-[1.5rem] text-[#FAFAFA]"
          >
            {{ showSuggestion ? `${title}` : $t('category.hidden.label') }}
          </h2>
          <p v-if="!showSuggestion" class="px-2 text-[0.75rem] text-gray-400">
            {{ $t('category.hidden.suggested') }}
          </p>
        </div>
      </div>
      <div v-if="showSuggestion" class="flex items-center justify-center px-2">
        <el-popover
          trigger="click"
          :show-arrow="false"
          placement="bottom-end"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
            borderRadius: '0.375rem',
            minWidth: 'fit-content',
          }"
        >
          <template #reference>
            <div
              class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/5 active:scale-95"
            >
              <i class="fa-light fa-ellipsis z-10" />
            </div>
          </template>
          <div class="popupborder bg-[#060606] p-1">
            <div
              class="flex items-center gap-2 whitespace-nowrap rounded-md bg-black p-1 text-sm text-white hover:cursor-pointer"
              @click="toggleSuggestion"
            >
              <i class="fa-regular fa-eye-slash" />
              <span>
                {{ $t('category.hidden.done') }}
              </span>
            </div>
          </div>
        </el-popover>
      </div>
      <div
        v-if="!showSuggestion"
        class="after:-z-1 relative flex cursor-pointer items-center gap-2 p-1 text-[0.75rem] font-medium leading-[1.125rem] text-[#FAFAFA] transition-all after:absolute after:left-0 after:h-2 after:w-full after:rounded after:bg-[#B0B0B0]/10 after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100 active:scale-95"
        @click="toggleSuggestion"
      >
        {{ $t('base.notification.undo') }}
      </div>
    </div>

    <div
      v-if="showSuggestion"
      ref="cards"
      class="hide-scrollbar flex overflow-x-auto overflow-y-hidden md:overflow-x-hidden"
    >
      <slot />
    </div>

    <BaseButton
      v-if="showSuggestion"
      :label="$t('post.content.more')"
      type="outline"
      size="large"
      class="my-3 mb-4 flex w-full items-center justify-center"
      @click="showMore"
    />

    <div
      v-if="!$device.isMobile && showSuggestion && pages > 1"
      class="pointer-events-none absolute inset-0 z-20 -mb-4 hidden items-center transition-all sm:flex"
    >
      <div
        v-if="page !== 0"
        :class="[
          'pointer-events-auto absolute left-7 top-1/2 -mt-14 flex h-12 w-7 cursor-pointer items-center justify-center',
          type === 'Organizations' ? '-mt-8' : '',
        ]"
        data-cy="f4d7c5d946f405f1"
        @click="onLeftClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
        />
      </div>
      <div
        v-if="page !== pages - 1"
        :class="[
          'pointer-events-auto absolute right-8 top-1/2 -mt-14 flex h-12 w-7 cursor-pointer items-center justify-center',
          type === 'Organizations' ? '-mt-8' : '',
        ]"
        data-cy="90448974e7dfe1ab"
        @click="onRightClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    length: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      page: 0,
      showSuggestion: true,
    };
  },
  computed: {
    pages() {
      if (this.type === 'Organizations') {
        return Math.ceil(this.length / 2);
      }
      return Math.ceil(this.length / 3);
    },
  },
  mounted() {
    useEventListener(window, 'resize', () => {
      const cards = this.$refs.cards;
      if (cards) {
        cards.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  },
  methods: {
    toggleSuggestion() {
      this.showSuggestion = !this.showSuggestion;
    },
    onLeftClick() {
      this.page = Math.max(this.page - 1, 0);
      this.scrollToCard(-1);
    },
    onRightClick() {
      this.page = Math.min(this.page + 1, this.pages - 1);
      this.scrollToCard(1);
    },
    scrollToCard(direction) {
      const cards = this.$refs.cards;
      if (cards) {
        cards.scrollBy({
          left: direction * cards.offsetWidth,
          behavior: 'smooth',
        });
      }
    },
    showMore() {
      if (this.type === 'Users') {
        this.$router.push(`${this.authStore.hub}/suggestion`);
      } else {
        this.$router.push(`${this.authStore.hub}/orgsuggestion`);
      }
    },
  },
};
</script>
