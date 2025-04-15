<template>
  <client-only>
    <BaseDialog
      :title="$t('course.license.manage')"
      :model-value="props.showDialog"
      destroy-on-close
      :close-on-click-modal="false"
      class="!w-[90%] md:!w-[28rem]"
      :need-padding="false"
      @close="handleClose()"
    >
      <OrganizationHubCourseLicensesContent
        class="max-h-[75vh]"
        :course-id="courseId"
        :space-id="spaceId"
        @cancel="handleClose"
        @apply="handleApply"
      />
    </BaseDialog>
  </client-only>
</template>
<script setup>
import { courseEvent } from '~/constant/eventBus';

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: String,
    default: '',
  },
  spaceId: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:showDialog']);
const { $eventBus } = useNuxtApp();
const handleClose = () => {
  emits('update:showDialog', false);
};
const handleApply = () => {
  $eventBus.emit(courseEvent.UPDATE_IAM_ROLE_COURSE);
};
</script>
