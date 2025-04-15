<template>
  <div class="w-full">
    <PostsItemContentAutopostSubtypeJoin v-if="isJoin" :item="item" />
    <PostsItemContentAutopostSubtypeBeTeacher v-if="isBeTeacher" :item="item" />
    <PostsItemContentAutopostSubtypePublishCourse
      v-if="isPublishCourse"
      :item="item"
      :is-popup="isPopup"
      @show-popup="handleShowDetail"
    />
    <PostsItemContentAutopostSubtypeEnrolledCourse
      v-if="isPurchaseCourse"
      :item="item"
      :is-popup="isPopup"
      @show-popup="handleShowDetail"
    />
    <PostsItemContentAutopostSubtypeNewRole v-if="isNewJob" :item="item" />
    <PostsItemContentAutopostSubtypeEarnedCertification
      v-if="isEarnedCertification"
      :item="item"
    />
    <PostsItemContentAutopostSubtypeCelebratingGraduation
      v-if="isCelebratingGraduation"
      :item="item"
    />
    <PostsItemContentAutopostSubtypeOneYearAnniversary
      v-if="isOneYearAnniversary"
      :item="item"
    />
    <PostsItemContentAutopostSubtypeCourseCertificate
      v-if="isCourseCertificate"
      :item="item"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { authStore, socialStore, searchStore };
  },
  computed: {
    isJoin() {
      return this.item.subType === 'joined-platform';
    },
    isBeTeacher() {
      return this.item.subType === 'became-teacher';
    },
    isPublishCourse() {
      return this.item.subType === 'published-course';
    },
    isPurchaseCourse() {
      return this.item.subType === 'enrolled-course';
    },
    isNewJob() {
      return this.item.subType === 'started-new_role';
    },
    isOneYearAnniversary() {
      return this.item.subType === 'one-year-anniversary';
    },
    isCelebratingGraduation() {
      return this.item.subType === 'graduation';
    },
    isEarnedCertification() {
      return this.item.subType === 'earned-certification';
    },
    isCourseCertificate() {
      return this.item.subType === 'course-certificate';
    },
  },
  methods: {
    handleShowDetail() {
      this.$emit('show-popup');
    },
  },
};
</script>
