<template>
  <div
    class="absolute left-0 top-0 flex h-full w-full flex-col bg-[#020202] transition-all duration-300"
    :class="hubChatStore.isSetting ? '' : 'translate-x-full'"
  >
    <OrganizationHubChatLeftSideSettingHeader
      :title="title"
      @on-back="onBack"
    />

    <div class="px-7">
      <ClientOnly>
        <el-popover :width="300" trigger="click" placement="bottom">
          <template #reference>
            <div class="mb-3 flex cursor-pointer items-end gap-2">
              <div
                class="flex size-5 items-center justify-center pb-2 text-white/50"
              >
                <div
                  class="size-3 rounded-sm bg-white"
                  :style="{
                    backgroundColor: color,
                  }"
                />
              </div>
              <BaseInput
                ref="color"
                v-model="color"
                readonly
                class="text-white/80! text-sm"
                title="Your Name Color"
                :data-cy="`chat-color-name-${color}`"
              />
            </div>
          </template>
          <LazyBaseColor :color="color" @change="onColorChange" />
        </el-popover>
      </ClientOnly>
    </div>

    <!-- <div v-if="title === 'Settings'" class="px-[1.5625rem] py-1.5">
      <OrganizationHubChatInput v-model="name" />
    </div> -->
    <!-- <el-scrollbar class="h-0 flex-1">
      <OrganizationHubChatLeftSideSettingList
        v-if="title === 'Settings'"
        @on-change="onChange"
      />
      <OrganizationHubChatLeftSideSettingNotification
        v-if="title === 'Notification'"
      />
      <OrganizationHubChatLeftSideSettingCustomize
        v-if="title === 'Customize Chat'"
      />
    </el-scrollbar> -->
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    return { hubChatStore, authStore };
  },
  data() {
    return {
      title: 'Settings',
      name: '',
    };
  },
  computed: {
    color() {
      return (
        this.hubChatStore.nameColor ||
        this.authStore.user?.preferences.chat.color
      );
    },
  },
  methods: {
    onBack() {
      if (this.title === 'Settings') {
        this.hubChatStore.isSetting = false;
      } else {
        this.title = 'Settings';
      }
    },
    onChange(title) {
      this.title = title;
    },
    async onColorChange(color) {
      await this.hubChatStore.updatePreferences({ chat: { color } });
      this.hubChatStore.nameColor = color;
    },
  },
};
</script>
