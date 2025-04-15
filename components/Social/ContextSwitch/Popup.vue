<template>
  <client-only>
    <el-dialog
      v-model="socialStore.contextSwitchPopUpVisible"
      :show-close="false"
      align-center
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      :z-index="10000"
      width="35.75rem"
      class="__context-switch-popup !rounded-[0.3125rem] !shadow-none"
    >
      <div
        class="flex items-center justify-between gap-2 bg-[#0C0C0C] px-4 py-3"
      >
        <div class="flex items-center gap-2 text-xl text-[#B0B0B0]">
          <i class="fa-regular fa-rotate-exclamation" />
          <span class="ml-3">
            {{ $t('org.switch.label') }}
          </span>
        </div>

        <BaseIconClose data-cy="b657ec116e0608d3" @click="closeDialog" />
      </div>
      <p class="mt-2 px-4 text-white">
        {{ $t('org.switch.content') }}
      </p>

      <div
        class="mt-1 flex max-h-[20rem] flex-col gap-2 overflow-y-auto px-4 pt-3"
      >
        <SocialContextSwitchPersonal />
        <SocialContextSwitchOrganization />
      </div>
      <div class="flex items-center justify-end gap-2 p-4 text-base">
        <div
          class="flex h-7 cursor-pointer items-center justify-center gap-[6px] px-2 py-1 text-white transition-all active:scale-95"
          data-cy="f096edb89b3bb83c"
          @click="closeDialog"
        >
          <i class="fa-light fa-reply text-base" />
          <div>
            {{ $t('base.upload.cancel') }}
          </div>
        </div>
        <BaseButton
          :loading="btnLoading"
          data-cy="9cb1f174e1902d38"
          class="!pl-2"
          @click="onConfirm"
        >
          <i v-if="!btnLoading" class="fa-regular fa-check" />
          <span class="font-medium">
            {{ $t('base.upload.confirm') }}
          </span>
        </BaseButton>
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();

    return {
      socialStore,
      authStore,
      profileStore,
      fluxesStore,
    };
  },
  data() {
    return {
      btnLoading: false,
    };
  },
  computed: {
    switching() {
      return this.authStore.switching;
    },
  },
  watch: {
    'fluxesStore.storiesPreview.open': {
      handler(val) {
        if (val) {
          this.socialStore.contextSwitchPopUpVisible = false;
          this.fluxesStore.storiesPreview.open = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async onConfirm() {
      if (this.btnLoading) {
        return false;
      }
      this.btnLoading = true;
      const postId = this.socialStore.postItem.id;
      const isPostPopupOpen = this.socialStore.postPopup;
      await this.profileStore.switchMyProfile({
        profile: this.socialStore.currentSelectedProfile,
      });
      this.btnLoading = false;
      if (isPostPopupOpen) {
        this.$router.push({
          query: {
            ...this.$route.query,
            postId,
          },
        });
        this.socialStore.contextSwitchPopUpVisible = false;
      }
    },
    closeDialog() {
      this.socialStore.contextSwitchPopUpVisible = false;
      this.socialStore.currentSelectedProfile = {};
    },
  },
};
</script>
