<template>
  <div
    class="flex max-h-64 flex-col gap-1 overflow-y-auto overscroll-none transition-all"
  >
    <BaseMemberInviteItem
      v-for="member in members"
      :key="member.id"
      :member="member"
      :search-value="searchValue"
      from="personal"
      :is-tag="actives.includes(member.id)"
      @show="onShow"
      @remove="onRemove"
    />
  </div>
</template>
<script>
export default {
  props: {
    searchValue: String,
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const fluxesStore = useFluxesStore();
    return { hubCalendarStore, fluxesStore };
  },
  computed: {
    actives() {
      return this.hubCalendarStore.userActives;
    },
    members() {
      return this.hubCalendarStore.members.filter((member) =>
        member.fullName.toLowerCase().includes(this.searchValue.toLowerCase()),
      );
    },
  },
  methods: {
    onShow(member) {
      const index = this.actives.indexOf(member.id);
      if (index === -1) {
        this.actives.push(member.id);
        this.hubCalendarStore.retrivePrivateCalendar(
          {
            profileId: member.id,
          },
          member.picture,
        );
      } else {
        this.actives.splice(index, 1);
        this.hubCalendarStore.personalEvents =
          this.hubCalendarStore.personalEvents.filter(
            (r) => r.memberId !== member.id,
          );
      }
    },
    async onRemove(member) {
      this.hubCalendarStore.members = this.members.filter(
        (item) => item.id !== member.id,
      );
      await this.hubCalendarStore.commonEvents();

      this.hubCalendarStore.personalEvents =
        this.hubCalendarStore.personalEvents.filter(
          (r) => r.memberId !== member.id,
        );
    },
  },
};
</script>
