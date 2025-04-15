<template>
  <div
    class="relative flex flex-1 flex-col justify-between overflow-hidden px-[0.38rem] py-2"
  >
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="text-base text-[#D9D9D9]">
          {{ $t('calendar.role.organization') }}
        </div>
        <div class="hide-scrollbar mt-2 flex-1 overflow-y-auto">
          <div
            v-for="item in roleList"
            :key="item.value"
            class="mb-2 cursor-pointer rounded-5 border-l border-transparent px-2 py-[0.08rem] transition-all duration-200 hover:bg-[#131313]"
            :class="{
              'hover:border-[#9D50ED]': item.value === 'organization-member',
              'hover:border-[#9E1515]': item.value === 'organization-admin',
              'bg-[#131313]': item.value === activeRole,
            }"
          >
            <div
              class="flex h-10 items-center justify-between"
              data-cy="01c90c01dd6fb095"
              @click="handleSelectRole(item.value)"
            >
              <div class="flex-1">
                <i :class="item.icon" class="pl-3" />
                <span class="ml-2 text-sm text-[#FAFAFA]">
                  {{ $t(item.label) }}
                </span>
              </div>
              <div class="pr-3">
                <BaseCheckboxStyle
                  :state="activeRole === item.value ? 'checked' : 'unchecked'"
                />
              </div>
            </div>
            <div
              class="overflow-hidden transition-all duration-200"
              :class="{
                'h-0': activeRole !== item.value,
                'h-[19rem]': activeRole === item.value,
              }"
            >
              <div
                v-for="ele in item.typeRoles"
                :key="ele.value"
                class="mb-[0.63rem] rounded-5 bg-[#191919] px-4 py-2 text-base text-[#D9D9D9] transition-all duration-300 hover:pl-6"
                @click="handleSelectTypeRole(ele.label)"
              >
                <div class="flex h-9 items-center justify-between">
                  <div>{{ $t(ele.title) }}</div>
                  <i :class="ele.icon" class="pl-3" />
                </div>
              </div>
              <div
                v-for="item in billingAndDeveloper"
                :key="item.value"
                class="mx-2 flex items-center justify-between rounded-5 p-2 hover:bg-[#191919]"
                @click="handleSelectCheckedBillingDeveloper(item.value)"
              >
                <div class="flex flex-1 items-center">
                  <div
                    class="relative mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#232222] transition-all duration-200"
                  >
                    <i :class="item.icon" />
                    <div
                      class="absolute -bottom-1 -right-2 flex items-center justify-center rounded-full bg-black p-1"
                    >
                      <i class="fa-light fa-circle-exclamation" />
                    </div>
                  </div>
                  <div>{{ $t(item.label) }}</div>
                </div>
                <BaseCheckboxStyle
                  :state="item.checked ? 'correctChecked' : 'unchecked'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-end justify-end py-1">
        <BaseButton
          :disabled="inviteBtnDisabled"
          type="secondary"
          :icon="[
            'fa-light',
            isEdit ? 'fa-sharp fa-floppy-disk' : 'fa-paper-plane',
          ]"
          :loading="loading"
          data-cy="3c686418f536530c"
          @click="handlerSend"
        >
          <span v-if="type === 'group'">
            {{ isEdit ? $t('base.upload.save') : $t('org.create') }}
          </span>
          <span v-else>
            {{ isEdit ? $t('base.upload.save') : $t('org.group.invite.label') }}
          </span>
        </BaseButton>
      </div>
    </div>
    <div
      :class="showRoleBody ? 'left-0' : 'left-[102%]'"
      class="absolute top-0 z-50 flex h-full w-full flex-col bg-[#060606] transition-all duration-300"
    >
      <div class="flex items-center py-4 pl-2 text-base text-[#D9D9D9]">
        <div
          class="mr-2 flex cursor-pointer items-center justify-center rounded-5 px-1.5 py-1.5 hover:bg-white/5"
          data-cy="901a418d6475d5d8"
          @click="showRoleBody = false"
        >
          <i class="fa-sharp fa-solid fa-arrow-left" />
        </div>
        <span>
          {{ $t('calendar.role.select.assign') }}
          <span class="capitalize">{{ activeTypeRole }}</span>
          {{ $t('calendar.role.select.role') }}
        </span>
      </div>
      <template v-if="showRoleBody">
        <ProfileSettingDialogOrgMenuIAMComponentsSpaceCoursesRoles
          v-if="activeTypeRole === 'Space & Courses'"
          :value="selectSpaceCoursesValue"
          :invites="invites"
          :is-edit="isEdit"
          :loading="spaceCoursesLoading"
          :space-courses-orgin-list="spaceCoursesOrginList"
          @back="showRoleBody = false"
          @change="handleChangeSpaceCourses"
          @get-space-courses="fetchSpaceCoursesList"
        />
        <ProfileSettingDialogOrgMenuIAMComponentsCalendarsRoles
          v-if="activeTypeRole === 'Calendars'"
          :value="selectCalendarsValue"
          :invites="invites"
          :is-edit="isEdit"
          :loading="calendarsLoading"
          :calendars-list="calendarsList"
          @back="showRoleBody = false"
          @change="handleChangeCalendars"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { roleList } from '../CONST';

