<template>
  <div
    ref="space"
    data-type="space"
    :data-id="space.id"
    :data-folder-id="space.rootFolder.id"
    :data-draging="isDraging ? 'true' : 'false'"
    class="flex h-12 items-center justify-between px-5"
    :style="{
      opacity: isDraging ? '0.5' : '1',
      pointerEvents: isDraging ? 'none' : '',
    }"
  >
    <div class="flex h-full flex-1 items-center gap-4">
      <OrganizationHubSpaceListHandle
        :item="space"
        :class="
          expand || checked || $device.isMobile
            ? ''
            : 'opacity-0 group-hover/space:opacity-100'
        "
      />
      <OrganizationHubSpaceListCheckbox
        :item="space"
        :space="space"
        :class="
          expand || checked || $device.isMobile
            ? ''
            : 'opacity-0 group-hover/space:opacity-100'
        "
      />
      <div
        class="flex size-4 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        data-cy="1451c757bb595154"
        @click="$emit('expand')"
      >
        <i
          class="fa-light fa-chevron-right scale-90 text-xs text-white/50 transition-all duration-300"
          :class="expand ? 'rotate-90' : ''"
        />
      </div>
      <div class="relative shrink-0">
        <BaseSpaceLogo
          class="!size-8 !text-2xl"
          :space="space"
          :expand="expand"
        />
        <el-popover
          v-if="space.invitedBy"
          placement="bottom-start"
          :width="260"
          trigger="hover"
          :popper-options="{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [-20, 10],
                },
              },
            ],
          }"
        >
          <template #reference>
            <div
              class="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border border-dashed border-yellow-400 bg-black text-xs leading-none text-yellow-400"
            >
              <i class="fa-light fa-share-nodes -translate-x-[1px] scale-90" />
            </div>
          </template>
          <div class="flex items-center gap-2 p-1.5">
            <BaseAvatarNext
              :picture="space.invitedBy?.picture"
              :has-story="space.invitedBy?.hasActiveStory"
              :user-id="space.invitedBy?.id"
              :online="space.invitedBy?.online"
              :story="space.invitedBy?.story"
              source="profile"
              size="sm"
            />
            <div class="w-0 flex-1 truncate">
              Shared by
              <span class="text-sm text-white">
                {{ space.invitedBy?.name }}
              </span>
            </div>
          </div>
        </el-popover>
      </div>
      <div
        class="flex h-full flex-1 cursor-pointer items-center text-13"
        data-cy="bf65a88d21646059"
        @click="$emit('expand')"
      >
        {{ space.name }}
      </div>
    </div>
    <div class="hidden items-center gap-4 md:flex">
      <div class="flex items-center gap-1 text-xs text-white/70">
        <i class="fa-solid fa-folder" />
        {{ $t('space.count.folders', { amount: space.numberOf.folders }) }}
      </div>
      <div class="mr-4 flex items-center gap-1 text-xs text-white/70">
        <i class="fa-solid fa-video" />
        {{ $t('space.count.courses', { amount: space.numberOf.courses }) }}
      </div>
      <BaseMemberPreview
        add
        :members="members"
        data-cy="aaeb22a5e5ae0dbd"
        @click="onEdit"
      />
      <el-popover
        v-if="!isShopping"
        ref="more"
        :width="150"
        trigger="click"
        placement="bottom-end"
        @show="open = true"
        @hide="open = false"
      >
        <template #reference>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded"
            :class="checked || open ? 'bg-white/10' : 'hover:bg-white/10'"
          >
            <i class="fa-light fa-ellipsis" />
          </div>
        </template>
        <div class="flex flex-col gap-1 p-1 text-sm">
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="7132c17e7038c81d"
            @click="onEdit"
          >
            <i class="fa-regular fa-pen-to-square" />
            {{ $t('space.edit.info') }}
          </div>
          <div
            data-v-if="!isShopping"
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="15833c35193611c8"
            @click="onLeave"
          >
            <i class="fa-light fa-arrow-right-from-bracket" />
            {{ $t('space.leave.label') }}
          </div>
          <div
            data-v-if="!isShopping"
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="97fba46010309ecf"
            @click="onDelete"
          >
            <i class="fa-light fa-trash" />
            {{ $t('base.editor.delete') }}
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    expand: Boolean,
    index: Number,
    space: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return {
      authStore,
      hubSpaces,
      hubCourse,
      hubSidebar,
    };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    checked() {
      return this.space._state === 'checked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
    user() {
      return this.authStore.user;
    },
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    members() {
      return this.space.members.filter(Boolean);
    },
  },
  methods: {
    onDelete() {
      this.$refs.more.hide();
      this.hubSpaces.deleteSpace = this.space;
    },
    onLeave() {
      this.$refs.more.hide();
      this.hubSpaces.leaveSpace = this.space;
    },
    onEdit() {
      this.$refs.more.hide();
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.state = true;
    },
  },
};
</script>
