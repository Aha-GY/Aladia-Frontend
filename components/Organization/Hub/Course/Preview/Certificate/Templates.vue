<template>
  <div class="hide-scrollbar flex h-0 flex-1 justify-center overflow-auto">
    <div
      ref="certificate"
      class="flex aspect-[4/3] items-center justify-center overflow-hidden"
    >
      <BaseCertificateModel1
        v-if="placeholder.name === 'template1'"
        :style="modelStyle"
        v-bind="placeholder"
      />
      <BaseCertificateModel2
        v-if="placeholder.name === 'template2'"
        :style="modelStyle"
        v-bind="placeholder"
      />
      <BaseCertificateModel3
        v-if="placeholder.name === 'template3'"
        :style="modelStyle"
        v-bind="placeholder"
      />
      <BaseCertificateModel4
        v-if="placeholder.name === 'template4'"
        :style="modelStyle"
        v-bind="placeholder"
      />
      <BaseCertificateModel5
        v-if="placeholder.name === 'template5'"
        :style="modelStyle"
        v-bind="placeholder"
      />
      <BaseCertificateModel6
        v-if="placeholder.name === 'template6'"
        :style="modelStyle"
        v-bind="placeholder"
      />
    </div>
  </div>
</template>

<script setup>
const hubCourse = useHubCoursesStore();
const profileStore = useProfileStore();

const modelWidth = ref(1200);
const modelHeight = ref(900);
const certificate = ref(null);
const { width } = useElementSize(certificate);

const modelScale = computed(() => width.value / modelWidth.value);

const placeholder = computed(() => ({
  ...hubCourse.detail.certificateTemplate,
  logo: hubCourse.detail.certificateTemplate.useProfilePicture
    ? profileStore.myUserProfileDetail.picture
    : hubCourse.detail.certificateTemplate?.logo?.url,
  certificateId: '123456789',
  courseName: hubCourse.detail.title,
  providerName: profileStore.myProfileDetail.fullName,
  skills: hubCourse.detail.skills,
}));

const modelStyle = computed(() => ({
  width: `${modelWidth.value}px`,
  height: `${modelHeight.value}px`,
  transform: `scale(${modelScale.value})`,
}));

onMounted(() => {
  loadCSS(
    'https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Merriweather&family=Satisfy&display=swap',
  );
});
</script>