import { getCalendarList } from '~/api/v2/calendar';
import {
  organizationInvitationsMembers,
  updateOrgMember,
  createOrgGroupMember,
  updateOrgGroupMemberRole,
} from '~/api/v2/org';
import { previewSpace } from '~/api/v2/space';

const props = defineProps({
  invites: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'user',
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  // edit true need
  rolesDetail: {
    type: Object,
    default: () => {},
  },
  // group true need
  groupDetail: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['comfirm']);
const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const activeRole = ref('');
const activeTypeRole = ref('');
const showRoleBody = ref(false);
const selectCalendarsValue = ref([]);
const selectSpaceCoursesValue = ref({ spaces: [], courses: [] });
const loading = ref(false);
const billingAndDeveloper = ref([
  {
    label: 'calendar.role.billing.mgr',
    icon: 'fa-solid fa-dollar-sign text-base',
    value: 'organization-billing-manager',
    checked: false,
  },
  {
    label: 'calendar.role.developer',
    icon: 'fa-solid fa-code text-sm',
    value: 'organization-developer',
    checked: false,
  },
  {
    label: 'SocialMedia Manager',
    icon: 'fa-solid fa-share-nodes text-sm',
    value: 'organization-social-manager',
    checked: false,
  },
]);

const inviteBtnDisabled = computed(() => {
  const inviteBtnDisabled =
    !props.invites.length || !activeRole.value || loading.value;

  return props.type === 'group'
    ? (props.isEdit ? false : inviteBtnDisabled) || !props.groupDetail?.id
    : inviteBtnDisabled;
});

const calendarsLoading = ref(false);
const calendarsList = ref([]);
const fetchCalendarsList = async () => {
  calendarsLoading.value = true;
  try {
    const { data } = await getCalendarList({ limit: 0 });
    calendarsList.value = data;
  } finally {
    calendarsLoading.value = false;
  }
};
fetchCalendarsList();

const spaceCoursesLoading = ref(false);
const spaceCoursesOrginList = ref([]);
const fetchSpaceCoursesList = async () => {
  spaceCoursesLoading.value = true;
  try {
    const { data } = await previewSpace({ limit: 0 });
    spaceCoursesOrginList.value = data;
  } finally {
    spaceCoursesLoading.value = false;
  }
};

fetchSpaceCoursesList();

watch(
  () => [
    activeRole.value,
    props.isEdit,
    spaceCoursesOrginList.value,
    calendarsList.value,
  ],
  () => {
    if (
      (activeRole.value === 'organization-admin' && !props.isEdit) ||
      (activeRole.value === 'organization-admin' &&
        props.rolesDetail?.role === 'organization-member')
    ) {
      billingAndDeveloper.value.forEach((item) => {
        item.checked = true;
      });
      calendarsList.value?.forEach((item) => {
        selectCalendarsValue.value.push({
          ...item,
          role: 'calendar-organizer',
        });
      });
      spaceCoursesOrginList.value?.forEach((item) => {
        selectSpaceCoursesValue.value.spaces.push({
          ...item,
          role: 'space-supervisor',
        });
        item.rootFolder.courses?.forEach((course) => {
          selectSpaceCoursesValue.value.courses.push({
            ...course,
            spaceId: item.id,
            role: 'course-observer',
          });
        });
        item.rootFolder.subFolders?.forEach((subFolder) => {
          subFolder.courses?.forEach((course) => {
            selectSpaceCoursesValue.value.courses.push({
              ...course,
              spaceId: item.id,
              role: 'course-observer',
            });
          });
        });
      });
    }
  },
  { immediate: true, deep: true },
);

const setEditData = () => {
  activeRole.value = props.rolesDetail.role;
  selectCalendarsValue.value = props.rolesDetail.calendars;
  selectSpaceCoursesValue.value = {
    spaces: props.rolesDetail.spaces,
    courses: props.rolesDetail.courses,
  };
  billingAndDeveloper.value.forEach((item) => {
    item.checked = props.rolesDetail?.secondaryRoles?.includes(item.value);
  });
};

watch(
  () => props.rolesDetail,
  (value) => {
    if (value?.role) {
      setEditData();
    }
  },
  { immediate: true, deep: true },
);

const clearData = () => {
  activeRole.value = '';
  showRoleBody.value = false;
  activeTypeRole.value = '';
  selectCalendarsValue.value = [];
  selectSpaceCoursesValue.value = { spaces: [], courses: [] };
  billingAndDeveloper.value.forEach((item) => {
    item.checked = false;
  });
};

const handleSelectRole = (role) => {
  if (props.isEdit && role === props.rolesDetail?.role) {
    setEditData();
    return;
  }
  if (role === activeRole.value) {
    clearData();
  } else {
    clearData();
    activeRole.value = role;
  }
};
const handleSelectTypeRole = (role) => {
  showRoleBody.value = true;
  activeTypeRole.value = role;
};

const handleSelectCheckedBillingDeveloper = (value) => {
  const index = billingAndDeveloper.value.findIndex(
    (item) => item.value === value,
  );
  billingAndDeveloper.value[index].checked =
    !billingAndDeveloper.value[index].checked;
};
const handleChangeCalendars = (value) => {
  selectCalendarsValue.value = value;
  showRoleBody.value = false;
};

const handleChangeSpaceCourses = (value) => {
  selectSpaceCoursesValue.value = value;
  showRoleBody.value = false;
};

const commonParams = computed(() => ({
  organizationId: profileStore.myProfileDetail.id,
  role: activeRole.value,
  spaces:
    selectSpaceCoursesValue.value.spaces?.map((item) => ({
      id: item.id,
      role: item.role,
    })) || [],
  courses:
    selectSpaceCoursesValue.value.courses?.map((item) => ({
      id: item.id,
      spaceId: item.spaceId,
      role: item.role,
    })) || [],
  calendars:
    selectCalendarsValue.value.map((item) => ({
      id: item.id,
      role: item.role,
    })) || [],
  secondaryRoles: billingAndDeveloper.value
    .filter((item) => item.checked)
    .map((item) => item.value),
}));
const handlerSend = () => {
  if (props.type === 'group') {
    handlerGroupSend();
  } else {
    handlerUserSend();
  }
};
const handlerGroupSend = async () => {
  try {
    if (inviteBtnDisabled.value) {
      return;
    }
    loading.value = true;
    await updateOrgGroupMemberRole({
      groupId: props.groupDetail?.id,
      ...commonParams.value,
    });
    if (!props.isEdit) {
      await createOrgGroupMember({
        organizationId: profileStore.myProfileDetail.id,
        groupId: props.groupDetail?.id,
        profileIds: props.invites.map((item) => item.id) || [],
      });
    }
    $toast.success(t('calendar.update.success.group'));
    emit('comfirm');
    clearData();
  } finally {
    loading.value = false;
  }
};
const handlerUserSend = async () => {
  try {
    if (inviteBtnDisabled.value) {
      return;
    }
    loading.value = true;
    if (props.isEdit && props.rolesDetail?.accepted) {
      const { updated } = await updateOrgMember({
        memberId: props.invites[0].memberId,
        profileId: props.invites[0].profileId,
        ...commonParams.value,
      });
      if (updated) {
        $toast.success(t('calendar.update.success.member'));
      }
    } else {
      const { invited } = await organizationInvitationsMembers({
        ids: [],
        emails: props.invites.map((item) => item.email) || [],
        ...commonParams.value,
      });
      if (invited) {
        $toast.success(t('calendar.update.success.invite'));
      }
    }
    emit('comfirm');
    clearData();
  } finally {
    loading.value = false;
  }
};
</script>
