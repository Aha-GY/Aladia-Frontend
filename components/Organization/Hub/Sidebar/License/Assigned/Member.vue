<template>
  <div
    v-loading="loading"
    class="flex items-center justify-between rounded px-2 py-1 hover:bg-white/10"
  >
    <div class="flex items-center gap-2">
      <BaseAvatarProgress
        :member="member"
        :completion="member.completionAmount"
      />
      <div>
        <div
          class="mb-0.5 w-40 truncate text-sm text-white"
          v-html="highlight"
        />
        <div class="flex items-center text-xs">
          <div v-if="member.online" class="text-white/50">
            {{ $t('base.member.online') }}
          </div>
          <div v-else class="text-white/50">
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div
        v-if="member.canBeRevoked"
        class="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-white/10"
        @click="onRevokeClick"
      >
        <i class="fa-light fa-file-certificate" />
        {{ $t('course.license.revoke') }}
      </div>
      <div v-else>
        <div
          v-if="member.completionAmount === 100"
          class="flex items-center gap-1 rounded bg-[#0f2b22] px-1 py-0.5 text-xs text-[#9fecb1]"
        >
          <i class="fa-solid fa-clock" />
          {{ member.completionAmount }}%
        </div>
        <div
          v-else
          class="flex items-center gap-1 rounded bg-[#360b60] px-1 py-0.5 text-xs text-[#e6d6fc]"
        >
          <i class="fa-solid fa-clock" />
          {{ member.completionAmount }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
    },
    members: {
      type: Array,
    },
    username: {
      type: String,
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
    course() {
      const { data } = this.hubSidebar.course;
      return this.hubSpaces.find(data.id) || data;
    },
    highlight() {
      if (!this.username) {
        return this.member.fullName;
      }
      return highlightKeywords(this.member.fullName, [this.username]);
    },
  },
  methods: {
    async onRevokeClick() {
      if (this.loading) {
        return;
      }
      try {
        this.loading = true;
        await this.hubSpaces.removeLicense({
          courseId: this.course.id,
          spaceId: this.space.id,
          profileIds: [this.member.id],
        });

        await this.hubSpaces.getCourses({
          spaceId: this.space.id,
          folderId: this.folder.id,
        });

        this.members.splice(
          this.members.findIndex((m) => m.id === this.member.id),
          1,
        );

        this.$toast.success(this.$t('base.license.success.revoke'));
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>
