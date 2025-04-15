<template>
  <div
    class="mb-4 flex h-12 items-center justify-between gap-2 rounded-t bg-white/5 px-2"
  >
    <div class="flex flex-1 items-center gap-2 text-sm">
      <div class="flex items-center justify-center gap-2 px-2 py-1">
        <i class="fa-regular fa-user-plus" />
        {{ $t('base.member.invite.user.add') }}
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm">
      <div
        v-if="canInvite"
        class="flex cursor-pointer items-center justify-center gap-2 rounded bg-white/5 px-2 py-1 hover:bg-white/10"
        data-cy="0a09b53d26fccc72"
        @click="dialog = true"
      >
        <i class="fa-solid fa-link" />
        {{ $t('base.member.invite.link') }}
      </div>
      <el-tooltip effect="light" content="Info" placement="bottom">
        <i
          class="fa-light fa-circle-info cursor-pointer text-10 text-[#565656] hover:text-[#E2E2E2]"
          @click="hubSidebar.invite.infoState = true"
        />
      </el-tooltip>
      <BaseIconClose data-cy="b084317e5a52d545" @click="onClose" />
    </div>
    <client-only>
      <el-dialog
        v-model="dialog"
        :show-close="false"
        append-to-body
        destroy-on-close
        width="28rem"
      >
        <div v-loading="loading">
          <div
            class="mb-4 flex h-12 items-center justify-between rounded-t-sm bg-white/5 px-4"
          >
            <div class="flex items-center gap-2 text-lg text-[#d9d9d9]">
              <i class="fa-solid fa-link" />
              {{ $t('base.member.invite.poplink') }}
            </div>
            <BaseIconClose data-cy="0299834f805649a5" @click="closeDialog" />
          </div>

          <div class="mb-4 flex items-center justify-between px-4 py-2">
            <div v-if="authStore.isOrg">
              {{ $t('base.member.invite.assign.orgRole') }}
            </div>
            <div v-else>
              {{ $t('base.member.invite.assign.role') }}
            </div>
            <el-select
              v-model="role"
              style="width: 8rem"
              placeholder="Role"
              data-cy="role-options-list"
            >
              <el-option
                v-for="role in roles"
                :key="role.value"
                :label="$t(role.label)"
                :value="role.value"
                :data-cy="`option-roles-${role.value}`"
                @change="handleSelectionChange"
                @click="isActive = false"
              >
                {{ $t(role.label) }}
              </el-option>
            </el-select>
          </div>
          <div class="pb-4">
            <div
              v-if="authStore.isOrg"
              class="mb-3 flex items-center gap-1.5 px-4"
            >
              <BaseCheckboxStyle
                :state="
                  activeCheckbox === 'checkbox1' ? 'checked' : 'unchecked'
                "
                @click="toggleCheckbox('checkbox1')"
              />

              <div class="text-xs">
                {{ $t('org.shared.invite') }}
                <span class="font-semibold">{{ $t('org.shared.member') }}</span>
                {{ $t('org.shared.at') }} {{ name }}.
              </div>
            </div>

            <div v-if="authStore.isOrg" class="flex items-center gap-1.5 px-4">
              <BaseCheckboxStyle
                :state="
                  activeCheckbox === 'checkbox2' ? 'checked' : 'unchecked'
                "
                @click="toggleCheckbox('checkbox2')"
              />
              <div class="text-xs">
                {{ $t('org.shared.notInvite') }}
                {{ $t('org.shared.at') }} {{ name }}.
              </div>
            </div>
          </div>
          <div
            v-if="activeCheckbox === 'checkbox1'"
            class="mx-4 mb-4 flex gap-2.5 rounded-lg bg-white/5 p-2.5 text-[#707070]"
          >
            <div class="flex">
              <i
                class="pt-0.5"
                :class="['far fa-circle-info', 'w-3', 'text-[#E2E2E2]']"
                style="font-size: 12px"
              />
              <h2 class="pl-2 text-xs font-light">
                {{ $t('org.shared.content') }}
                {{ role ? $t(role) : 'Role' }}
                {{
                  $t('org.shared.contentCont', {
                    type,
                  })
                }}
              </h2>
            </div>
          </div>
          <div
            v-if="activeCheckbox === 'checkbox2'"
            class="mx-4 mb-4 flex gap-2.5 rounded-lg bg-white/5 p-2.5 text-[#707070]"
          >
            <div class="flex">
              <i
                class="pt-0.5"
                :class="['far fa-circle-info', 'w-3', 'text-[#E2E2E2]']"
                style="font-size: 12px"
              />
              <h2 class="pl-2 text-xs font-light">
                {{ $t('org.shared.edit') }}
                {{ role ? $t(role) : 'Role' }}
                {{
                  $t('org.shared.editCont', {
                    type,
                  })
                }}
              </h2>
            </div>
          </div>
          <div class="px-4 pb-4">
            <div
              class="mb-4 w-full truncate border-b border-white/10 text-[#707070]"
              data-cy="invite-link"
            >
              {{ link }}
            </div>

            <div
              v-if="isActive"
              class="flex items-center gap-2 pb-4 transition duration-300"
            >
              <!-- <i class="fa-solid fa-link" /> -->
              <i class="fa-solid fa-triangle-exclamation" />
              <span class="text-xs font-normal text-[#CACACA]">
                {{ $t('base.member.invite.expires') }}
              </span>
            </div>

            <div
              :class="[
                'flex cursor-pointer items-center justify-center rounded py-2 font-medium transition duration-300',
                isActive
                  ? 'bg-[#296A35] text-white'
                  : 'bg-[#E0B92C] text-black hover:bg-[#cfa200]/80',
                !role
                  ? 'pointer-events-none cursor-not-allowed bg-[#e5e5e5]/60 opacity-50'
                  : '',
              ]"
              data-cy="836b6e33d149dac7"
              :disable="!role"
              @click="copyLink"
            >
              {{ buttonText }}
            </div>
          </div>
          <div class="mx-4 pb-4">
            <div
              class="flex cursor-pointer items-center justify-center rounded border border-[#E5E5E5]/5 py-2 font-medium"
            >
              <div class="flex" @click="hubSidebar.invite.infoState = true">
                <div
                  class="flex items-center"
                  @click="hubSidebar.invite.infoState = true"
                >
                  <i
                    class="pt-0.5 text-[#e5e5e5]/60"
                    :class="[
                      'fa-solid fa-question',
                      'w-3',
                      'text-[#e5e5e5]/60',
                    ]"
                    style="font-size: 12px"
                  />
                  <h2 class="pl-1 text-xs font-light text-[#e5e5e5]/60">
                    Learn more about roles and permissions
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- <OrganizationHubSidebarPermission :permission="info" /> Please do not delete as we may need it later. -->
    </client-only>
  </div>
