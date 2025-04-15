<template>
  <div
    ref="popup"
    class="flex h-full w-full flex-col justify-between rounded-md bg-[#000000] p-1 pt-4"
  >
    <div class="px-4">
      <BaseInput
        v-model="username"
        search
        clear
        fixed
        class="mb-3 text-sm"
        placeholder="Search user…"
        @enter="onEnter"
      >
        <template #suffix>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            @click="open = !open"
          >
            <i class="fa-light fa-user-plus text-xs text-[#FAFAFA]" />
          </div>
        </template>
      </BaseInput>
      <BaseMemberInviteSelected
        v-if="open"
        :selecteds="selecteds"
        @remove="onRemove"
      />
    </div>
    <div
      v-if="open"
      class="hide-scrollbar h-full overflow-y-auto bg-[#000000] px-4"
    >
      <OrganizationHubCourseAiSubjectTeacherPopupItem
        v-for="member in membersSort"
        :key="member.id"
        :member="member"
      />
      <BaseSkeleton v-if="loading" height="3.5rem" />
    </div>
    <div v-else class="hide-scrollbar h-full overflow-y-auto bg-[#000000] px-4">
      <OrganizationHubCourseAiSubjectTeacherPopupPreview
        v-for="member in membersSort"
        :key="member.id"
        :member="member"
      />
      <BaseSkeleton v-if="loading" height="3.5rem" />
    </div>
    <div class="flex justify-between bg-[#0C0C0C] p-2 text-sm font-normal">
      <button
        class="flex items-center gap-2 rounded-md bg-[#A20F0F]/10 p-2 text-[#D9D9D9] hover:bg-[#A20F0F]/15"
        @click="ai.isTeacherPopup = false"
      >
        <i class="fa-light fa-reply text-sm" />
        <span class="text-sm">cancel</span>
      </button>
      <button
        class="flex items-center gap-2 rounded-md p-2 text-[#707070] hover:bg-white/5"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-sharp fa-regular fa-screen-users text-sm" />
        <div class="text-sm">Assign as Teachers</div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const open = ref(false);
    const popup = ref(null);

    onClickOutside(popup, () => {
      hubCourse.ai.isTeacherPopup = false;
    });

    return {
      hubCourse,
      hubSubject,
      open,
      popup,
    };
  },
  data() {
    return {
      username: '',
      loading: false,
      timer: null,
      end: false,
      next: null,
      deleting: false,
      saving: false,
      members: [...this.hubSubject.courseMembers],
    };
  },
  computed: {
    ai() {
      return this.hubCourse.ai || {};
    },
    selecteds() {
      return this.hubSubject.selectedTeachers;
    },
    isEmail() {
      return checkMail(this.username.trim());
    },
    membersWithId() {
      return this.selecteds.filter((member) => !member.isInput);
    },
    membersWithEmail() {
      return this.selecteds.filter(
        (member) => member.isInput && member.isEmail,
      );
    },
    membersSort() {
      return [
        ...this.members.filter((member) => member.checked),
        ...this.members.filter((member) => !member.checked),
      ];
    },
  },
  watch: {
    username() {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        const input = this.username.trim().toLowerCase();

        if (input) {
          this.members = this.hubSubject.courseMembers.filter(
            (member) =>
              member.fullName?.toLowerCase().includes(input) ||
              member.email?.toLowerCase().includes(input),
          );
        } else {
          this.members = [...this.hubSubject.courseMembers];
        }
      }, 500);
    },
  },
  methods: {
    async onSave() {
      if (
        this.membersWithId.length === 0 &&
        this.membersWithEmail.length === 0
      ) {
        return this.$toast.error('Please select at least one teacher');
      }

      this.hubSubject.detail.subjects.find(
        (s) => s.id === this.hubSubject.activeSubject,
      ).teachers = this.selecteds.map((m) => m.id);

      this.ai.isTeacherPopup = false;
    },
    onEnter() {
      const input = this.username.trim();
      if (!this.selecteds.find((s) => s.email === input)) {
        this.selecteds.push({
          id: input,
          isInput: true,
          isEmail: this.isEmail,
          email: input,
        });
        this.username = '';
      }
    },
    onRemove(member) {
      member.checked = false;
      this.selecteds.splice(
        this.selecteds.findIndex((m) => m.id === member.id),
        1,
      );
    },
  },
};
</script>
