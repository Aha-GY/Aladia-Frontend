<template>
  <OrganizationHubCourseEditWrap :step="5">
    <OrganizationHubCourseEditCertificateHeader />
    <OrganizationHubCourseEditCertificateLogo />
    <OrganizationHubCourseEditCertificateProfile />
    <OrganizationHubCourseEditCertificateBrand />
    <OrganizationHubCourseEditCertificateAccent />
    <OrganizationHubCourseEditCertificateSignature />
    <OrganizationHubCourseEditCertificateRole />
    <OrganizationHubCourseEditCertificateFont />
    <OrganizationHubCourseEditCertificateIssued />
  </OrganizationHubCourseEditWrap>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    placeholder() {
      return this.hubCourse.detail.certificateTemplate;
    },
  },
};
</script>
