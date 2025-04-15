<template>
  <div class="relative flex h-full w-full flex-col bg-[#101010]">
    <BasePlayer
      class="recommend-player relative z-0 w-full flex-1"
      :class="active ? '' : 'pointer-events-none'"
      :option="option"
      @get-instance="getInstance"
    />
    <div
      v-if="!isOwner"
      class="flex items-center justify-between px-2 py-2 text-xs md:px-4 md:text-sm"
    >
      <div class="flex cursor-pointer items-center gap-2">
        <i class="fa-solid fa-heart-circle-plus" />
        {{ $t('course.favorite.add') }}
      </div>
      <div class="flex cursor-pointer items-center gap-2 text-white/50">
        {{
          $t('course.membership.buy.label', {
            amount: moneyFormat(course.billing?.totalPrice || 0),
          })
        }}
        <BaseButton
          :size="$device.isMobile ? 'small' : 'large'"
          :color="$device.isMobile ? '!px-2' : '!px-6'"
          data-cy="a2eb28097a8287e0"
          @click="onCheckout"
        >
          <i
            v-if="purchasing"
            class="fa-solid fa-spinner animate-spin text-xs"
          />
          {{ $t('course.membership.buy.now') }}
        </BaseButton>
      </div>
    </div>
    <div
      ref="info"
      class="absolute left-2 z-10 flex w-full items-center gap-2 transition-all duration-200"
      :class="control ? 'bottom-16' : 'bottom-4'"
    >
      <BaseAvatarNext
        :show-online="false"
        size="md"
        :picture="course.owner?.picture"
      />
      <div class="w-0 flex-1 pr-12 text-white">
        <div class="truncate text-xs md:text-sm">
          {{ course.owner.name }}
        </div>
        <div
          class="pointer-events-auto max-w-96 cursor-pointer truncate text-sm font-semibold hover:underline md:text-base"
          @click="onTitleClick"
        >
          {{ course.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const paymentStore = usePaymentStore();
    return { authStore, courseStore, paymentStore };
  },
  data() {
    return {
      art: null,
      control: true,
      purchasing: false,
      option: {
        url: this.course.trailer?.url || '',
        poster: this.course.thumbnail?.url || '',
        thumbnails: {
          url: this.course.trailer?.metadata?.framingPath || '',
          number: 100,
          column: 10,
        },
        playbackRate: true,
        aspectRatio: true,
        setting: !this.$device.isMobile,
        pip: !this.$device.isMobile,
        flip: true,
        fullscreen: true,
        fullscreenWeb: !this.$device.isMobile,
        miniProgressBar: true,
        lang: 'en',
      },
    };
  },
  computed: {
    isOwner() {
      return (
        this.course.owner?.id === this.authStore.context ||
        this.course.createdBy === this.authStore.context
      );
    },
  },
  watch: {
    active(state) {
      if (this.art) {
        if (!state) {
          this.art.pause();
        }
      }
    },
  },
  methods: {
    async getInstance(art) {
      this.art = art;

      art.layers.add({
        html: this.$refs.info,
        name: 'info',
      });

      art.on('control', (state) => {
        this.control = state;
      });
    },
    onTitleClick() {
      this.$router.push(`/courses/${this.course.id}`);
    },
    async onCheckout() {
      try {
        if (this.purchasing) {
          return;
        }
        this.purchasing = true;
        await this.paymentStore.onCheckout(this.course.id);
        this.purchasing = false;
      } catch (error) {
        this.purchasing = false;
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
.recommend-player {
  .art-layer-info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    pointer-events: none !important;
    background-image: linear-gradient(#0000, #000000c2, #101010);
  }

  .art-bottom {
    background-image: none !important;
  }
}
</style>
