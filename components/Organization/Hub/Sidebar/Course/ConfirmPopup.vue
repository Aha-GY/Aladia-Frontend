<template>
  <client-only>
    <el-dialog
      v-model="dialogShow"
      :show-close="false"
      align-center
      append-to-body
      :width="$device.isMobile ? '22rem' : '36rem'"
      height="auto"
      destroy-on-close
      class="!border !border-[#0F0F0F]"
      @close="handleCloseDialog"
    >
      <!-- header -->
      <div
        class="flex h-fit items-center justify-between rounded-t-md bg-[#0C0C0C] py-4 pl-5 pr-3.5 text-base"
      >
        <div v-if="status === 'verifying'" class="flex items-center gap-2">
          <i class="fa-solid fa-clock" />
          <span>Under Review</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <i class="fa-regular fa-check" />
          <span>Course Submitted for Review</span>
        </div>
        <BaseIconClose @click="handleCloseDialog" />
      </div>
      <!-- body -->
      <div class="flex flex-col gap-5 bg-[#000000] px-9 py-5 text-sm">
        <div v-if="status === 'verifying'">
          Our team is reviewing your course and has up to X days from the
          submission date to ensure it meets our quality standards.
        </div>
        <div v-else>
          <h3 class="mb-1 text-base font-medium">
            Ready to submit your course?
          </h3>
          <div>
            Our team will evaluate it within X days to ensure it meets our
            quality standards.
          </div>
        </div>
        <div>
          <h3 class="mb-1 text-base font-medium">During review:</h3>
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-check" />
            Your course will be locked for editing.
          </div>
          <div
            v-if="course.visibility === 'public'"
            class="flex items-center gap-2"
          >
            <i class="fa-regular fa-check" />
            Upon approval, it will be automatically published on our
            marketplace.
          </div>
        </div>
        <div>
          <h3 class="mb-1 text-base font-medium">After publication:</h3>
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-check" />
            You'll regain full editing access to keep your content up to date.
          </div>
        </div>
      </div>
      <!-- footer -->
      <div
        class="flex items-center justify-end gap-4 bg-[#000000] px-3 pb-3 pt-2"
      >
        <div
          v-if="status !== 'verifying'"
          class="flex cursor-pointer items-center gap-2 text-sm"
          @click="handleCloseDialog"
        >
          Return to editing
        </div>
        <BaseButton v-if="status === 'verifying'" @click="handleCloseDialog">
          <i class="fa-regular fa-check" />
          Got it
        </BaseButton>
        <BaseButton v-else @click="handlePublishCourse">
          <i
            v-if="publishing"
            class="fa-light fa-loader animate-spin text-base"
          />
          Confirm
        </BaseButton>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  props: {
    publishing: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();

    const saving = ref(false);
    const dialogShow = ref(true);

    return {
      hubSidebar,
      saving,
      dialogShow,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    status() {
      return this.course?.version?.status;
    },
  },
  methods: {
    handlePublishCourse() {
      this.$emit('publish');
    },
    handleCloseDialog() {
      this.dialogShow = false;
      this.$emit('close');
    },
  },
};
</script>
