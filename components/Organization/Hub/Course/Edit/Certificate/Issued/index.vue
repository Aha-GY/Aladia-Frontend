<template>
  <el-dialog
    v-model="certificate.issuedPopup"
    :show-close="false"
    append-to-body
    width="64rem"
    height="auto"
    destroy-on-close
  >
    <div class="flex h-[36rem] rounded border border-white/20">
      <div class="flex w-72 flex-col gap-4 border-r border-white/20 p-4">
        <div class="flex items-center gap-2 text-sm text-white">
          <i class="fa-light fa-file-certificate" />
          Issued Certificate
          <div
            class="flex size-5 items-center justify-center rounded bg-white/20 text-sm"
          >
            6
          </div>
        </div>
        <BaseInput
          v-model="username"
          search
          clear
          fixed
          class="text-sm"
          :placeholder="$t('base.search.user')"
        />
        <div class="hide-scrollbar h-0 flex-1 overflow-y-auto">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/10"
          >
            <BaseAvatarNext
              :picture="member.picture"
              :has-story="member.hasActiveStory"
              :user-id="member.id"
              :online="member.online"
              :story="member.story"
              source="profile"
              size="md"
            />
            <div>
              <div class="text-sm text-white">{{ member.fullName }}</div>
              <div class="text-xs text-white/50">Issued on 08 October 2023</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-2 p-4">
        <div class="flex h-0 flex-1 flex-col items-center justify-center">
          <OrganizationHubCourseEditCertificateIssuedExperience
            v-if="isExperience"
          />
          <OrganizationHubCoursePreviewCertificateTemplates
            v-else
            class="pointer-events-none"
          />
        </div>
        <div class="flex items-center justify-between px-2">
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:text-white"
          >
            <i class="fa-solid fa-file-arrow-down" />
            Download
          </div>
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:text-white"
            @click="isExperience = !isExperience"
          >
            Certificate Experience
            <BaseSwitcher :active="isExperience" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    return { authStore, hubCourse };
  },
  data() {
    return {
      username: '',
      isExperience: false,
    };
  },
  computed: {
    certificate() {
      return this.hubCourse.certificate;
    },
    members() {
      return Array(6)
        .fill(null)
        .map(() => this.authStore.user);
    },
  },
};
</script>
