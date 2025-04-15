<template>
  <div
    class="group mb-2 cursor-pointer rounded-5 border-l border-transparent bg-[#0A0A0A] py-1.5 transition-all duration-300"
    :class="{
      'bg-[#131313]': open,
      'bg-[#1a1a1a]': activeSpace === item.id && open,
      'hover:bg-[#131313]': activeSpace !== item.id,
    }"
    :style="{
      borderColor: hover || open ? item.color : 'transparent',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="mx-2 flex items-center rounded-5 px-2 py-1"
      :class="{
        'bg-[#E2E2E20A]': activeSpace === item.id,
      }"
    >
      <div
        class="mr-1 flex h-6 w-6 items-center justify-center rounded-5 group-hover:bg-white/5"
        data-cy="81cc9555c4405df4"
        @click="handleOpen"
      >
        <i
          class="fa-light fa-chevron-right transition-all duration-200"
          :class="{
            'rotate-90': open,
          }"
        />
      </div>
      <div class="flex flex-1 items-center">
        <div
          class="relative flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-5 bg-[#E2E2E208]"
          data-cy="b2fbd5c2b120c207"
          @click="handleSpaceCheck()"
        >
          <img
            v-if="item.image?.url"
            :src="item.image.url"
            class="h-full w-full overflow-hidden rounded-5"
          />
          <i
            v-else
            class="fa-light text-[1.4rem]"
            :class="[
              item.icon ? item.icon : 'fa-hexagon',
              // hover ? 'fa-solid' : 'fa-light',
            ]"
            :style="{ color: item.color }"
          />
          <div
            class="absolute -bottom-1 -right-1 rounded-full bg-[#131313] p-[0.08rem]"
          >
            <BaseCheckboxStyle
              :state="activeSpace === item.id ? 'correctChecked' : 'unchecked'"
            />
          </div>
        </div>
        <div
          class="ml-2 line-clamp-2 flex-1 text-sm text-[#F1F1F1]"
          data-cy="3cee04f91dde5b82"
          @click="handleSpaceCheck()"
        >
          {{ item.name }}
        </div>
        <div class="ml-2">
          <ProfileSettingDialogOrgMenuIAMComponentsRoleSelect
            v-model="roleSpace"
            :disabled="!(activeSpace === item.id)"
            :roles-list="SpaceRolesList"
            @change="changeSpaceRole"
          />
        </div>
      </div>
    </div>
    <div v-show="open" class="space-item ml-7 mr-4 mt-2">
      <div class="mb-2 ml-3 text-sm text-white">Folder & Courses</div>
      <div
        v-for="fold in item.rootFolder?.subFolders"
        :key="fold.id"
        class="folders-item relative mb-2 ml-3 rounded-5 bg-[#E2E2E20A] py-1.5"
        :class="{
          'active-folders-item': activeSpace === item.id,
        }"
      >
        <svg
          class="absolute left-[-0.85rem] top-[1rem]"
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
        >
          <path
            d="M8.05594 5.06509C8.19051 5.03419 8.27456 4.90006 8.24366 4.76549C8.21277 4.63092 8.07863 4.54687 7.94406 4.57777L8.05594 5.06509ZM0.75 -1.19908e-05C0.749921 1.65445 1.20142 2.82178 1.90511 3.62961C2.60629 4.43455 3.5351 4.85643 4.44394 5.06509C5.3521 5.27359 6.25445 5.27271 6.92528 5.22137C7.26171 5.19562 7.54237 5.15699 7.73966 5.12463C7.83836 5.10845 7.91634 5.09381 7.97017 5.0831C7.99709 5.07775 8.01798 5.07337 8.03241 5.07027C8.03963 5.06872 8.04524 5.06749 8.04918 5.06661C8.05114 5.06617 8.0527 5.06583 8.05383 5.06557C8.05439 5.06544 8.05485 5.06534 8.0552 5.06526C8.05538 5.06522 8.05556 5.06518 8.05565 5.06516C8.05581 5.06512 8.05594 5.06509 8 4.82143C7.94406 4.57777 7.94414 4.57775 7.94419 4.57774C7.94417 4.57774 7.94419 4.57774 7.94416 4.57775C7.94408 4.57776 7.94391 4.5778 7.94362 4.57787C7.94306 4.57799 7.94207 4.57822 7.94068 4.57853C7.93789 4.57915 7.93345 4.58012 7.92742 4.58142C7.91537 4.58401 7.89695 4.58787 7.8726 4.59271C7.82388 4.60241 7.75147 4.61602 7.65875 4.63123C7.47321 4.66165 7.20698 4.69835 6.88713 4.72283C6.24542 4.77194 5.39771 4.77105 4.55583 4.57777C3.71463 4.38464 2.89342 4.00295 2.28213 3.30119C1.67335 2.60233 1.24993 1.55983 1.25 1.19908e-05L0.75 -1.19908e-05Z"
            fill="#383838"
            stroke="#383838"
            stroke-width="0.8"
          />
        </svg>
        <div
          class="folder flex items-center"
          data-cy="410eed8aabcd9540"
          @click="openFolder(fold)"
        >
          <BaseIconFolder
            :open="
              !!(!collapseFoldList.includes(fold.id) && fold.courses.length)
            "
            class="ml-1 h-[1.75rem] w-[3rem]"
          />
          <span class="ml-2 text-sm text-[#D9D9D9]">{{ fold.name }}</span>
          <span v-if="!fold.courses.length" class="pl-1.5 text-white/30">
            {{ $t('calendar.empty') }}
          </span>
        </div>
        <div
          v-show="fold.courses.length && !collapseFoldList.includes(fold.id)"
          class="mt-2"
        >
          <ProfileSettingDialogOrgMenuIAMComponentsCoursesItem
            v-for="courses in fold.courses"
            :key="courses.id"
            :item="courses"
            :space-id="item.id"
            :invites="invites"
            :active-courses-select="activeCoursesSelect"
            @change="handleCoureses"
          />
        </div>
      </div>
      <div
        v-for="courses in item.rootFolder.courses"
        :key="courses.id"
        class="courses-item relative ml-3"
        :class="{
          'active-courses-item': activeSpace === item.id,
        }"
      >
        <svg
          class="absolute left-[-0.85rem] top-[1.3rem]"
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
        >
          <path
            d="M8.05594 5.06509C8.19051 5.03419 8.27456 4.90006 8.24366 4.76549C8.21277 4.63092 8.07863 4.54687 7.94406 4.57777L8.05594 5.06509ZM0.75 -1.19908e-05C0.749921 1.65445 1.20142 2.82178 1.90511 3.62961C2.60629 4.43455 3.5351 4.85643 4.44394 5.06509C5.3521 5.27359 6.25445 5.27271 6.92528 5.22137C7.26171 5.19562 7.54237 5.15699 7.73966 5.12463C7.83836 5.10845 7.91634 5.09381 7.97017 5.0831C7.99709 5.07775 8.01798 5.07337 8.03241 5.07027C8.03963 5.06872 8.04524 5.06749 8.04918 5.06661C8.05114 5.06617 8.0527 5.06583 8.05383 5.06557C8.05439 5.06544 8.05485 5.06534 8.0552 5.06526C8.05538 5.06522 8.05556 5.06518 8.05565 5.06516C8.05581 5.06512 8.05594 5.06509 8 4.82143C7.94406 4.57777 7.94414 4.57775 7.94419 4.57774C7.94417 4.57774 7.94419 4.57774 7.94416 4.57775C7.94408 4.57776 7.94391 4.5778 7.94362 4.57787C7.94306 4.57799 7.94207 4.57822 7.94068 4.57853C7.93789 4.57915 7.93345 4.58012 7.92742 4.58142C7.91537 4.58401 7.89695 4.58787 7.8726 4.59271C7.82388 4.60241 7.75147 4.61602 7.65875 4.63123C7.47321 4.66165 7.20698 4.69835 6.88713 4.72283C6.24542 4.77194 5.39771 4.77105 4.55583 4.57777C3.71463 4.38464 2.89342 4.00295 2.28213 3.30119C1.67335 2.60233 1.24993 1.55983 1.25 1.19908e-05L0.75 -1.19908e-05Z"
            fill="#383838"
            stroke="#383838"
            stroke-width="0.8"
          />
        </svg>
        <ProfileSettingDialogOrgMenuIAMComponentsCoursesItem
          :item="courses"
          :space-id="item.id"
          :active-courses-select="activeCoursesSelect"
          :invites="invites"
          @change="handleCoureses"
        />
      </div>
      <div
        v-if="
          !item.rootFolder.courses.length && !item.rootFolder?.subFolders.length
        "
      >
        <BaseNoData
          icon-wrapper-class="h-[2rem] w-[2rem]"
          icon-size="text-[1rem]"
        />
      </div>
    </div>
  </div>
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
  activeSpaceSelect: {
    type: Array,
    default: () => [],
  },
  activeCoursesSelect: {
    type: Array,
    default: () => [],
  },
  openList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['change', 'changeOpen', 'changeCourses']);
