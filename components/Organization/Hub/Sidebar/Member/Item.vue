<template>
  <div
    v-loading="loading"
    class="mb-1 flex items-center justify-between gap-2 rounded p-1"
    :class="{
      'bg-[#E0B92C]/10 hover:bg-[#E0B92C]/15': invited,
      'bg-[#FF2D2D]/10 hover:bg-[#FF2D2D]/15': expired,
      'hover:bg-white/10': !expired && !invited,
    }"
  >
    <div v-if="member.id" class="flex flex-1 items-center gap-2">
      <BaseAvatarNext
        :picture="member.picture"
        :has-story="member.hasActiveStory"
        :user-id="member.id"
        :online="member.online"
        :story="member.story"
        source="profile"
        size="md"
      >
        <template #button>
          <div
            v-if="member.id === createdBy"
            class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#6419B4]"
          >
            <i
              class="fa-solid fa-key text-[0.5rem] font-extrabold text-white"
            />
          </div>
          <div
            v-else-if="expired"
            class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#B91C1C]"
          >
            <i
              class="fa-solid fa-paper-plane text-[0.5rem] font-extrabold text-white"
            />
          </div>
          <div
            v-else-if="invited"
            class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#E0B92C]"
          >
            <i
              class="fa-solid fa-paper-plane text-[0.5rem] font-extrabold text-[#3B2F02]"
            />
          </div>
        </template>
      </BaseAvatarNext>
      <div class="w-0 flex-1">
        <div
          class="truncate text-sm text-white"
          :class="
            isLocal ? '' : 'cursor-pointer underline-offset-4 hover:underline'
          "
          @click="goProfile(member.id)"
          v-html="fullName"
        />
        <div class="flex items-center gap-1.5 text-11 text-white/50">
          <div v-if="member.id === createdBy">{{ formattedType }} Creator</div>
          <div v-else-if="expired">Invitation has expired</div>
          <div v-else-if="invited" class="flex items-center gap-1">
            Invited {{ timeAgo(member.invitedAt) }}
            <el-tooltip
              v-if="member.expiresAt"
              effect="light"
              placement="bottom"
            >
              <i
                class="fa-solid fa-info-circle cursor-pointer text-xs text-[#707070]"
              />
              <template #content>
                <div class="text-xs text-[#D9D9D9]">
                  Expire in
                  <span class="text-[#F35D4E]">
                    {{ formatDate(member.expiresAt, 'HH') }}hrs
                    {{ formatDate(member.expiresAt, 'mm') }}mins
                  </span>
                  on {{ formatDate(member.expiresAt, 'MMM DD, YYYY') }}
                </div>
              </template>
            </el-tooltip>
          </div>
          <div v-else>
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-1 items-center gap-2">
      <div class="flex size-[3.875rem] shrink-0 items-center justify-center">
        <div
          class="flex size-12 items-center justify-center rounded-full bg-white/5"
        >
          <i class="fa-solid fa-envelope text-white/50" />
        </div>
      </div>
      <div class="w-0 flex-1">
        <div class="w-40 truncate text-sm text-white">{{ member.email }}</div>
        <div class="flex items-center gap-1.5 text-11 text-white/50">
          <div v-if="expired">Invitation has expired</div>
          <div v-else-if="invited" class="flex items-center gap-1">
            Invited {{ timeAgo(member.invitedAt) }}
            <el-tooltip
              v-if="member.expiresAt"
              effect="light"
              placement="bottom"
            >
              <i
                class="fa-solid fa-info-circle cursor-pointer text-xs text-[#707070]"
              />
              <template #content>
                <div class="text-xs text-[#D9D9D9]">
                  Expire in
                  <span class="text-[#F35D4E]">
                    {{ formatDate(member.expiresAt, 'HH') }}hrs
                    {{ formatDate(member.expiresAt, 'mm') }}mins
                  </span>
                  on {{ formatDate(member.expiresAt, 'MMM DD, YYYY') }}
                </div>
              </template>
            </el-tooltip>
          </div>
          <div v-else>
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
        </div>
      </div>
    </div>
    <el-select
      v-model="member.role"
      style="width: 8rem"
      placeholder="Role"
      :data-disabled="disableEdit"
      @change="updateMember"
    >
      <el-option
        v-for="role in roles"
        :key="role.value"
        :label="isOwner ? $t('org.owner') : $t(role.label)"
        :value="role.value"
      >
        {{ $t(role.label) }}
      </el-option>
    </el-select>
    <el-popover
      ref="more"
      :data-if="(invited && !disableEdit) || !disableRemove"
      :width="150"
      trigger="click"
      placement="bottom-end"
    >
      <template #reference>
        <div
          class="flex size-6 cursor-pointer items-center justify-center rounded text-xs hover:bg-white/10"
        >
          <i class="fa-solid fa-ellipsis" />
        </div>
      </template>
      <div class="flex flex-col gap-1 p-1">
        <div
          v-if="invited && !disableEdit"
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
          data-cy="75cace5fa25f8197"
          @click="resendInvite"
        >
          <div class="flex size-4 items-center justify-center text-xs">
            <i class="fa-solid fa-reply-clock" />
          </div>
          {{ $t('org.invited.resend') }}
        </div>
        <div
          data-v-if="!disableRemove"
          class="flex cursor-pointer items-center gap-2 rounded bg-[#1a0a0a] px-2 py-1 hover:bg-[#3b1616]"
          data-cy="c8276828ae9757b7"
          @click="removeMember"
        >
          <div class="flex size-4 items-center justify-center text-xs">
            <i class="fa-solid fa-trash" />
          </div>
          {{ invited ? $t('org.invited.delete') : $t('org.invited.remove') }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import dayJS from 'dayjs';

import { SPACE_ROLES, COURSE_ROLES, CALENDAR_ROLES } from '~/constant/roles';

export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'space',
    },
    permissions: {
      type: Array,
      default: () => [],
    },
    query: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubCalendar = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    const profileStore = useProfileStore();
    return {
      hubCourse,
      authStore,
      hubSpaces,
      hubCalendar,
      hubSidebar,
      profileStore,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
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
    owner() {
      return this.space.owner;
    },
    // 当前用户是否是拥有者（创建者）
    isOwner() {
      const id = this[this.type]?.owner?.id;
      return id === this.member.id;
    },
    // 是否是本人
    isLocal() {
      return this.authStore.user.id === this.member.id;
    },
    roles() {
      let result = [];

      if (this.type === 'course') {
        result = cloneDeep(COURSE_ROLES);
      }

      if (this.type === 'space') {
        result = cloneDeep(SPACE_ROLES);
      }

      if (this.type === 'calendar') {
        result = cloneDeep(CALENDAR_ROLES);
      }

      // 如果当前角色不在角色列表中，则添加到角色列表中
      if (
        !result.find((role) => role.value === this.member.role) &&
        this.member.role
      ) {
        const label = this.member.role.split('-')[1];
        result.push({
          value: this.member.role,
          label: label.charAt(0).toUpperCase() + label.slice(1),
        });
      }

      return result;
    },
    isPending() {
      return this.member.invited && this.member.invitationStatus === 'pending';
    },
    invited() {
      return this.type === 'calendar' ? this.isPending : this.member.invited;
    },
    expired() {
      const nowAt = dayJS().toISOString();
      return this.invited && nowAt > this.member.expiresAt;
    },
    disableEdit() {
      return this.isLocal || this.isOwner || !this.permissions.includes('edit');
    },
    disableRemove() {
      return (
        this.isLocal || this.isOwner || !this.permissions.includes('delete')
      );
    },
    fullName() {
      if (this.query) {
        return highlightKeywords(this.member.fullName || '', [this.query]);
      } else {
        return this.member.fullName;
      }
    },
    formattedType() {
      return this.type
        ? this.type.charAt(0).toUpperCase() + this.type.slice(1)
        : '';
    },
  },
  mounted() {
    this.member.lastRole = this.member.role;
  },
  methods: {
    async updateMember(role) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.member.role = role;

        if (this.type === 'space') {
          await this.hubSpaces.updateMember({
            role,
            spaceId: this.space.id,
            profileId: this.member.id,
          });
        }

        if (this.type === 'course') {
          await this.hubCourse.updateMember({
            role,
            courseId: this.course.id,
            profileId: this.member.id,
          });
        }

        if (this.type === 'calendar') {
          await this.hubCalendar.updateMember({
            role,
            calendarId: this.calendar.id,
            profileId: this.member.id,
          });
        }

        this.$toast.success('Role changed successfully');
        this.member.lastRole = role;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.member.role = this.member.lastRole;
        throw error;
      }
    },
    async resendInvite() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.$refs.more.hide();

        const updateList = [];
        const membersWithId = this.member.id
          ? [{ profileId: this.member.id, role: this.member.role }]
          : [];
        const membersWithEmail = this.member.id
          ? []
          : [{ email: this.member.email }];

        if (this.type === 'space') {
          const data = await this.hubSpaces.inviteMembers({
            spaceId: this.space.id,
            membersWithId,
            membersWithEmail,
          });
          if (Array.isArray(data)) {
            updateList.push(...data);
          }
        }

        if (this.type === 'course') {
          const data = await this.hubCourse.inviteMembers({
            courseId: this.course.id,
            membersWithId,
            membersWithEmail,
          });
          if (Array.isArray(data)) {
            updateList.push(...data);
          }
        }

        if (this.type === 'calendar') {
          const data = await this.hubCalendar.inviteMembers({
            calendarId: this.calendar.id,
            ids: membersWithId,
            emails: membersWithEmail,
          });
          if (Array.isArray(data)) {
            updateList.push(...data);
          }
        }

        this.$toast.success('Invite sent successfully');
        updateList.map(
          (r) => r.id === this.member.id && Object.assign(this.member, r),
        );
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async removeMember() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.$refs.more.hide();

        if (this.type === 'space') {
          if (this.member.invited) {
            await this.hubSpaces.cancelInvite({
              spaceId: this.space.id,
              email: this.member.email,
            });
          } else {
            await this.hubSpaces.removeMember({
              spaceId: this.space.id,
              profileId: this.member.id,
            });
          }
          const space = await this.hubSpaces.getSpace({
            spaceId: this.space.id,
          });
          this.space.numberOf = space.numberOf;
        }

        if (this.type === 'course') {
          await this.hubCourse.removeMember({
            courseId: this.course.id,
            profileId: this.member.id ? this.member.id : undefined,
            email: this.member.id ? undefined : this.member.email,
          });
        }

        if (this.type === 'calendar') {
          if (this.invited) {
            await this.hubCalendar.cancelInvite({
              calendarId: this.calendar.id,
              email: this.member.email,
            });
          } else {
            await this.hubCalendar.removeMember({
              calendarId: this.calendar.id,
              profileId: this.member.id,
            });
          }
        }

        if (this.invited) {
          this.$toast.success('Invite deleted successfully');
        } else {
          this.$toast.success('Member removed successfully');
        }
        this.$el.classList.add('hidden');
        this.$emit('remove');
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    goProfile(id) {
      if (this.isLocal) {
        return;
      }
      // this.$router.push(`/profile/${id}`);
      this.profileStore.gotoProfilePage({ id });
    },
  },
};
</script>
