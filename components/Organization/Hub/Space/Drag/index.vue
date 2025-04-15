<template>
  <Teleport to="body">
    <OrganizationHubSpaceDragSelector />
    <OrganizationHubSpaceDragDraging />
  </Teleport>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    // 选中的元素
    checkeds() {
      return this.hubSpaces.checkedsClear;
    },
    // 选中的文件夹
    folders() {
      return this.checkeds.filter((item) => item._type === 'folder');
    },
    // 选中的课程
    courses() {
      return this.checkeds.filter((item) => item._type === 'course');
    },
    // 选中的空间
    spaces() {
      return this.checkeds.filter((item) => item._type === 'space');
    },
  },
  watch: {
    'hubSpaces.isDraging'(value) {
      if (value) {
        document.body.classList.add('select-none');
        document.body.classList.add('cursor-grabbing');
      } else {
        document.body.classList.remove('select-none');
        document.body.classList.remove('cursor-grabbing');
      }
    },
  },
  mounted() {
    document.addEventListener('pointermove', this.onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);
  },
  beforeUnmount() {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  },
  methods: {
    onMouseMove(event) {
      if (!this.hubSpaces.isDraging) {
        return;
      }

      // 计算鼠标位置
      const x = event.clientX;
      const y = event.clientY;
      const target = document.elementFromPoint(x, y);

      // 计算浮标位置
      this.hubSpaces.dragLeft = `${event.x}px`;
      this.hubSpaces.dragTop = `${event.y}px`;

      const $folder = target.closest("[data-type='folder']");
      const $space = target.closest("[data-type='space']");
      const $course = target.closest("[data-type='course']");

      const illegals = [
        this.spaces.length && ($folder || $course), // 不能拖动空间到文件夹和课程
        this.folders.length && $folder, // 不能拖动文件夹到文件夹
        this.folders.length && this.courses.length && ($folder || $space), // 不能同时拖动文件夹和课程到文件夹和空间
      ];

      if (illegals.some(Boolean)) {
        document.body.classList.add('not-allowed');
      } else {
        document.body.classList.remove('not-allowed');
      }

      // 文件夹是否进入释放状态
      const $collapse = target.closest('[data-collapse]');
      const $layout = target.closest('[data-layout]');
      this.hubSpaces.isCollapse = !!$collapse && this.folders.length;
      this.hubSpaces.collapseId = $collapse?.dataset?.collapse;
      this.hubSpaces.dropLayout = $layout?.dataset?.layout;
    },
    async onMouseUp(event) {
      if (this.hubSpaces.isDraging) {
        this.hubSpaces.isDraging = false;
        document.body.classList.remove('not-allowed');

        // 计算鼠标位置
        const x = event.clientX;
        const y = event.clientY;
        const target = document.elementFromPoint(x, y);

        if (this.hubSpaces.isCollapse) {
          // 假如拖到了course区域，进入释放状态
          this.hubSpaces.isDroping = true;
          this.hubSpaces.isCollapse = false;
          this.hubSpaces.deleteFolder = this.folders;
        } else {
          // 假如拖到了被选中的元素上，不做任何操作
          const $draging = target.closest(`[data-draging="true"]`);
          if ($draging) {
            return this.checkIsTmpCheck();
          }

          // 假如拖到非文件夹/非空间上，不做任何操作
          const $folder = target.closest("[data-type='folder']");
          const $space = target.closest("[data-type='space']");
          if (!$folder && !$space) {
            return this.checkIsTmpCheck();
          }

          // 查找目标文件夹id
          const targetFolderId =
            $folder?.dataset?.id || $space?.dataset?.folderId;
          if (!targetFolderId) {
            return this.checkIsTmpCheck();
          }

          const targetFolder = this.hubSpaces.find(targetFolderId);
          const targetSpaceId = targetFolder._spaceId;

          // 进入接口调用状态
          if (this.courses.length) {
            await this.moveCourse({
              courses: this.courses, // 选中的课程
              targetFolderId, // 目标文件夹id
              targetSpaceId, // 目标文件夹id
            });
          }
        }

        this.checkIsTmpCheck();
      }
    },
    async moveCourse({ courses, targetFolderId, targetSpaceId }) {
      // 禁止跨空间移动
      const { _folderId, _spaceId } = courses[0];

      const courseIds = courses
        .filter((course) => course._folderId !== targetFolderId)
        .map((course) => course.id);

      // 排除自身文件夹
      if (courseIds.length === 0) {
        return;
      }

      await this.hubSpaces.moveCourse({
        spaceId: _spaceId,
        folderId: _folderId,
        targetFolderId,
        courseIds,
      });

      // 更新原来文件夹课程列表
      await this.hubSpaces.getCourses({
        spaceId: _spaceId,
        folderId: _folderId,
      });

      // 更新原来顶层文件夹列表
      await this.hubSpaces.getFolders({
        spaceId: _spaceId,
      });

      // 更新目标文件夹课程列表
      await this.hubSpaces.getCourses({
        spaceId: targetSpaceId,
        folderId: targetFolderId,
      });
    },
    checkIsTmpCheck() {
      if (this.hubSpaces.isTmpCheck) {
        this.hubSpaces.uncheck();
        this.hubSpaces.isTmpCheck = false;
      }
    },
  },
};
</script>
