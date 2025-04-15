<template>
  <div
    class="group mb-1 flex cursor-pointer items-center px-1.5 py-1.5 transition-all duration-200 hover:bg-[#E2E2E20A]"
    :class="{
      'bg-[#E2E2E20A]': active === item.id,
    }"
  >
    <div
      class="relative flex h-[1.75rem] w-[3rem] items-center justify-center rounded-5"
      data-cy="efd546abca28100d"
      @click="handleCheck"
    >
      <div
        class="flex h-[1.75rem] w-[3rem] items-center justify-center overflow-hidden rounded-[0.12rem] bg-[#E2E2E208]"
      >
        <img
          v-if="item.thumbnail?.url"
          :src="item.thumbnail?.url"
          class="h-full w-full"
        />
        <i v-else class="fa-solid fa-panorama text-[1rem] text-[#505050]" />
      </div>
      <div
        class="absolute -bottom-1 -right-1 rounded-full bg-[#131313] p-[0.08rem]"
      >
        <BaseCheckboxStyle
          :state="active === item.id ? 'correctChecked' : 'unchecked'"
        />
      </div>
    </div>
    <div
      class="ml-2 line-clamp-2 flex-1 text-sm text-[#F1F1F1]"
      data-cy="3f07ff9e4d986ae6"
      @click="handleCheck"
    >
      {{ item.title }}
    </div>
    <div class="ml-2">
      <div v-if="item.purchased" class="flex items-center">
        <div
          v-if="item.availableLicense < invites && active === item.id"
          class="rounded-5 bg-[#2A0E0E] px-1 py-1 text-xs font-medium text-[#E02C2C]"
        >
          <el-popover :width="340" trigger="hover">
            <template #reference>
              <i class="fa-sharp fa-solid fa-circle-exclamation mr-1" />
            </template>
            <div class="px-3 py-2 text-base text-[#B0B0B0]">
              <p class="mt-2">
                {{ $t('course.license.error') }}
              </p>
              <br />
              <p>
                {{ $t('course.license.option') }}
              </p>
              <ul class="list-disc pl-5">
                <li>{{ $t('course.license.purchase') }}</li>
                <li>
                  {{ $t('course.license.save') }}
                </li>
              </ul>
            </div>
          </el-popover>
          <span class="font-semibold">
            {{ invites - +item.availableLicense }}
          </span>
          {{ $t('course.license.missing') }}
        </div>
        <div
          v-else
          class="rounded-5 bg-[#2A230E] px-1 py-1 text-xs font-medium text-[#E0B92C]"
        >
          <span class="font-semibold">
            {{ item.availableLicense - (active === item.id ? invites : 0) }}
          </span>
          Licenses
        </div>
        <div
          class="ml-2 flex cursor-pointer items-center justify-center rounded-5 p-1 hover:bg-white/5"
          data-cy="bbd9fd5be7200759"
          @click="dialogShow = true"
        >
          <i class="fa-regular fa-arrow-right" />
        </div>
      </div>
      <ProfileSettingDialogOrgMenuIAMComponentsRoleSelect
        v-else
        v-model="role"
        :disabled="!active"
        :roles-list="rolesList"
        @change="changeRole"
      />
    </div>
  </div>
  <OrganizationHubCourseLicenses
    v-model:show-dialog="dialogShow"
    :course-id="item.id"
    :space-id="spaceId"
  />
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  invites: {
    type: Number,
    default: 0,
  },
  spaceId: {
    type: String,
    default: '',
  },
  activeCoursesSelect: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['change']);
const rolesList = [
  {
    icon: 'fa-light fa-eye',
    value: 'course-observer',
    label: 'calendar.role.observer',
  },
  {
    icon: 'fa-light fa-person-chalkboard',
    value: 'course-teacher',
    label: 'calendar.role.teacher',
  },
  {
    icon: 'fa-light fa-book-open-reader',
    value: 'course-attendant',
    label: 'calendar.role.attendant',
  },
];

const dialogShow = ref(false);
const active = ref('');
const role = ref('');
watch(
  () => props.activeCoursesSelect,
  () => {
    if (
      props.activeCoursesSelect.some(
        (select) =>
          select.spaceId === props.spaceId &&
          select.id === props.item.id &&
          select.role,
      )
    ) {
      active.value = props.item.id;
      role.value = props.activeCoursesSelect.find(
        (select) =>
          select.spaceId === props.spaceId && select.id === props.item.id,
      ).role;
    } else {
      active.value = '';
      role.value = null;
    }
  },
  { immediate: true, deep: true },
);

const handleCheck = () => {
  active.value = active.value ? '' : props.item.id;
  if (active.value) {
    role.value = role.value || rolesList[0].value;
  } else {
    role.value = null;
  }
  changeRole();
};
const changeRole = () => {
  emit('change', { ...props.item, role: role.value, spaceId: props.spaceId });
};
</script>
