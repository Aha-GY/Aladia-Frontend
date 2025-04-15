<template>
  <NuxtLayout>
    <div class="flex flex-col items-center pt-36">
      <div class="mb-8 flex items-center gap-4">
        <img src="~/assets/logo/image5.png" class="w-20" />
        <div class="text-3xl">Aladia</div>
      </div>
      <div class="mb-8">
        {{ $t('event.join.title', { type: type }) }}
      </div>
      <div v-if="authStore.logged" class="flex items-center gap-4">
        <BaseButton
          :loading="loading"
          data-cy="44ca2acac7023a17"
          @click="declineInvite"
        >
          {{ $t('nav.header.actions.decline') }}
        </BaseButton>
      </div>
      <div v-else>
        <BaseButton data-cy="8a51b83975fffef0" @click="onLogin">
          {{ $t('auth.button.login') }} / {{ $t('auth.button.signup') }}
        </BaseButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script>
import { declineOrganizationInvitations } from '~/api/v2/org';

export default {
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubCalendar = useHubCalendarStore();
    const hubEvent = useHubEventStore();
    const hubSpaces = useHubSpacesStore();
    const profileStore = useProfileStore();
    return {
      profileStore,
      hubSpaces,
      hubCourse,
      authStore,
      hubCalendar,
      hubEvent,
    };
  },
  data() {
    return {
      loading: false,
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
    async declineInvite() {
      if (this.type === 'calendar') {
        await this.declineCalendarInvite();
      }
      if (this.type === 'event') {
        await this.declineEventInvite();
      }
      if (this.type === 'organization') {
        await this.declineOrgInvite();
      }
    },

    async declineCalendarInvite() {
      try {
        this.loading = true;

        await this.hubCalendar.declineInvite({
          calendarId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('calendar.declined.title'));
        const url = `${this.authStore.hub}/calendar`;
        this.$router.replace(url);

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async declineEventInvite() {
      try {
        this.loading = true;

        await this.hubCalendar.declineEventInvite({
          eventId: this.eventId,
          calendarId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('calendar.declined.event'));
        const url = `${this.authStore.hub}/calendar`;
        this.$router.replace(url);

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async acceptOrgInvite() {
      try {
        this.acceptLoading = true;

        await declineOrganizationInvitations({
          organizationId: this.id,
          token: this.token,
        });

        this.$toast.success(this.$t('calendar.declined.org'));
        await this.profileStore.getMyOrganizations();
        this.$router.replace(`/user/hub/${this.id}/profile`);
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

      if (this.type === 'calendar') {
        this.checkCalendarMemberExists();
      }
      if (this.type === 'event') {
        this.checkEventMemberExists();
      }
    },

    async checkCalendarMemberExists() {
      const { exists } = await this.hubCalendar.checkMemberExists({
        calendarId: this.id,
      });
      if (exists) {
        const url = `${this.authStore.hub}/calendar`;
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
