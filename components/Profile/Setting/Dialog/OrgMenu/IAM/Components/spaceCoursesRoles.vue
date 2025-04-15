<template>
  <div class="relative flex flex-1 flex-col overflow-hidden">
    <div class="flex-1 overflow-hidden pb-[3rem]">
      <div class="mt-1 flex">
        <BaseInput
          v-model="searchValue"
          search
          clear
          fixed
          class="my-3 text-sm"
          :placeholder="$t('calendar.search.placeholder.space')"
        >
          <template #suffix>
            <div class="mb-[1.2rem]">
              <BaseListCollapse v-model="isCollapse" />
            </div>
          </template>
        </BaseInput>
      </div>
      <div
        v-infinite-scroll="loadData"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar max-h-[93%] overflow-y-auto"
      >
        <ProfileSettingDialogOrgMenuIAMComponentsSpaceItem
          v-for="item in spaceCoursesList"
          :key="item.value"
          :item="item"
          :invites="invites.length"
          :active-space-select="activeSpaceSelect"
          :active-courses-select="activeCoursesSelect"
          :open-list="openList"
          @change="handleSelectSpaceRole"
          @change-open="handleOpen"
          @change-courses="handleSelectCoursesRole"
        />
        <BaseSkeleton
          v-if="loading"
          :length="spaceCoursesList.length ? 3 : 15"
          height="3rem"
        />
        <BaseNoData
          v-if="!spaceCoursesList.length && !loading"
          class="text-[#D9D9D9]"
        />
      </div>
    </div>
    <div
      class="absolute bottom-0 flex w-full items-center justify-end bg-[#060606] py-2"
    >
      <BaseButton
        type="secondary"
        :disabled="
          (!activeSpaceSelect.length && !activeCoursesSelect.length) ||
          licensesMiss
        "
        icon="fa-sharp fa-regular fa-floppy-disk"
        data-cy="1ad91a42c67f6ec2"
        @click="handleSave"
      >
        {{ $t('base.upload.save') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { getOrgMembersResources } from '~/api/v2/org';
import { previewSpace } from '~/api/v2/space';
import { courseEvent } from '~/constant/eventBus';

const props = defineProps({
  value: {
    type: Object,
    default: () => ({ spaces: [], courses: [] }),
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
const emit = defineEmits(['change', 'back', 'getSpaceCourses']);
const profileStore = useProfileStore();
const { $eventBus } = useNuxtApp();
const licensesMiss = ref(false);
const activeSpaceSelect = ref(props.value.spaces || []);
const activeCoursesSelect = ref(props.value.courses || []);
const searchValue = ref('');
const isCollapse = ref(false);
const loading = ref(false);
const spaceCoursesList = ref([]);
const spaceCoursesOrginList = ref([]);
const next = ref(null);

watch(
  () => spaceCoursesOrginList.value,
  (value) => {
    if (props.isEdit) {
      activeSpaceSelect.value = value.filter((item) => item.role);
      value.forEach((space) => {
        space.rootFolder?.courses?.forEach((course) => {
          if (course.role) {
            activeCoursesSelect.value = [
              ...activeCoursesSelect.value,
              { ...course, spaceId: space.id },
            ];
          }
        });
        space.rootFolder?.subFolders?.forEach((folder) => {
          folder?.courses?.forEach((course) => {
            if (course.role) {
              activeCoursesSelect.value = [
                ...activeCoursesSelect.value,
                { ...course, spaceId: space.id },
              ];
            }
          });
        });
      });
    }
  },
  { immediate: true },
);

const fetchSpaceCoursesList = async () => {
  loading.value = true;
  try {
    const fetchAPI = props.isEdit ? getOrgMembersResources : previewSpace;
    const res = await fetchAPI({
      limit: 20,
      next: next.value || undefined,
      resourceType: props.isEdit ? 'course' : undefined,
      userId: props.isEdit ? props.userId : undefined,
      organizationId: props.isEdit
        ? profileStore.myProfileDetail.id
        : undefined,
    });
    const { data, cursor } = props.isEdit ? res.resourceRoles : res;
    spaceCoursesOrginList.value = [...spaceCoursesOrginList.value, ...data];
    next.value = cursor.next;
  } finally {
    loading.value = false;
  }
};

fetchSpaceCoursesList();

const loadData = async () => {
  if (loading.value || !next.value) {
    return;
  }
  await fetchSpaceCoursesList();
};

const filterSpacesAndCourses = (searchTerm = '') => {
  if (!searchTerm) {
    return spaceCoursesOrginList.value;
  }
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const data = spaceCoursesOrginList.value
    .map((space) => {
      const spaceNameMatches = space.name
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      // If the space name matches, return the entire space.
      if (spaceNameMatches) {
        return space;
      }
      // Filter courses.
      const filteredCourses = space.rootFolder.courses.filter((course) =>
        course.title.toLowerCase().includes(lowerCaseSearchTerm),
      );
      // Filter subfolders and their courses.
      const filteredSubFolders = space.rootFolder.subFolders
        .map((folder) => ({
          ...folder,
          courses: folder.courses.filter((course) =>
            course.title.toLowerCase().includes(lowerCaseSearchTerm),
          ),
        }))
        .filter((folder) => folder.courses.length > 0); // Only return folders that contain courses.

      // If the course name matches, return the filtered courses and non-empty folders.
      if (filteredCourses.length > 0 || filteredSubFolders.length > 0) {
        return {
          ...space,
          rootFolder: {
            ...space.rootFolder,
            courses: filteredCourses,
            subFolders: filteredSubFolders,
          },
        };
      }

      return null;
    })
    .filter((space) => space !== null);
  return data;
};

watch(
  () => [searchValue.value, spaceCoursesOrginList.value],
  () => {
    spaceCoursesList.value = filterSpacesAndCourses(searchValue.value);
  },
  { immediate: true },
);

const getSpaceCourses = () => {
  spaceCoursesOrginList.value = [];
  spaceCoursesList.value = [];
  next.value = null;
  fetchSpaceCoursesList();
};
onMounted(() => {
  $eventBus.on(courseEvent.UPDATE_IAM_ROLE_COURSE, getSpaceCourses);
});

onUnmounted(() => {
  activeSpaceSelect.value = [];
  activeCoursesSelect.value = [];
  $eventBus.off(courseEvent.UPDATE_IAM_ROLE_COURSE, getSpaceCourses);
});

const openList = ref([]);
watch(
  () => isCollapse.value,
  () => {
    if (isCollapse.value) {
      openList.value = spaceCoursesList.value.map((item) => item.id);
    } else {
      openList.value = [];
    }
  },
);
const handleOpen = (id) => {
  if (openList.value.includes(id)) {
    openList.value = openList.value.filter((item) => item !== id);
  } else {
    openList.value = [...openList.value, id];
  }
};

const handleSelectSpaceRole = (item) => {
  if (activeSpaceSelect.value.some((i) => i.id === item.id)) {
    const index = activeSpaceSelect.value.findIndex((i) => i.id === item.id);
    activeSpaceSelect.value[index] = item;
  } else {
    activeSpaceSelect.value = [...activeSpaceSelect.value, item];
  }
};

const handleSelectCoursesRole = (data) => {
  activeCoursesSelect.value = data;
};

watch(
  () => activeCoursesSelect.value,
  () => {
    if (
      activeCoursesSelect.value.some(
        (item) =>
          +item.availableLicense < props.invites.length && item.purchased,
      )
    ) {
      licensesMiss.value = true;
    } else {
      licensesMiss.value = false;
    }
  },
);

const handleSave = () => {
  if (
    (!activeSpaceSelect.value.length && !activeCoursesSelect.value.length) ||
    licensesMiss.value
  ) {
    return false;
  }
  emit('change', {
    spaces: activeSpaceSelect.value,
    courses: activeCoursesSelect.value,
  });
};
</script>
