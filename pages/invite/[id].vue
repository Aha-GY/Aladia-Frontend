<template>
  <NuxtLayout>
    <div class="flex flex-col items-center pt-36">
      <div class="mb-8 flex items-center gap-4">
        <img src="~/assets/logo/image5.png" class="w-20" />
        <div class="text-3xl">Aladia</div>
      </div>
      <div class="mb-8">
        {{ $t('event.join.invited', { type: type }) }}
      </div>
      <div v-if="authStore.logged" class="flex items-center gap-4">
        <BaseButton
          :loading="acceptLoading"
          data-cy="8e79003161c79fa2"
          @click="acceptInvite"
        >
          {{ $t('nav.header.actions.accept') }}
        </BaseButton>
      </div>
      <div v-else>
        <BaseButton data-cy="0d702708dcf2e536" @click="onLogin">
          {{ $t('auth.button.login') }} / {{ $t('auth.button.signup') }}
        </BaseButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script>
import { acceptOrganizationInvitations } from '~/api/v2/org';

export default {
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubCalendar = useHubCalendarStore();
    const hubEvent = useHubEventStore();
    const hubSpaces = useHubSpacesStore();
    const profileStore = useProfileStore();
    const hubChat = useHubChatStore();
    return {
      profileStore,
      hubSpaces,
      hubCourse,
      authStore,
      hubCalendar,
      hubEvent,
      hubChat,
    };
  },
  data() {
    return {
      acceptLoading: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    type() {
      return this.$route.query.type;
    },
    role() {
      return this.$route.query.role;
    },
    from() {
      return this.$route.query.from;
    },
    name() {
      return this.$route.query.name;
    },
    token() {
      return this.$route.query.token;
    },
    eventId() {
      return this.$route.query.eventId;
    },
  },
  mounted() {
    this.checkExists();
  },
  methods: {
    async acceptInvite() {
      if (this.type === 'space') {
        await this.acceptSpaceInvite();
      }
      if (this.type === 'course') {
        await this.acceptCourseInvite();
      }
      if (this.type === 'calendar') {
        await this.acceptCalendarInvite();
      }
      if (this.type === 'event') {
        await this.acceptEventInvite();
      }
      if (this.type === 'organization') {
        await this.acceptOrgInvite();
      }
      if (this.type === 'room') {
        await this.acceptRoomInvite();
      }
    },
    async acceptSpaceInvite() {
      try {
        this.acceptLoading = true;

        await this.hubSpaces.acceptInvite({
          spaceId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.space'));
        const url = `${this.authStore.hub}/spaces`;
        this.$router.replace(url);

        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    async acceptCourseInvite() {
      try {
        this.acceptLoading = true;

        await this.hubCourse.acceptInvite({
          courseId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.course'));
        const url = `${this.authStore.hub}/spaces`;
        this.$router.replace(url);

        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    async acceptCalendarInvite() {
      try {
        this.acceptLoading = true;

        await this.hubCalendar.acceptInvite({
          calendarId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.calendar'));
        const url = `${this.authStore.hub}/calendar?calendarId=${this.id}`;
        this.$router.replace(url);

        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    async acceptEventInvite() {
      try {
        this.acceptLoading = true;

        await this.hubCalendar.acceptEventInvite({
          eventId: this.eventId,
          calendarId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.label'));
        const url = `${this.authStore.hub}/calendar?calendarId=${this.id}&eventId=${this.eventId}`;
        this.$router.replace(url);

        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    async acceptOrgInvite() {
      try {
        this.acceptLoading = true;

        await acceptOrganizationInvitations({
          organizationId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.org'));
        await this.profileStore.getMyOrganizations();
        this.$router.replace(`/organization/hub/${this.id}/profile`);
        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    async acceptRoomInvite() {
      try {
        this.acceptLoading = true;

        await this.hubChat.acceptInvite({
          roomId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('event.join.room'));
        const url = `${this.authStore.hub}/chat`;
        this.$router.replace(url);

        this.acceptLoading = false;
      } catch (error) {
        this.acceptLoading = false;
        throw error;
      }
    },
    checkExists() {
      if (!this.authStore.logged) {
        return;
      }

      if (this.type === 'space') {
        this.checkSpaceMemberExists();
      }
      if (this.type === 'calendar') {
        this.checkCalendarMemberExists();
      }
      if (this.type === 'event') {
        this.checkEventMemberExists();
      }
    },
    async checkSpaceMemberExists() {
      const { exists } = await this.hubSpaces.checkMemberExists({
        spaceId: this.id,
      });
      if (exists) {
        const url = `${this.authStore.hub}/spaces`;
        this.$router.replace(url);
      }
    },
    async checkCalendarMemberExists() {
      const { exists } = await this.hubCalendar.checkMemberExists({
        calendarId: this.id,
      });
      if (exists) {
        const url = `${this.authStore.hub}/calendar?calendarId=${this.id}`;
        this.$router.replace(url);
      }
    },
    async checkEventMemberExists() {
      const { exists } = await this.hubEvent.checkMemberExists({
        calendarId: this.id,
        eventId: this.eventId,
      });
      if (exists) {
        const url = `${this.authStore.hub}/calendar?calendarId=${this.id}&eventId=${this.eventId}`;
        this.$router.replace(url);
      }
    },
    onLogin() {
      this.authStore.popup = true;
    },
  },
};
</script>
