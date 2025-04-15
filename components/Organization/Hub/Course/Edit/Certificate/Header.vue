<template>
  <div class="my-2 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <i class="fa-light fa-file-certificate" />
      Certificate
      <div
        class="flex size-5 items-center justify-center rounded bg-white/20 text-sm"
      >
        6
      </div>
    </div>
    <div class="cursor-pointer" @click="certificate.issuedPopup = true">
      <BaseMemberPreview :members="members" :max="4" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    return { authStore, hubCourse };
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
