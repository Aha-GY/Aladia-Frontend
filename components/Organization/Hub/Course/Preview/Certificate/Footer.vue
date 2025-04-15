<template>
  <div class="relative shrink-0 rounded border border-white/20 p-2">
    <div
      ref="certificate"
      class="hide-scrollbar flex cursor-pointer items-center overflow-x-auto scroll-smooth"
    >
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template1' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template1'"
      >
        <BaseCertificateModel1 :style="modelStyle" v-bind="placeholder" />
      </div>
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template2' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template2'"
      >
        <BaseCertificateModel2 :style="modelStyle" v-bind="placeholder" />
      </div>
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template3' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template3'"
      >
        <BaseCertificateModel3 :style="modelStyle" v-bind="placeholder" />
      </div>
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template4' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template4'"
      >
        <BaseCertificateModel4 :style="modelStyle" v-bind="placeholder" />
      </div>
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template5' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template5'"
      >
        <BaseCertificateModel5 :style="modelStyle" v-bind="placeholder" />
      </div>
      <div
        class="flex aspect-[4/3] w-1/5 shrink-0 items-center justify-center overflow-hidden border-2 p-2"
        :class="
          'template6' === placeholder.name
            ? 'border-[#deb839]'
            : 'border-transparent'
        "
        @click="hubCourse.detail.certificateTemplate.name = 'template6'"
      >
        <BaseCertificateModel6 :style="modelStyle" v-bind="placeholder" />
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-0 z-50 -mb-4 hidden items-center transition-all sm:flex"
    >
      <div
        class="pointer-events-auto absolute left-2 top-1/2 -mt-7 flex h-12 w-7 cursor-pointer items-center justify-center"
        @click="onLeftClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
        />
      </div>
      <div
        class="pointer-events-auto absolute right-2 top-1/2 -mt-7 flex h-12 w-7 cursor-pointer items-center justify-center"
        @click="onRightClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
        />
      </div>
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

const modelScale = computed(() => (width.value - 40) / modelWidth.value / 5);

const modelStyle = computed(() => ({
  width: `${modelWidth.value}px`,
  height: `${modelHeight.value}px`,
  transform: `scale(${modelScale.value})`,
}));

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

function onLeftClick() {
  certificate.value.scrollLeft = 0;
}

function onRightClick() {
  certificate.value.scrollLeft = certificate.value.scrollWidth;
}
</script>