const hover = ref(false);
const SpaceRolesList = [
  {
    icon: 'fa-light fa-clipboard-list-check',
    value: 'space-supervisor',
    label: 'calendar.role.supervisor',
  },
  {
    icon: 'fa-light fa-compass',
    value: 'space-coordinator',
    label: 'calendar.role.coordinator',
  },
  {
    icon: 'fa-light fa-user',
    value: 'space-member',
    label: 'calendar.role.member',
  },
];

const open = computed(() => props.openList.includes(props.item.id));
const activeSpace = ref('');
const activeCourses = ref();
const roleSpace = ref(null);
watch(
  () => props.activeCoursesSelect,
  () => {
    activeCourses.value = [...props.activeCoursesSelect];
  },
  { immediate: true, deep: true },
);
watch(
  () => props.activeSpaceSelect,
  (value) => {
    if (!value?.length) {
      activeSpace.value = '';
      roleSpace.value = null;
      return;
    }
    value?.forEach((select) => {
      if (select.id === props.item.id && select.role) {
        activeSpace.value = select.id;
        roleSpace.value = select.role;
      }
    });
  },
  { immediate: true },
);

const handleOpen = () => {
  emit('changeOpen', props.item.id);
};

const collapseFoldList = ref([]);
const openFolder = (fold) => {
  if (collapseFoldList.value.includes(fold.id)) {
    collapseFoldList.value = collapseFoldList.value.filter(
      (i) => i !== fold.id,
    );
  } else {
    collapseFoldList.value = [...collapseFoldList.value, fold.id];
  }
};
const handleSpaceCheck = () => {
  activeSpace.value = activeSpace.value === props.item.id ? '' : props.item.id;
  if (activeSpace.value) {
    roleSpace.value = roleSpace.value || SpaceRolesList[0].value;
    props.item?.rootFolder?.courses?.forEach((course) => {
      if (
        !activeCourses.value.some(
          (i) => i.id === course.id && i.spaceId === props.item.id,
        )
      ) {
        activeCourses.value = [
          ...activeCourses.value,
          { ...course, spaceId: props.item.id, role: 'course-observer' },
        ];
      }
    });
    props.item.rootFolder?.subFolders?.forEach((fold) => {
      fold.courses?.forEach((course) => {
        if (
          !activeCourses.value.some(
            (i) => i.id === course.id && i.spaceId === props.item.id,
          )
        ) {
          activeCourses.value = [
            ...activeCourses.value,
            { ...course, spaceId: props.item.id, role: 'course-observer' },
          ];
        }
      });
    });
  } else {
    roleSpace.value = null;
    activeCourses.value = activeCourses.value.filter(
      (i) => i.spaceId !== props.item.id,
    );
  }
  emit('changeCourses', activeCourses.value);
  changeSpaceRole();
};
const changeSpaceRole = () => {
  emit('change', { ...props.item, role: roleSpace.value });
};

