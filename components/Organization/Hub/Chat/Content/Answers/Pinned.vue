<template>
  <div
    v-if="messages.length"
    class="relative flex h-[3rem] bg-black px-2 text-white/50"
  >
    <div class="flex flex-col gap-0.5 py-1">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="w-0.5 flex-1"
        :class="i === swiper?.activeIndex ? 'bg-[#E4B53D]' : 'bg-[#808080]'"
      />
    </div>
    <Swiper
      ref="swiper"
      :direction="'vertical'"
      :options="swiperOptions"
      style="margin-left: initial; display: flex; flex: 1"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="(msg, index) in messages" :key="index">
        <div
          class="flex h-full cursor-pointer flex-col truncate px-2 text-sm"
          @click="locatePinnedMessage(msg.id, index)"
        >
          <div class="text-[#E4B53D]">
            {{ $t('org.activity.message.pinnedM') }}
          </div>
          <div class="flex flex-1 gap-1.5">
            <template v-if="msg.attachments && msg.attachments.length > 0">
              <div v-if="msg.attachments[0].category === 'file'">
                <BaseEditorAttachment
                  :files="[msg.attachments[0]]"
                  :is-close="false"
                  size="sm"
                />
              </div>
              <img
                v-else-if="msg.attachments[0].mimetype.includes('image')"
                class="mr-1 max-h-6 cursor-pointer rounded-sm object-cover"
                :src="msg.attachments[0].url"
              />
              <video
                v-else-if="msg.attachments[0].mimetype.includes('video')"
                class="mr-1 max-h-6 cursor-pointer rounded-sm object-cover"
                :src="msg.attachments[0].url"
              />
            </template>
            <div v-if="msg.loomUrls && msg.loomUrls.length > 0">Loom</div>
            <div
              style="word-break: break-word"
              class="truncate"
              v-html="msg.content.replace(/<[^>]*>/g, '') || msg.text"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <BaseIconClose
      v-if="!loading"
      class="h-8 w-8 flex-shrink-0"
      data-cy="9150c546ec8b6be3"
      @click="onUnpin"
    />
    <div v-else class="flex h-8 w-8 flex-shrink-0 items-center justify-center">
      <i class="fa-light fa-loader animate-spin text-base" />
    </div>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    roomId: String,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      loading: false,
      currentId: null,
      swiper: null,
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: false,
        direction: 'vertical',
        mousewheel: {
          invert: true,
        },
      },
      index: 0,
    };
  },
  computed: {
    messages() {
      const room = this.hubChatStore.pinnedMessages.find(
        (r) => r.id === this.roomId,
      );

      return room
        ? room.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          )
        : [];
    },
    canPin() {
      return (
        this.hubChatStore.chatInfo?.userRole === 'chat-room-owner' ||
        this.hubChatStore.chatInfo?.userRole === 'chat-room-admin'
      );
    },
  },
  mounted() {
    this.swiper?.slideTo(this.messages.length - 1);
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
      this.swiper.slideTo(this.messages.length - 1, 0);
    },
    onSlideChange(swiper) {
      this.index = swiper.activeIndex;
    },
    locatePinnedMessage(id) {
      if (this.loading) {
        return;
      }
      this.$emit('locate-pinned-message', id);
      const prev = this.swiper.activeIndex;
      this.swiper.slidePrev();
      if (prev === 0) {
        this.swiper.slideTo(this.messages.length - 1);
      }
    },
    async onUnpin() {
      this.loading = true;
      await this.hubChatStore.deleteRoomPinnedMessage({
        roomId: this.roomId,
        messageIds: [this.messages[this.swiper.activeIndex].id],
      });
      this.loading = false;
    },
  },
};
</script>
