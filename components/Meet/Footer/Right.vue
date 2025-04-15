<template>
  <el-popover
    :visible="show"
    trigger="click"
    :show-arrow="false"
    placement="top"
    :width="54"
    popper-class="!min-w-0"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <div ref="btnRef" class="flex items-center" @click="show = !show">
        <el-tooltip
          :disabled="$device.isMobile"
          effect="light"
          :content="$t('meet.option.more')"
          placement="top"
          :hide-after="0"
        >
          <div
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl text-[#FAFAFA]"
            :class="show ? 'bg-white/5' : 'hover:bg-white/5'"
          >
            <i class="fa-regular fa-chevron-up" />
          </div>
        </el-tooltip>
      </div>
    </template>

    <div class="flex flex-col gap-2.5 p-1.5 text-sm text-[#E5E5E5]">
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.footer.emoji.participants')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'user'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          @click="toggleUser"
        >
          <i class="fa-regular fa-people-group" />
          <div
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsPeers.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('course.header.chat')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'chat'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="0392ac634f9a6795"
          @click="toggleChat"
        >
          <i class="fa-regular fa-comments" />
          <div
            v-if="hmsMessages.length"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsMessages.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.footer.emoji.activities')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            ['active', 'poll', 'quiz'].includes(hmsStore.openPopup)
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="b6b9c458ed86306f"
          @click="toggleActive"
        >
          <i class="fa-regular fa-shapes" />
          <div
            v-if="hmsPolls.length"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsPolls.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.settings')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'setting'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="ddcf8ec29764978d"
          @click="toggleSetting"
        >
          <i class="fa-regular fa-gear" />
        </div>
      </el-tooltip>
    </div>
  </el-popover>
</template>
<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    const globalStore = useGlobalStore();
    const btnRef = ref(null);
    const show = ref(false);
    onClickOutside(
      btnRef,
      () => {
        show.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    return { hmsStore, globalStore, btnRef, show };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsPeers() {
      return this.hmsStore.hmsPeers;
    },
    hmsMessages() {
      return this.hmsStore.hmsMessages.filter(
        (msg) => msg.type !== 'EMOJI_REACTION' && !msg.read,
      );
    },
    hmsPolls() {
      return this.hmsStore.hmsPolls.filter(
        (item) => item.visibility && item.state === 'started',
      );
    },
  },
  methods: {
    toggleActive() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'active' ? '' : 'active';
      this.show = false;
    },
    toggleChat() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'chat' ? '' : 'chat';
      this.show = false;
    },
    toggleUser() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'user' ? '' : 'user';
      this.show = false;
    },
    toggleSetting() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'setting' ? '' : 'setting';
      this.show = false;
    },
    handleLength(length) {
      return length > 99 ? '99+' : length;
    },
  },
};
</script>
