<template>
  <div class="mt-1 bg-[#0A0A0A] p-3">
    <div class="mb-3 flex items-center justify-start gap-2 text-sm">
      <i class="fa-light fa-user text-[11px] font-extrabold text-white" />
      <div>
        {{ $t('personal.account.label') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-[16px] rounded px-1 py-1 font-semibold hover:bg-white/5"
      :class="active === user.id ? 'bg-white/5' : 'bg-transparent'"
      data-cy="822e818bd9f2e843"
      @click="() => onProfileSelected(user)"
    >
      <BaseAvatarNext
        :picture="user.picture"
        :checked="active === user.id"
        size="md"
        :user-id="user.id"
        :show-online="false"
        :show-check="true"
        :story="user.story"
      />
      <div class="text-16 line-clamp-1">
        {{ user.firstName + ' ' + user.lastName || '' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const socialStore = useSocialStore();
    return { authStore, profileStore, socialStore };
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    active() {
      const name = this.$route.name || '';
      const id = this.$route.params.name || '';

      const regex = /^(organization-hub|user-hub)/;

      if (regex.test(name)) {
        return this.socialStore.currentSelectedProfile.id || id;
      }

      return this.socialStore.currentSelectedProfile.id || name;
    },
    switching() {
      return this.authStore.switching;
    },
  },
  methods: {
    onProfileSelected(data) {
      this.socialStore.currentSelectedProfile = data;
    },
  },
};
</script>
<style scoped>
.line-clamp-1 {
  /*
    Tailwind's default `line-clamp-1` doesn't handle unbreakable text properly, 
    so we added `word-break: break-word` and `overflow-wrap: break-word` to 
    ensure proper text wrapping and truncation.
  */

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word; /* Forces breaking of long words */
  overflow-wrap: break-word; /* Ensures wrapping works across browsers */
}
</style>
