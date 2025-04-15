<template>
  <div
    ref="folder"
    data-type="folder"
    :data-id="folder.id"
    :data-draging="isDraging ? 'true' : 'false'"
    class="flex h-12 items-center justify-between px-3"
    :style="{
      opacity: isDraging ? '0.5' : '1',
      pointerEvents: isDraging ? 'none' : '',
    }"
    :data-cy="`space-folder-list-${folder.id}`"
  >
    <div class="flex h-full flex-1 items-center gap-4">
      <OrganizationHubSpaceListHandle
        :item="folder"
        :class="
          expand || checked || $device.isMobile
            ? ''
            : 'opacity-0 group-hover/folder:opacity-100'
        "
      />
      <OrganizationHubSpaceListCheckbox
        :item="folder"
        :folder="folder"
        :space="space"
        :class="
          expand || checked || $device.isMobile
            ? ''
            : 'opacity-0 group-hover/folder:opacity-100'
        "
      />
      <div
        class="flex size-4 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        data-cy="2b447dbdd2afee5a"
        @click="$emit('expand')"
      >
        <i
          class="fa-light fa-chevron-right scale-90 text-xs text-white/50 transition-all duration-300"
          :class="expand ? 'rotate-90' : ''"
        />
      </div>
      <BaseIconFolder :open="expand" class="size-6" />
      <div
        class="flex h-full flex-1 cursor-pointer items-center text-13"
        data-cy="bea144489dfebd5f"
        @click="$emit('expand')"
      >
        {{ folder.name }}
      </div>
    </div>
    <div class="flex items-center">
      <el-popover
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
            :class="
              checked || open
                ? 'bg-white/10'
                : 'opacity-0 group-hover/folder:opacity-100'
            "
          >
            <i class="fa-light fa-ellipsis text-sm" />
          </div>
        </template>
        <div class="flex flex-col gap-1 p-1 text-sm">
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="81536594cbf0d310"
            @click="onEditName"
          >
            <i class="fa-regular fa-pen-to-square" />
            {{ $t('space.edit.name') }}
          </div>
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="90589fa2e905f517"
            @click="onCollapse"
          >
            <i class="fa-light fa-folder-xmark" />
            {{ $t('space.collapse') }}
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
    folder: Object,
    space: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    checked() {
      return this.folder._state === 'checked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
  },
  methods: {
    onEditName() {
      this.$refs.more.hide();
      this.hubSpaces.editFolder = this.folder;
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.children.state = true;
      this.hubSidebar.state = true;
    },
    onCollapse() {
      this.$refs.more.hide();
      this.hubSpaces.deleteFolder = [this.folder];
    },
  },
};
</script>
