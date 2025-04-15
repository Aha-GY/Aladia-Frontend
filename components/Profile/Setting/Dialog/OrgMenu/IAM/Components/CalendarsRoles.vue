<template>
  <div class="relative flex flex-1 flex-col overflow-hidden">
    <div class="flex-1 overflow-hidden pb-[3rem]">
      <div
        v-infinite-scroll="loadData"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar max-h-[98%] overflow-y-auto"
      >
        <ProfileSettingDialogOrgMenuIAMComponentsCalendarsItem
          v-for="item in calendarsList"
          :key="item.value"
          :item="item"
          :active-select="activeSelect"
          @change="handleSelectCalendarRole"
        />
        <BaseSkeleton
          v-if="loading"
          :length="calendarsList.length ? 3 : 15"
          height="3rem"
        />
        <BaseNoData
          v-if="!calendarsList.length && !loading"
          class="text-[#D9D9D9]"
        />
      </div>
    </div>
    <div
      class="absolute bottom-0 flex w-full items-center justify-end bg-[#060606] py-2"
    >
      <BaseButton
        type="secondary"
        :disabled="!activeSelect.length"
        icon="fa-sharp fa-light fa-floppy-disk"
        data-cy="250d8be642c73ea2"
        @click="handleSave"
      >
        {{ $t('base.upload.save') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { getCalendarList } from '~/api/v2/calendar';
import { getOrgMembersResources } from '~/api/v2/org';

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  invites: {
    type: Array,
    default: () => [],
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['change', 'back']);
const profileStore = useProfileStore();
const activeSelect = ref(props.value || []);
const loading = ref(false);
const calendarsList = ref([]);
const next = ref(null);

watch(
  () => calendarsList.value,
  (value) => {
    if (props.isEdit) {
      activeSelect.value = value.filter((item) => item.role);
    }
  },
  { immediate: true },
);

const fetchCalendarsList = async () => {
  loading.value = true;
  try {
    const fetchAPI = props.isEdit ? getOrgMembersResources : getCalendarList;
    const res = await fetchAPI({
      limit: 20,
      next: next.value || undefined,
      resourceType: props.isEdit ? 'calendar' : undefined,
      userId: props.isEdit ? props.userId : undefined,
      organizationId: props.isEdit
        ? profileStore.myProfileDetail.id
        : undefined,
    });
    const { data, cursor } = props.isEdit ? res.resourceRoles : res;
    calendarsList.value = [...calendarsList.value, ...data];
    next.value = cursor.next;
  } finally {
    loading.value = false;
  }
};

fetchCalendarsList();

const loadData = async () => {
  if (loading.value || !next.value) {
    return;
  }
  await fetchCalendarsList();
};

onUnmounted(() => {
  activeSelect.value = [];
});

const handleSelectCalendarRole = (item) => {
  if (activeSelect.value.some((i) => i.id === item.id)) {
    const index = activeSelect.value.findIndex((i) => i.id === item.id);
    activeSelect.value[index] = item;
  } else {
    activeSelect.value = [...activeSelect.value, item];
  }
};

const handleSave = () => {
  if (!activeSelect.value.length) {
    return;
  }
  emit('change', activeSelect.value);
};
</script>
