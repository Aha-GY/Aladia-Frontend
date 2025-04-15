<template>
  <div
    class="relative cursor-pointer"
    data-cy="31fb82e4475efc69"
    @click="openSocialContextPopUp"
  >
    <div>
      <BaseAvatarNext
        :picture="user.picture"
        :story="user?.story"
        :user-id="user?.id"
        :show-online="false"
        :show-story="false"
        size="md"
        :default-icon="defaultIcon"
      >
        <template v-if="showDropDown" #button>
          <div class="rounded-full bg-black">
            <div
              class="flex size-full items-center justify-center rounded-full border border-white/10"
            >
              <i class="fa-light fa-chevron-down text-xs text-white/80" />
            </div>
          </div>
        </template>
      </BaseAvatarNext>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showDropDown: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const socialStore = useSocialStore();
    const authStore = useAuthStore();

    return { profileStore, socialStore, authStore };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
    defaultIcon() {
      return this.authStore.isOrg
        ? 'fa-solid fa-building-ngo text-base'
        : 'fa-solid fa-user text-base';
    },
    active() {
      const name = this.$route.name || '';
      const id = this.$route.params.name || '';

      const regex = /^(organization-hub|user-hub)/;

      if (regex.test(name)) {
        return id;
      }

      return name;
    },
  },
  methods: {
    openSocialContextPopUp() {
      if (this.showDropDown) {
        this.socialStore.contextSwitchPopUpVisible = true;
      }
    },
  },
};
</script>
