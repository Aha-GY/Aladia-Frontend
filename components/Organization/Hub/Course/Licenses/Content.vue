<template>
  <div class="flex flex-col gap-2">
    <div
      v-loading="loading"
      class="flex h-0 flex-1 flex-col overflow-hidden px-4"
    >
      <div class="mb-4 flex items-center gap-2 pt-2">
        <div
          class="relative flex items-center justify-center overflow-hidden rounded-5 bg-[#E2E2E208]"
        >
          <BaseCourseThumbnail
            :url="courseDetail.thumbnail?.url"
            class="h-20"
          />
          <div
            class="absolute bottom-1 right-1 rounded border border-white/40 bg-black/80 px-1.5 py-0.5 text-sm text-[#D4D4D4]"
          >
            ${{ moneyFormat(courseDetail.billing?.totalPrice || 0) }}
          </div>
        </div>
        <div class="w-0 flex-1">
          <div class="mb-1 flex items-center gap-1">
            <BaseAvatarNext
              :picture="courseDetail.owner?.picture"
              size="sm"
              :show-online="false"
            />
            <span class="max-w-48 truncate text-sm text-[#707070]">
              {{ courseDetail?.owner?.name }}
            </span>
          </div>
          <div class="line-clamp-2 h-10 pl-1 text-sm text-white">
            {{ courseDetail.title }}
          </div>
        </div>
      </div>
      <div class="mb-4 flex w-full items-center justify-between">
        <div class="text-base text-[#B0B0B0]">
          {{ $t('course.license.buy') }}
        </div>
        <BaseButton :loading="checkouLoading" @click="handleCheckout">
          {{ $t('base.upload.checkout') }}
        </BaseButton>
      </div>
      <div class="mb-2">
        {{ $t('course.license.assign') }}
      </div>
      <div class="mb-1 flex items-center gap-3 p-1.5">
        <BaseSpaceLogo
          class="!size-12 !text-xl"
          :space="organizationPurchases"
        />
        <div class="flex h-[3rem] flex-1 flex-col justify-between">
          <div class="line-clamp-2 flex-1 text-base text-[#FAFAFA]">
            {{ organizationPurchases.name }}
          </div>
          <div class="text-xs font-medium text-[#707070]">
            {{ $t('course.license.stored') }}
          </div>
        </div>
        <div
          class="rounded-5 bg-[#2A230E] px-1 py-1 text-xs font-medium text-[#E0B92C]"
        >
          <span class="font-semibold">
            {{ organizationPurchases.currentCourseTotal }}
          </span>
          {{ $t('course.license.label') }}
        </div>
      </div>
      <div class="mb-2 h-[1px] w-full shrink-0 bg-white/20" />
      <OrganizationHubCourseLicensesSpaces
        :spaces="spaceList"
        :space-id="spaceId"
        :total="organizationPurchases._currentCourseTotal"
        @change="handleNumberChange"
      />
    </div>
    <div
      class="mb-[1px] flex w-full items-center justify-between rounded-5 bg-[#0c0c0c] px-2 py-2"
    >
      <BaseButton
        type="tertiary"
        icon="fa-light fa-reply"
        data-cy="58c5779601d251c5"
        @click="handleCancel()"
      >
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton
        :loading="btnLoading"
        :disabled="disabledBtn"
        type="tertiary"
        icon="fa-solid fa-save"
        data-cy="9258b7548713b033"
        @click="handleApply"
      >
        {{ $t('base.upload.apply') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getCourse } from '~/api/v2/course';
import { previewSpace, moveCoursesLicense } from '~/api/v2/space';
import { courseEvent } from '~/constant/eventBus';
import { CHECKOUT_FROM_FLAGS } from '~/constant/payment';

const props = defineProps({
  courseId: {
    type: String,
    default: '',
  },
  spaceId: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:showDialog', 'cancel', 'apply']);
const { $eventBus } = useNuxtApp();
const $toast = useToast();
const { t } = useI18n();

const paymentStore = usePaymentStore();
const loading = ref(false);
const courseDetail = ref({});
const spaceCoursesOrginList = ref([]);
const spaceList = ref([]);
const organizationPurchases = ref({});
const btnLoading = ref(false);
const checkouLoading = ref(false);

const disabledBtn = computed(() => {
  const isDisabled = spaceList.value?.every(
    (item) => +item.assignedAmount <= 0,
  );
  return isDisabled;
});

onBeforeMount(() => {
  courseDetail.value = {};
  spaceCoursesOrginList.value = [];
  spaceList.value = [];
  organizationPurchases.value = {};
  getCourseDetail();
  getSpaceDetail();
  $eventBus.on(courseEvent.UPDATE_MANAGE_LICENSES_COURSE, getSpaceDetail);
});

onBeforeUnmount(() => {
  $eventBus.off(courseEvent.UPDATE_MANAGE_LICENSES_COURSE, getSpaceDetail);
});

const getCourseDetail = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const data = await getCourse({ courseId: props.courseId });
    courseDetail.value = data;
  } finally {
    loading.value = false;
  }
};

const getSpaceDetail = async () => {
  try {
    const { data } = await previewSpace({ limit: 0 });
    spaceCoursesOrginList.value = data;
    const { list } = addCourseInfoToSpaces(data, props.courseId);
    organizationPurchases.value =
      list
        .filter((item) => item.mode === 'shopping')
        .map((item) => {
          item.currentCourseTotal =
            (item.currentCourseTotal || 0) -
            (spaceList.value.reduce((sum, p) => p.assignedAmount + sum, 0) ||
              0);
          return item;
        })[0] || {};
    organizationPurchases.value._currentCourseTotal =
      organizationPurchases.value.currentCourseTotal; // 保存原始总数
    spaceList.value = list
      .filter((item) => item.mode !== 'shopping')
      .map((item) => {
        item.assignedAmount =
          spaceList.value.find((space) => space.id === item.id)
            ?.assignedAmount || 0;
        return item;
      });
    return spaceCoursesOrginList.value;
  } finally {
    loading.value = false;
  }
};

const addCourseInfoToSpaces = (spaceList, courseId) => {
  spaceList.forEach((space) => {
    let currentCourseTotal = 0;
    let currentCourseFolderId = '';
    const rootCourses = space.rootFolder.courses.filter(
      (course) => course.id === courseId,
    );
    currentCourseTotal =
      currentCourseTotal +
      rootCourses.reduce((sum, p) => p.availableLicense + sum, 0);
    if (rootCourses.length > 0) {
      currentCourseFolderId = space.rootFolder.id;
    }
    space.rootFolder.subFolders.forEach((folder) => {
      const folderCourses = folder.courses.filter(
        (course) => course.id === courseId,
      );
      currentCourseTotal =
        currentCourseTotal +
        folderCourses.reduce((sum, p) => p.availableLicense + sum, 0);
      if (folderCourses.length > 0) {
        currentCourseFolderId = folder.id;
      }
    });
    space.currentCourseTotal = currentCourseTotal;
    space.currentCourseFolderId = currentCourseFolderId;
    space.assignedAmount = space.assignedAmount || 0;
  });
  return { list: spaceList };
};

const handleNumberChange = (val) => {
  organizationPurchases.value.currentCourseTotal = val;
};

const handleCheckout = async () => {
  if (checkouLoading.value) {
    return;
  }
  checkouLoading.value = true;
  try {
    await paymentStore.onCheckout(
      courseDetail.value?.id,
      CHECKOUT_FROM_FLAGS.IAM_MANAGE_LICENSES_UPDATE_COURSE,
    );
  } finally {
    checkouLoading.value = false;
  }
};

const handleApply = async () => {
  const spaceLicenses =
    spaceList.value
      ?.filter((item) => item.assignedAmount > 0)
      .map((item) => ({
        targetSpaceId: item.id,
        licenses: item.assignedAmount,
      })) || [];
  if (btnLoading.value || disabledBtn.value) {
    return;
  }
  btnLoading.value = true;
  try {
    const { moved, updated } = await moveCoursesLicense({
      courseId: props.courseId,
      spaceId: organizationPurchases.value.id,
      folderId: organizationPurchases.value.currentCourseFolderId,
      spaceLicenses,
    });
    if (moved || updated) {
      spaceList.value.map((item) => {
        item.assignedAmount = 0;
        return item;
      });
      $toast.success(t('course.license.successfully'));
      await getSpaceDetail();
      emits('apply');
    }
  } finally {
    btnLoading.value = false;
  }
};

const handleCancel = () => {
  emits('cancel');
};

defineExpose({
  getCourseDetail,
  getSpaceDetail,
});
</script>
