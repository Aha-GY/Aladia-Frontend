<template>
  <div class="p-2">
    <div
      class="flex items-center justify-between rounded border border-white/20 px-4 py-3 text-xs"
    >
      <div class="flex items-center gap-2">
        <div>{{ checkeds.length }} Elements selected</div>
        <i
          class="fa-light fa-circle-xmark cursor-pointer text-sm"
          @click="onClose"
        />
      </div>
      <div class="flex items-center gap-4">
        <button>
          <i class="fa-regular fa-share-nodes" />
        </button>
        <div class="h-4 w-[1px] bg-white/20" />
        <button
          class="flex items-center text-[#EF4444]"
          @click="removePopup = true"
        >
          <i v-if="removing" class="fa-solid fa-spinner animate-spin text-sm" />
          <i v-else class="fa-light fa-trash-can" />
        </button>
      </div>
    </div>
    <el-dialog
      v-model="removePopup"
      :show-close="false"
      append-to-body
      destroy-on-close
      width="24rem"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
        >
          <div class="flex items-center gap-2 text-sm">
            <i class="fa-light fa-trash-can" />
            Delete
          </div>
          <BaseIconClose @click="removePopup = false" />
        </div>
        <div
          class="flex flex-col gap-2 px-5 py-5 text-sm font-light text-white/70"
        >
          <div>You art about to delete [X] items.</div>
          <div>This action cannot be undone.</div>
        </div>
        <div class="flex items-center justify-end gap-4 p-3">
          <div
            class="flex cursor-pointer items-center gap-2 text-sm"
            @click="removePopup = false"
          >
            <i class="fa-regular fa-arrow-left-from-bracket" />
            Cancel
          </div>
          <BaseButton type="error" @click="onRemove">
            <div class="flex size-3 items-center justify-center">
              <i
                v-if="removing"
                class="fa-light fa-loader animate-spin text-base"
              />
              <i v-else class="fa-light fa-trash-can text-sm" />
            </div>
            Delete
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      removePopup: false,
      removing: false,
    };
  },
  computed: {
    checkeds() {
      return this.hubSpaces.checkeds;
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  methods: {
    onClose() {
      this.hubSpaces.uncheck();
    },
    async onRemove() {
      if (this.removing) {
        return;
      }

      const courseIds = this.checkeds
        .filter((item) => item._type === 'course')
        .map((item) => item.id);

      const folderIds = this.checkeds
        .filter((item) => item._type === 'folder')
        .map((item) => item.id);

      try {
        this.removing = true;

        await Promise.all(
          courseIds.map((courseId) =>
            this.hubSpaces.deleteCourseFromSpace({
              courseId,
            }),
          ),
        );

        await Promise.all(
          folderIds.map((folderId) =>
            this.hubSpaces.removeFolder({
              spaceId: this.space.id,
              folderId,
            }),
          ),
        );

        this.hubSpaces.uncheck();
        this.removePopup = false;
        this.$emit('refresh', { folderIds, courseIds });
        this.removing = false;
      } catch (error) {
        this.removing = false;
        throw error;
      }
    },
  },
};
</script>
