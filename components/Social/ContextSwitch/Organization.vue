<template>
  <div class="mt-1 bg-[#0A0A0A] p-3">
    <div class="mb-3 flex items-center justify-start gap-2 text-sm">
      <i class="fa-light fa-users text-[11px] font-extrabold text-white" />
      <div>{{ $t('org.name') }}</div>
    </div>
    <div
      v-for="org in orgs"
      :key="org.id"
      class="flex cursor-pointer items-center gap-4 rounded px-1 py-1 font-semibold hover:bg-white/5"
      :class="active === org.id ? 'bg-white/5' : 'bg-transparent'"
      data-cy="24dcb6f190a86976"
      @click="() => onProfileSelected(org)"
    >
      <BaseAvatarNext
        :picture="org.picture"
        :checked="active === org.id"
        :show-online="false"
        size="md"
        :show-check="true"
        :story="org.story"
        :user-id="org.id"
      />
      <div class="text-16 line-clamp-1">
        {{ org.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    return { profileStore, authStore, socialStore };
  },
  computed: {
    orgs() {
      return this.profileStore.myOrganizationList;
    },
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
