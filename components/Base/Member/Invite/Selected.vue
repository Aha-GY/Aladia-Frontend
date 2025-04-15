<template>
  <div
    v-if="selecteds.length"
    class="hide-scrollbar mb-4 flex max-h-[17.5rem] flex-wrap gap-1 overflow-y-auto"
  >
    <div
      v-for="member in selectedList"
      :key="member.id"
      class="flex max-w-[49%] items-center rounded-3xl p-1 text-white/70"
      :class="
        member.isInput && !member.isEmail
          ? 'bg-[#140c0c] hover:bg-[#221414]'
          : 'bg-white/10 hover:bg-white/20'
      "
    >
      <div v-if="member.isInput" class="flex w-full items-center gap-2">
        <div
          class="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm"
        >
          <i v-if="member.isEmail" class="fa-solid fa-envelope" />
          <i v-else class="fa-light fa-circle-exclamation" />
        </div>
        <div class="truncate text-13 text-white">{{ member.email }}</div>
        <div
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          data-cy="bbf9802d13af65ab"
          @click="onRemove(member)"
        >
          <i class="fa-solid fa-close text-xs" />
        </div>
      </div>
      <div v-else class="flex w-full items-center gap-2">
        <div class="relative">
          <BaseAvatarNext
            :online="member.online"
            :picture="member.picture"
            :story="member?.story"
            :user-id="member?.id"
            :show-online="false"
            size="sm"
          />
        </div>
        <div class="truncate text-13 text-white">{{ member.fullName }}</div>
        <div
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          data-cy="7288b2e610d85e85"
          @click="onRemove(member)"
        >
          <i class="fa-solid fa-close text-xs" />
        </div>
      </div>
    </div>
    <div
      v-if="selecteds.length > 6"
      class="flex cursor-pointer items-center gap-2 rounded-3xl bg-white/10 p-1 text-white/70 hover:bg-white/20"
      @click="show = !show"
    >
      <div
        class="flex size-7 items-center justify-center rounded-full bg-white/5 text-sm"
      >
        <i class="fa-light fa-users" />
      </div>
      <div class="truncate text-13 text-white">{{ label }}</div>
      <div
        class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
      >
        <i
          class="fa-light fa-chevron-down text-xs transition-all"
          :class="show ? 'rotate-180' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selecteds: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    selectedList() {
      return this.show ? this.selecteds : this.selecteds.slice(0, 6);
    },
    label() {
      return this.show ? 'Less' : `More ${this.selecteds.length - 6}`;
    },
  },
  methods: {
    onRemove(member) {
      this.$emit('remove', member);
    },
  },
};
</script>
