<template>
  <client-only>
    <el-dialog
      v-model="dialogShow"
      :show-close="false"
      align-center
      append-to-body
      :width="$device.isMobile ? '22rem' : '40rem'"
      height="auto"
      destroy-on-close
      class="!border !border-[#0F0F0F]"
      @close="handleCloseDialog"
    >
      <div
        class="flex h-fit items-center justify-between rounded-t-md bg-[#0F0F0F] px-4 py-3.5 text-lg"
      >
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-sparkles" />
          <span v-if="aiFreeTierFinished">
            Your free tier usage limit has been reached.
          </span>
          <span v-else>AI category suggestions</span>
        </div>
        <BaseIconClose @click="handleCloseDialog" />
      </div>
      <div class="flex flex-col items-center justify-center bg-[#000000] p-5">
        <div v-if="aiFreeTierFinished">
          To continue enjoying uninterrupted access to Al services, please add a
          payment method to your account. Without this update, your access to
          these services will be temporarily suspended.
        </div>
        <div v-else>
          <div v-if="!hasValidTitle">
            You need to add a title that represents your course!
            <br />
            Once you've added the title, our AI can analyze it and suggest the
            most relevant categories.
          </div>

          <div v-else>
            <div class="mb-6">
              Based on your course title, our Al has identified relevant
              categories that can help more students discover your course:
            </div>
            <div
              v-if="initLoading"
              class="flex w-full items-center justify-center gap-2 px-12"
            >
              <div
                v-for="n in 3"
                :key="n"
                class="mb-4 flex flex-col items-center gap-3 rounded"
              >
                <div
                  class="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded border-white/10 bg-white/15"
                >
                  <i
                    class="fa-solid fa-spinner animate-spin text-xl text-white/30"
                  />
                </div>
                <div class="text-center text-gray-500">
                  You will see suggested Category here!
                </div>
              </div>
            </div>
            <div
              v-if="!initLoading && subCategories.length"
              class="flex w-full items-start justify-center gap-2 px-10"
            >
              <div
                v-for="item in subCategories"
                :key="item.id"
                class="flex flex-1 flex-col items-center gap-3"
              >
                <BaseCategoryIcon class="h-16 w-16" :image="item.image" />
                <div class="flex-1">
                  <div
                    class="max-w-48 overflow-hidden text-ellipsis text-center"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-4 bg-[#000000] px-5 py-4">
        <div
          v-if="aiFreeTierFinished"
          class="flex items-center justify-end gap-4"
        >
          <BaseButton
            class="rounded-md !py-[1.05rem] px-2"
            label="Close"
            type="tertiary"
            @click="handleCloseDialog"
          />
          <OrganizationHubCourseAiButton @click="handleAddPaymentMethod">
            Add Payment Method
          </OrganizationHubCourseAiButton>
        </div>
        <div v-else class="flex items-center justify-end gap-4">
          <BaseButton
            v-if="hasValidTitle"
            class="rounded-md !py-[1.05rem] px-2"
            label="Save without Suggestions"
            type="tertiary"
            data-cy="close-dialog"
            :loading="saving"
            @click="handleSaveWithoutSuggestions"
          />
          <button
            v-if="hasValidTitle"
            :disabled="subCategories.length === 0 || applying"
            @click="handleApplySuggestions"
          >
            <OrganizationHubCourseAiButton
              :class="
                subCategories.length === 0 || applying
                  ? '!cursor-not-allowed'
                  : '!cursor-pointer'
              "
            >
              <i
                v-if="applying"
                class="fa-light fa-loader animate-spin text-base"
              />
              Apply Suggestions
            </OrganizationHubCourseAiButton>
          </button>
          <OrganizationHubCourseAiButton
            v-if="!hasValidTitle"
            @click="handleCloseDialog"
          >
            Got it
          </OrganizationHubCourseAiButton>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const paymentStore = usePaymentStore();
    const hubSpaces = useHubSpacesStore();
    const subCategories = ref([]);

    const initLoading = ref(false);
    const applying = ref(false);
    const saving = ref(false);
    const dialogShow = computed(() => hubCourse.ai.suggestSubCategoriesDialog);

    return {
      hubCourse,
      paymentStore,
      hubSpaces,
      initLoading,
      applying,
      saving,
      dialogShow,
      subCategories,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    hasValidTitle() {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      return !isoDateRegex.test(this.course.title);
    },
    aiFreeTierFinished() {
      const token = this.hubSpaces.statistics.billings.find(
        (bill) => bill.type === 'tokens',
      );
      const hasPaymentMethod = this.paymentStore.paymentMethods.length > 0;
      return token?.freeTierPercentage === 100 && !hasPaymentMethod;
    },
  },
  mounted() {
    if (this.hasValidTitle && !this.aiFreeTierFinished) {
      this.SuggestedSubCategories();
    }
  },
  methods: {
    async SuggestedSubCategories() {
      try {
        this.initLoading = true;
        const data = await this.hubCourse.suggestSubCategories({
          assignCategories: false,
        });

        this.subCategories = data;
        this.initLoading = false;
      } catch (error) {
        this.initLoading = false;
      }
    },
    async handleApplySuggestions() {
      try {
        this.applying = true;
        await this.hubCourse.updateCourse({
          id: this.course.id,
          spaceId: this.course.spaceId || undefined,
          categories: this.subCategories.length
            ? [...new Set(this.subCategories.map((item) => item.parentId))]
            : undefined,
          subCategories: this.subCategories.length
            ? this.subCategories.map((item) => item.id)
            : undefined,
        });
        this.applying = false;
        this.hubCourse.ai.suggestSubCategoriesDialog = false;
        await this.hubCourse.getCourse({
          courseId: this.course.id,
        });
      } catch (error) {
        this.applying = false;
      }
    },
    async handleSaveWithoutSuggestions() {
      try {
        this.saving = true;
        await this.hubCourse.updateCourse({
          id: this.course.id,
          spaceId: this.course.spaceId || undefined,
          categories: this.course.categories.length
            ? this.course.categories
            : undefined,
          subCategories: this.course.subCategories.length
            ? this.course.subCategories
            : undefined,
        });

        this.saving = false;
        this.hubCourse.ai.suggestSubCategoriesDialog = false;
        await this.hubCourse.getCourse({
          courseId: this.course.id,
        });
      } catch (error) {
        this.saving = false;
      }
    },
    handleCloseDialog() {
      this.hubCourse.ai.suggestSubCategoriesDialog = false;
    },
    handleAddPaymentMethod() {
      this.hubCourse.ai.suggestSubCategoriesDialog = false;
      this.paymentStore.addCardDialog = true;
    },
  },
};
</script>