</template>

<script>
import { IS_DEV } from '~/constant';
import {
  SPACE_ROLES,
  COURSE_ROLES,
  CALENDAR_ROLES,
  ROOM_ROLES,
} from '~/constant/roles';

export default {
  props: {
    type: String,
  },
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubCalendar = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    const hubChat = useHubChatStore();
    const router = useRoute();
    const profileStore = useProfileStore();
    return {
      hubCourse,
      hubSpaces,
      authStore,
      hubSidebar,
      hubCalendar,
      hubChat,
      profileStore,
      router,
    };
  },
  data() {
    return {
      link: '',
      loading: false,
      dialog: false,
      isActive: false,
      activeCheckbox: null,
      roleOption: null,
      selectedOption: '',
      role: '',
    };
  },
  computed: {
    info() {
      return this.hubSidebar.permission.state;
    },
    buttonText() {
      return this.isActive
        ? this.$t('index.copy.success')
        : this.$t('index.copy.title');
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    course() {
      return this.hubSidebar.course.data;
    },
    calendar() {
      return this.hubSidebar.calendar.data;
    },
    room() {
      return this.hubChat.roomInfo;
    },
    roles() {
      if (this.type === 'course') {
        return COURSE_ROLES;
      }

      if (this.type === 'space') {
        return SPACE_ROLES;
      }

      if (this.type === 'calendar') {
        return CALENDAR_ROLES;
      }

      if (this.type === 'room') {
        return ROOM_ROLES;
      }

      return [];
    },
    canInvite() {
      if (this.type === 'room') {
        return this.room.type === 'group' ? true : false;
      }
      return true;
    },
    name() {
      return this.profileStore.myProfileDetail.name;
    },
  },
  watch: {
    role() {
      this.getInviteLink();
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },

    closeDialog() {
      this.dialog = false;
      this.hubSidebar.invite.state = false;
    },

    handleSelectionChange() {
      this.isActive = !!this.selectedOption;
    },
    async copyLink() {
      if (!this.role) {
        return;
      }
      await this.$copyText(this.link);
      this.$toast.success(this.$t('index.copy.success'));
      this.isActive = true;
    },
    async getInviteLink() {
      try {
        if (this.type === 'space') {
          await this.getSpaceInviteLink();
        }

        if (this.type === 'course') {
          await this.getCourseInviteLink();
          if (this.copyLink) {
            this.isActive = false;
          }
        }

        if (this.type === 'calendar') {
          await this.getCalendarInviteLink();
        }

        if (this.type === 'room') {
          await this.getRoomInviteLink();
        }
        this.loading = false;
      } catch (error) {
        this.dialog = false;
        throw error;
      }
    },
    async getSpaceInviteLink() {
      try {
        this.loading = true;
        const { link } = await this.hubSpaces.getInviteLink({
          spaceId: this.space.id,
          role: this.role,
        });

        if (IS_DEV) {
          this.link = link.replace(
            'https://develop.aladia.io',
            `http://localhost:3000`,
          );
        } else {
          this.link = link;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getCourseInviteLink() {
      try {
        this.loading = true;

        const { link } = await this.hubCourse.getInviteLink({
          courseId: this.course.id,
          role: this.role,
        });

        if (IS_DEV) {
          this.link = link.replace(
            'https://develop.aladia.io',
            `http://localhost:3000`,
          );
        } else {
          this.link = link;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getCalendarInviteLink() {
      try {
        this.loading = true;

        const { link } = await this.hubCalendar.getInviteLink({
          calendarId: this.calendar.id,
          role: this.role,
        });

        if (IS_DEV) {
          this.link = link.replace(
            'https://develop.aladia.io',
            `http://localhost:3000`,
          );
        } else {
          this.link = link;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getRoomInviteLink() {
      try {
        this.loading = true;

        const { link } = await this.hubChat.getInviteLink({
          roomId: this.room.id,
          role: this.role,
        });

        if (IS_DEV) {
          this.link = link.replace(
            'https://develop.aladia.io',
            `http://localhost:3000`,
          );
        } else {
          this.link = link;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    handlePermission() {
      this.hubSidebar.permission.state = true;
    },
    toggleCheckbox(checkbox) {
      this.activeCheckbox = this.activeCheckbox === checkbox ? null : checkbox;
    },
  },
};
</script>
