<template>
  <div>
    <div
      class="mb-4 flex h-12 items-center justify-between rounded-t-sm bg-white/5 px-4"
    >
      <div class="flex items-center gap-3 text-sm">
        <i class="fa-light fa-edit" />
        {{ info.id ? $t('index.version.edit') : $t('index.version.new') }}
      </div>
      <BaseIconClose data-cy="0aac448d4848d7af" @click="onClose" />
    </div>
    <div class="mb-4 px-4 text-sm">
      <BaseInput
        v-model="info.title"
        class="mb-4"
        :title="$t('index.version.name')"
      />
      <textarea
        v-model="info.description"
        class="h-24 w-full resize-none rounded border-none bg-white/5 p-1 outline-none placeholder:text-white/50"
        maxlength="500"
        :placeholder="$t('index.description.add')"
      />
      <p>{{ info.description.length }} / 500</p>
    </div>
    <div
      class="flex items-center justify-between rounded-b-sm bg-white/5 px-4 py-2"
    >
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="1ab0ff69f3d9ff90"
        @click="onClose"
      >
        <i class="fa-light fa-trash-can text-xs" />
        {{ $t('base.editor.delete') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="da72c34d68b93091"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-save text-sm" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar, hubCourse };
  },
  data() {
    return {
      info: {
        title: `Version_${dayjs().format('MM_DD_HH:mm')}`,
        description: '',
      },
      saving: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
  },
  mounted() {
    this.info = { ...this.info, ...this.version.edit.data };
  },
  beforeUnmount() {
    this.version.edit = {
      state: false,
      data: {},
    };
  },
  methods: {
    onClose() {
      this.version.edit.state = false;
    },
    onDelete() {
      this.version.edit.state = false;
    },
    async onSave() {
      this.saving = true;
      if (this.info.id) {
        await this.hubCourse.updateVersion({
          versionId: this.info.id,
          courseId: this.course.id,
          title: this.info.title,
          description: this.info.description,
        });
      } else {
        await this.hubCourse.createVersion({
          courseId: this.course.id,
          title: this.info.title,
          description: this.info.description,
        });
      }
      await this.hubCourse.searchVersions({
        courseId: this.course.id,
      });
      this.saving = false;
      this.version.edit.state = false;
    },
  },
};
</script>
