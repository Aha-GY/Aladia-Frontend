<template>
  <div
    class="mb-2 flex cursor-pointer items-center rounded-5 border-l border-transparent bg-[#0A0A0A] px-2 py-1.5 transition-all duration-200 hover:bg-[#131313]"
  >
    <div
      class="relative flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-5 bg-[#E2E2E208]"
      data-cy="d908e682b38b5691"
      @click="handleCheck"
    >
      <i
        class="fa-solid fa-calendar-days text-[1.6rem]"
        :style="{ color: item.color }"
      />
      <div
        class="absolute -bottom-1 -right-1 rounded-full bg-[#0A0A0A] p-[0.08rem]"
      >
        <BaseCheckboxStyle
          :state="active === item.id ? 'correctChecked' : 'unchecked'"
        />
      </div>
    </div>
    <div
      class="ml-2 line-clamp-2 flex-1 text-sm text-[#F1F1F1]"
      data-cy="a6a77e0dfc02db53"
      @click="handleCheck"
    >
      {{ item.name }}
    </div>
    <div class="ml-2">
      <ProfileSettingDialogOrgMenuIAMComponentsRoleSelect
        v-model="role"
        :disabled="!active"
        :roles-list="rolesList"
        @change="changeRole"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  activeSelect: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['change']);

const rolesList = [
  {
    icon: 'fa-light fa-calendar-check',
    value: 'calendar-organizer',
    label: 'calendar.role.organizer',
  },
  {
    icon: 'fa-light fa-calendar-pen',
    value: 'calendar-scheduler',
    label: 'calendar.role.scheduler',
  },
  {
    icon: 'fa-light fa-calendar-users',
    value: 'calendar-participant',
    label: 'calendar.role.participant',
  },
];
const active = ref('');
const role = ref(null);
watch(
  () => props.activeSelect,
  (value) => {
    if (!value?.length) {
      active.value = '';
      role.value = null;
      return;
    }
    value?.forEach((select) => {
      if (select.id === props.item.id && select.role) {
        active.value = select.id;
        role.value = select.role;
      }
    });
  },
  { immediate: true, deep: true },
);

const handleCheck = () => {
  active.value = active.value === props.item.id ? '' : props.item.id;
  if (active.value) {
    role.value = role.value || rolesList[0].value;
  } else {
    role.value = null;
  }
  emit('change', { ...props.item, role: role.value });
};
const changeRole = () => {
  emit('change', { ...props.item, role: role.value });
};
</script>
