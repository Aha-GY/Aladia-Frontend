<template>
  <ProfileBox>
    <div class="flex flex-col gap-3">
      <div v-if="!isProfileSettings" class="flex items-center justify-between">
        <div class="text-base font-medium capitalize text-[#B0B0B0]">
          {{ showType === 'study' ? $t('course.education') : showType }}
        </div>
        <BaseButton
          v-if="isMy"
          :data-cy="`${
            showType === 'study' ? 'education' : showType
          }-experience-add-button`"
          @click="handleCreate"
        >
          <i class="fa-solid fa-plus" />
        </BaseButton>
      </div>
      <div v-if="isProfileSettings" class="absolute bottom-4 right-5">
        <BaseButton data-cy="43d2e3737df98e13" @click="handleCreate">
          <i class="fa-solid fa-plus" />
        </BaseButton>
      </div>

      <div v-loading="dataLoading" class="gap-2 rounded-md py-4">
        <div v-if="dataLoading" class="h-[9rem]" />
        <BaseNoData v-if="!experiencesData?.length && !dataLoading" />
        <template v-if="experiencesData?.length">
          <PersonalDetailAboutWorkEducationCertificateItem
            v-for="item in experiencesData"
            :key="item.id"
            :data="item"
            :show-type="showType"
            @open-item="handleOpenItem"
            @refresh="handleRefresh()"
          />
        </template>
      </div>
      <PersonalDetailAboutWorkEducationCertificateExperience
        v-model:show-dialog="dialogShow"
        :show-type="showType"
        :is-view="isView"
        :detail="experiencesdetail"
        @refresh="handleRefresh"
      />
    </div>
  </ProfileBox>
</template>

<script>
export default {
  props: {
    isProfileSettings: {
      type: Boolean,
      default: false,
    },
    showType: {
      type: String,
      default: '',
    },
  },
  setup() {
    const route = useRoute();
    const experiencesStore = useExperiencesStore();
    const profileStore = useProfileStore();
    return {
      profileStore,
      route,
      experiencesStore,
    };
  },
  data() {
    return {
      dialogShow: false,
      experiencesData: [],
      experiencesdetail: null,
      dataLoading: true,
      isView: true,
    };
  },
  computed: {
    isMy() {
      return (
        this.isProfileSettings ||
        this.profileStore.myProfileDetail.id ===
          this.profileStore.getPersonalProfileDetail().id
      );
    },
  },
  mounted() {
    this.getExperiencesData();
  },
  methods: {
    async getExperiencesData() {
      const { data } = await this.experiencesStore.searchExperience({
        experienceId: this.isProfileSettings
          ? this.profileStore.myUserProfileDetail.id
          : this.route.params.name,
        type: this.showType,
      });
      this.experiencesData = data;
      this.dataLoading = false;
    },
    handleCreate() {
      this.handleOpenItem({
        action: 'edit',
        item: this.experiencesStore.defaultExperienceParams,
      });
    },
    handleOpenItem({ action, item }) {
      this.isView = action === 'detail';
      // if (!this.isView) {
      //   this.getExperiencesData();
      // }
      this.experiencesdetail = {
        ...this.experiencesStore.handleDetailExperienceData(item),
      };
      this.dialogShow = true;
    },
    async handleRefresh() {
      this.getExperiencesData();
      this.experiencesStore.getListExperience();
      await this.profileStore.getUserProfile({
        profileId: this.isMy
          ? this.profileStore.myUserProfileDetail.id
          : this.profileStore.otherUserProfileDetail.id,
      });
    },
  },
};
</script>