const handleCoureses = (item) => {
  const index = activeCourses.value.findIndex(
    (i) => i.spaceId === item.spaceId && i.id === item.id,
  );
  if (index > -1) {
    activeCourses.value[index] = item;
  } else {
    activeCourses.value = [...activeCourses.value, item];
  }
  emit('changeCourses', activeCourses.value);
  if (
    activeCourses.value.some(
      (item) => item.spaceId === props.item.id && item.role,
    )
  ) {
    activeSpace.value = props.item.id;
    roleSpace.value = roleSpace.value || SpaceRolesList[2].value;
  }
  changeSpaceRole();
};
</script>
<style lang="scss" scoped>
.space-item {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -0.05rem;
    width: 1px;
    height: 100%;
    background-color: #383838;
  }
}
.courses-item {
  position: relative;
  &:nth-last-child(1) {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -0.8rem;
      width: 1px;
      height: 39%;
      background-color: #131313;
      z-index: 10;
    }
  }
  &.active-courses-item {
    &:nth-last-child(1) {
      &::after {
        background-color: #1a1a1a;
      }
    }
  }
}
.folders-item {
  position: relative;
  &:nth-last-child(1) {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -0.8rem;
      width: 1px;
      height: 50%;
      background-color: #131313;
      z-index: 10;
    }
  }
  &.active-folders-item {
    &:nth-last-child(1) {
      &::after {
        background-color: #1a1a1a;
      }
    }
  }
}
</style>
