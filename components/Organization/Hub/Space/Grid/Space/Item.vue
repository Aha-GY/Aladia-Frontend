<template>
  <div class="w-full shrink-0 p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
    <div
      ref="space"
      data-type="space"
      :data-id="space.id"
      :data-folder-id="space.rootFolder.id"
      class="group/space relative cursor-pointer rounded bg-black"
      :data-cy="`space-item-card-${space.id}`"
      @pointermove="hover = true"
      @pointerleave="hover = false"
      @click="onClick"
    >
      <div class="flex h-40 flex-wrap items-start rounded-t bg-white/10 p-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex w-1/4 items-center justify-center"
        >
          <el-popover
            v-if="item._type === 'course'"
            placement="bottom"
            :width="300"
            trigger="hover"
            :show-after="1000"
            @show="onCourseShow(item)"
          >
            <template #reference>
              <BaseCourseThumbnail
                class="h-8 cursor-pointer border border-transparent hover:border-white"
                :url="item.thumbnail?.url"
                @click.stop="onCourseClick(item)"
              />
            </template>
            <div class="flex items-center gap-2 p-1">
              <BaseAvatarProgress
                :member="item.owner"
                :completion="item.completion"
              />
              <div>
                <div
                  v-if="item.loading"
                  class="skeleton mb-1 h-4 w-36 overflow-hidden rounded-sm"
                />
                <div
                  v-else
                  class="mb-1 h-4 max-w-48 gap-1 truncate text-13 text-white/50"
                >
                  {{ item.owner?.name }}
                </div>

                <div class="line-clamp-2 max-w-48 text-13">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </el-popover>
          <el-popover
            v-if="item._type === 'folder'"
            placement="bottom"
            :width="300"
            trigger="hover"
            :show-after="1000"
            @show="onFolderShow(item)"
          >
            <template #reference>
              <div
                class="flex aspect-video h-8 cursor-pointer items-center justify-center rounded border border-transparent hover:border-white hover:bg-white/5"
                @click.stop="onFolderClick(item)"
              >
                <BaseIconFolder class="size-8" />
              </div>
            </template>
            <div class="flex items-center gap-2 p-2">
              <BaseIconFolder class="size-12" />
              <div>
                <div
                  v-if="item.loading"
                  class="skeleton mb-1 h-4 w-36 overflow-hidden rounded-sm"
                />
                <div
                  v-else
                  class="mb-1 flex items-center gap-1 text-13 text-white/50"
                >
                  <i class="fa-light fa-book" />
                  {{
                    $t('space.courses.amount', {
                      amount: item.courses?.length || 0,
                    })
                  }}
                </div>
                <div class="line-clamp-2 max-w-48 text-13">{{ item.name }}</div>
              </div>
            </div>
          </el-popover>
        </div>
        <div v-for="n in 11 - items.length" :key="n" class="h-8 w-1/4" />
        <div
          v-if="rest > 0"
          class="flex h-8 w-1/4 items-center justify-center text-xs text-white"
        >
          +{{ rest }}
        </div>
      </div>
      <div class="mb-1 flex w-full items-center gap-2 p-2">
        <div class="relative shrink-0">
          <BaseSpaceLogo
            class="!size-10 !text-2xl"
            :space="space"
            :expand="hover"
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
                <i
                  class="fa-light fa-share-nodes -translate-x-[1px] scale-90"
                />
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
        <div class="flex-1">
          <div class="mb-1 flex items-center justify-between">
            <div class="max-w-48 truncate text-sm">{{ space.name }}</div>
            <el-popover
              ref="more"
              data-v-if="!isShopping"
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
                    open
                      ? 'bg-white/10'
                      : 'opacity-0 hover:bg-white/10 group-hover/space:opacity-100'
                  "
                  data-cy="775d5485ff8ba712"
                  @click.stop="open = true"
                >
                  <i class="fa-regular fa-ellipsis" />
                </div>
              </template>
              <div class="flex flex-col gap-1 p-1 text-sm">
                <div
                  class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
                  data-cy="8830978f76249cc9"
                  @click="onEdit"
                >
                  <i class="fa-regular fa-gear" />
                  {{ $t('space.edit.info') }}
                </div>
                <div
                  data-v-if="!isShopping && !isOwner"
                  class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
                  data-cy="b68d6e82dfd17d0c"
                  @click="onLeave"
                >
                  <i class="fa-regular fa-arrow-right-from-bracket" />
                  {{ $t('space.leave.label') }}
                </div>
                <div
                  data-v-if="!isShopping"
                  class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
                  data-cy="4030e35c54b80232"
                  @click="onDelete"
                >
                  <i class="fa-regular fa-trash" />
                  {{ $t('base.editor.delete') }}
                </div>
              </div>
            </el-popover>
          </div>
          <div class="flex items-end justify-between">
            <div class="flex items-center gap-2 text-xs text-white/50">
              <div class="flex items-center gap-1">
                <i class="fa-light fa-folder" />
                {{
                  $t('space.count.folders', { amount: space.numberOf.folders })
                }}
              </div>
              <div class="size-1 rounded-full bg-white/50" />
              <div class="flex items-center gap-1">
                <i class="fa-light fa-book" />
                {{
                  $t('space.count.courses', { amount: space.numberOf.courses })
                }}
              </div>
            </div>
            <BaseMemberPreview
              v-if="members.length"
              :members="members"
              :max="2"
              add
            />
          </div>
        </div>
      </div>
      <div
        class="pointer-events-none absolute inset-0 rounded-b border-b-2 opacity-0 group-hover/space:opacity-100"
        :style="{ borderColor: space.color }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: {
      type: Object,
      required: true,
    },
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
      hover: false,
    };
  },
  computed: {
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    rootFolder() {
      return this.space.rootFolder;
    },
    courses() {
      return this.rootFolder.courses.filter(Boolean);
    },
    items() {
      const folders = this.rootFolder.subFolders;
      const courses = this.courses;
      for (let i = 0; i < folders.length; i++) {
        folders[i]._type = 'folder';
      }
      for (let i = 0; i < courses.length; i++) {
        courses[i]._type = 'course';
      }
      return this.rootFolder.subFolders.concat(this.courses).slice(0, 11);
    },
    rest() {
      return this.rootFolder.subFolders.length + this.courses.length - 11;
    },
    members() {
      return this.space.members.filter(Boolean).slice(0, 2);
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
    onClick() {
      this.$router.push({
        query: {
          ...this.$route.query,
          space: this.space.id,
        },
      });
    },
    async onCourseShow(item) {
      if (item.owner || item.loading) {
        return;
      }
      item.loading = true;
      const course = await this.hubCourse.getCourse({
        courseId: item.id,
      });
      item.loading = false;
      Object.assign(item, course);
    },
    async onFolderShow(item) {
      if (item.parent || item.loading) {
        return;
      }
      item.loading = true;
      const folder = await this.hubSpaces.getFolder({
        spaceId: this.space.id,
        folderId: item.id,
      });
      item.loading = false;
      Object.assign(item, folder);
    },
    onCourseClick(course) {
      this.$router.push({
        query: {
          ...this.$route.query,
          space: this.space.id,
          course: course.id,
        },
      });
    },
    onFolderClick(folder) {
      this.$router.push({
        query: {
          ...this.$route.query,
          space: this.space.id,
          folder: folder.id,
        },
      });
    },
  },
};
</script>
