<template>
  <div
    class="relative h-[20.125rem] overflow-hidden bg-[#0C0C0C] px-2 text-[#d9d9d9]"
  >
    <div class="overflow-hidden">
      <BaseCourseThumbnail
        class="ml-1 mt-2 h-full object-cover"
        :url="course.thumbnail"
      />
    </div>
    <div class="absolute left-5 top-3 rounded-md bg-black/60 p-1.5 text-xs">
      <BaseCourseType :type="course?.type" />
    </div>
    <div class="absolute bottom-20 right-3 flex space-x-2">
      <span class="rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
        {{ $t('category.payout.qty', { license: licensesBought }) }}
      </span>
      <span
        class="flex items-center rounded-lg bg-black/60 px-2 py-1 text-xs text-white"
      >
        <div>
          <OrganizationHubPaymentHistoryDialogCompsAmountTip
            :money="coursePrice"
            :show-currency="false"
          />
        </div>
        <span class="ml-1">$</span>
      </span>
    </div>
    <div class="p-3">
      <div class="flex items-center">
        <BaseAvatarNext
          :picture="courseOwner?.picture"
          :story="courseOwner?.story"
          :user-id="courseOwner?.id"
          :show-online="false"
          size="md"
        />
        <div class="ml-2 flex-grow overflow-hidden">
          <div
            class="cursor-pointer truncate text-xs text-[#555555] hover:text-white hover:underline"
            @click="handleGotoProfile"
          >
            {{ courseOwner?.fullName || courseOwner?.name }}
          </div>
          <div
            class="cursor-pointer truncate text-sm text-[#D9D9D9] hover:text-white hover:underline"
            @click="handleGoToCourse"
          >
            {{ course?.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courseOwner: {
    type: Object,
    required: true,
  },
  course: {
    type: Object,
    required: true,
  },
  licensesBought: {
    type: Number,
    required: true,
  },
  coursePrice: {
    type: Number,
    required: true,
  },
});

const router = useRouter();
const profileStore = useProfileStore();

function handleGoToCourse() {
  router.push(`/courses/${props.course.id}`);
}

function handleGotoProfile() {
  if (props.courseOwner) {
    profileStore.gotoProfilePage({ id: props.courseOwner.id });
  }
}
</script>
