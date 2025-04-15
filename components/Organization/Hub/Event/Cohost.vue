<template>
  <div
    class="flex items-center gap-4 bg-[#060606]"
    :class="open ? 'sticky top-0 z-20 -my-4 py-4' : ''"
  >
    <div class="flex w-5 justify-center">
      <i class="fa-light fa-user-gear ml-0.5 text-base text-white/20" />
    </div>
    <div
      class="group/input relative flex flex-1 items-center justify-between font-light"
    >
      <div
        class="flex h-6 cursor-pointer items-center gap-1.5 rounded-5 bg-white/5 px-1.5 text-xs text-[#FAFAFA] hover:bg-white/10"
        data-cy="379c71f0bcf36b6a"
        @click="total && (open = !open)"
      >
        {{ $t('meet.roles.coHost', { total: total }) }}
        <i
          v-if="total"
          class="fa-light fa-chevron-down transition-all"
          :class="open ? 'rotate-180' : ''"
        />
      </div>
      <BaseMemberPreview
        :open="add"
        :members="allMembers"
        :total="total"
        :add="true"
        :remove="true"
        :online="true"
        width="1.75rem"
        gap="0.375rem"
        @open="add = true"
        @remove="onRemoveClick"
      />
      <!-- <BaseLine :active="open" /> -->
    </div>
  </div>
  <div
    class="pointer-events-none absolute left-0 top-[3.25rem] h-[calc(100%-3.25rem)] w-full overflow-hidden transition-all duration-300"
    :class="add ? 'z-40' : '-z-10'"
  >
    <Transition
      :name="add ? 'slide-fade-left' : 'slide-fade-right'"
      mode="out-in"
    >
      <div
        v-if="add"
        class="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-b-5 bg-[#060606] px-2"
      >
        <div class="flex items-center gap-1 pb-2 pt-3">
          <div
            class="flex size-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            @click="add = false"
          >
            <i class="fa-light fa-arrow-left text-base text-[#FAFAFA]" />
          </div>
          <div class="text-sm">Invite</div>
        </div>
        <div class="h-0 flex-1 py-2">
          <BaseMemberInvite
            :actives="addedMembers"
            :exclude="exclude"
            :params="inviteParams"
            not-save-when-remove-user
            @close="add = false"
            @save="onSave"
          />
        </div>
      </div>
    </Transition>
  </div>
  <BaseMemberInviteList
    v-if="open && total"
    :members="addedMembers"
    :is-resend="!!event.id"
    :params="listParams"
    :type="event.id && event.calendarId ? 'event' : ''"
    :exclude="removedIds"
    :is-footer="false"
    :is-add="false"
    @invite="onInvite"
    @close="open = false"
    @add="add = true"
    @remove="onRemoveClick"
  />
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const add = ref(false);
    const hubEvent = useHubEventStore();
    const authStore = useAuthStore();
    return { hubEvent, authStore, open, add };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    exclude() {
      const hostIds = this.event.hostMembers.map((r) => r.id);
      const guestIds = this.event.addedMembers
        .filter((r) => r.role === 'guest')
        .map((r) => r.profileId);
      return [...hostIds, ...guestIds, this.authStore.user.id];
    },
    total() {
      const coHostNumber = this.event.coHostNumber || 0;
      const addLength = this.addedMembers.length;
      const removeLength = this.removedIds.length;
      return Math.max(0, coHostNumber + addLength - removeLength);
    },
    removedIds() {
      return this.event.removedMembers
        .filter((r) => r.role === 'co-host')
        .map((r) => r.id || r.email);
    },
    addedMembers() {
      return this.event.addedMembers.filter((r) => r.role === 'co-host');
    },
    coHostMembers() {
      return this.event.coHostMembers || [];
    },
    allMembers() {
      const coHostMembers = this.coHostMembers.filter(
        (r) => !this.removedIds.includes(r.id),
      );
      return [...coHostMembers, ...this.addedMembers].slice(0, 4);
    },
    inviteParams() {
      return this.event.id
        ? {
            scope: 'event',
            scopeId: this.event.id,
          }
        : {};
    },
    listParams() {
      return this.event.id && this.event.calendarId
        ? {
            roles: 'co-host',
            calendarId: this.event.calendarId,
            eventId: this.event.id,
          }
        : {};
    },
  },
  methods: {
    onRemoveClick(member) {
      if (this.addedMembers.some((r) => member.id === r.id)) {
        this.event.addedMembers = this.event.addedMembers.filter(
          (item) => item.id !== member.id,
        );
      } else {
        this.event.removedMembers.push(member);
      }
      // this.event.coHosts = this.event.coHosts.filter(
      //   (item) => item.id !== member.id,
      // );
    },
    onSave(selecteds) {
      // this.event.coHosts = [...selecteds];
      const otherMembers = this.event.addedMembers.filter(
        (r) => r.role !== 'co-host',
      );
      this.event.addedMembers = [
        ...otherMembers,
        ...selecteds.map((r) => ({
          ...r,
          role: 'co-host',
          profileId: r.isInput ? null : r.id,
        })),
      ];
      this.add = false;
    },
    onInvite(member) {
      const data = {
        ids: [],
        emails: [],
      };
      if (member.id) {
        data.ids = [{ profileId: member.id, role: 'guest' }];
      } else {
        data.emails = [{ email: member.email, role: 'guest' }];
      }
      this.hubEvent.eventInvite({
        calendarId: this.event.calendarId,
        eventId: this.event.id,
        ...data,
      });
    },
  },
};
</script>
