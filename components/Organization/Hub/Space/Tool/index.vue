<template>
  <div class="mb-6 flex items-center justify-between text-xs">
    <div class="flex items-center gap-3">
      <div
        class="flex h-7 cursor-pointer items-center justify-center border-b px-2 transition-all"
        :class="
          type === 'all'
            ? 'border-white text-white'
            : 'border-transparent text-white/50 hover:border-white hover:text-white'
        "
        @click="onTypeClick('all')"
      >
        All
      </div>
      <div
        class="flex h-7 cursor-pointer items-center justify-center border-b px-2 transition-all"
        :class="
          type === 'my'
            ? 'border-white text-white'
            : 'border-transparent text-white/50 hover:border-white hover:text-white'
        "
        @click="onTypeClick('my')"
      >
        My Spaces
      </div>
      <div
        class="flex h-7 cursor-pointer items-center justify-center border-b px-2 transition-all"
        :class="
          type === 'shared'
            ? 'border-white text-white'
            : 'border-transparent text-white/50 hover:border-white hover:text-white'
        "
        @click="onTypeClick('shared')"
      >
        Shared
      </div>
    </div>
    <div class="flex items-center gap-2">
      <BaseButton
        v-if="isTop || view === 'list'"
        type="outline"
        is-thin
        data-cy="new-space-icon"
        @click="onNewSpacePrecheck"
      >
        <span class="group-hover/btn:hidden">
          <i class="fa-light fa-plus" />
        </span>
        <span class="hidden group-hover/btn:flex">
          <i class="fa-solid fa-plus" />
        </span>
        {{ $t('org.space.new') }}
      </BaseButton>
      <div v-if="view === 'grid' && !isTop" class="flex items-center gap-2">
        <BaseButton
          v-if="isSpace"
          type="outline"
          is-thin
          data-cy="new-folder-button"
          @click="onFolderCreate"
        >
          <span class="group-hover/btn:hidden">
            <i class="fa-light fa-folder-plus" />
          </span>
          <span class="hidden group-hover/btn:flex">
            <i class="fa-solid fa-folder-plus" />
          </span>
          {{ $device.isMobile ? $t('space.folder') : $t('space.new.folder') }}
        </BaseButton>
        <BaseButton
          v-if="
            (authStore.isTeacher || authStore.isOrg) && !isShopping && !isTop
          "
          type="outline"
          is-thin
          data-cy="4130341f807772b5"
          @click="onCourseCreate"
        >
          <span class="group-hover/btn:hidden">
            <i class="fa-light fa-video-plus" />
          </span>
          <span class="hidden group-hover/btn:flex">
            <i class="fa-solid fa-video-plus" />
          </span>
          {{ $device.isMobile ? $t('space.course') : $t('space.new.course') }}
        </BaseButton>
      </div>
      <div class="flex items-center gap-1.5 rounded bg-black p-1 text-sm">
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="
            view === 'list' && !state ? 'bg-white/20' : 'hover:bg-white/10'
          "
          data-cy="ab72b967b51869f2"
          @click="onViewClick('list')"
        >
          <i class="fa-light fa-list-ul" />
        </div>
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="
            view === 'list' && state === 'open'
              ? 'bg-white/20'
              : 'hover:bg-white/10'
          "
          data-cy="b6e0e873ce1d3b7e"
          @click="onViewClick('list', 'open')"
        >
          <i class="fa-light fa-list-tree" />
        </div>
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="view === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'"
          data-cy="886d1f0832eaca27"
          @click="onViewClick('grid')"
        >
          <i class="fa-light fa-table-cells-large" />
        </div>
      </div>
      <div
        class="flex size-8 cursor-pointer items-center justify-center rounded bg-black hover:bg-white/10"
        data-cy="6e82725510d0f61f"
        @click="statistics.expand = !statistics.expand"
      >
        <i
          class="fa-light fa-chevron-down text-sm transition-all duration-300"
          :class="statistics.expand ? 'rotate-180' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { paymentEvent } from '~/constant/eventBus';

export default {
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    const paymentStore = usePaymentStore();

    return {
      authStore,
      hubSpaces,
      hubSidebar,
      paymentStore,
    };
  },
  computed: {
    statistics() {
      return this.hubSpaces.statistics;
    },
    isTop() {
      return !this.$route.query.space;
    },
    view() {
      return this.$route.query.view || 'grid';
    },
    type() {
      return this.$route.query.type || 'all';
    },
    state() {
      return this.$route.query.state;
    },
    user() {
      return this.authStore.user;
    },
    isOrg() {
      return this.authStore.isOrg;
    },
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
    },
    isFolder() {
      return !!this.folderId;
    },
    isSpace() {
      return !!this.spaceId && !this.isFolder;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    folder() {
      return this.hubSpaces.find(this.folderId);
    },
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    hasServiceSubscription() {
      return this.authStore.hasServiceSubscription;
    },
  },
  mounted() {
    this.$eventBus.on(paymentEvent.SUB_SERVICE_SUCCESS, this.handleSubSuccess);
  },
  beforeUnmount() {
    this.$eventBus.off(paymentEvent.SUB_SERVICE_SUCCESS, this.handleSubSuccess);
  },
  methods: {
    onNewSpace() {
      this.hubSidebar.state = true;
      this.hubSidebar.space.autoGenerated = true;
    },
    onViewClick(view, state) {
      this.$router.push({
        query: {
          view,
          state,
          type: this.type,
          space: this.spaceId,
        },
      });

      if (view === 'list') {
        if (state) {
          this.hubSpaces.spacesExpand = this.hubSpaces.spaces.map(
            (space) => space.id,
          );
        } else {
          this.hubSpaces.spacesExpand = [this.spaceId];
        }
      }
    },
    onTypeClick(type) {
      this.$router.push({
        query: {
          type,
          view: this.view,
        },
      });
    },
    onNewSpacePrecheck() {
      if (!this.hasServiceSubscription) {
        this.paymentStore.setServiceDialog(true);
      } else {
        this.onNewSpace();
      }
    },
    onCourseCreate() {
      this.hubSidebar.createSidebarCourse({
        space: this.space,
        folder: this.isFolder ? this.folder : this.space.rootFolder,
      });
    },
    onFolderCreate() {
      this.hubSidebar.createSidebarFolder({
        space: this.space,
      });
    },
    handleSubSuccess() {
      this.onNewSpace();
    },
  },
};
</script>
