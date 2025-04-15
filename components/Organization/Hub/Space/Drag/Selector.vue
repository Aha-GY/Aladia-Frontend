<template>
  <div
    v-if="hubSpaces.isSelecting && !isPopup"
    class="pointer-events-none fixed inset-0 z-[60] select-none overflow-hidden"
  >
    <div
      ref="selected"
      class="absolute border border-blue-400 bg-blue-500/50"
      :style="{
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px',
      }"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    return { hubSpaces, hubCourse };
  },
  data() {
    return {
      dragMin: { x: 0, y: 0 },
      dragStart: { x: 0, y: 0 },
      dragIng: { x: 0, y: 0 },
      scrollStart: { y: 0 },
      scrollIng: { y: 0 },
    };
  },
  computed: {
    x() {
      const x = Math.min(this.dragIng.x, this.dragStart.x);
      return Math.max(x, this.dragMin.x);
    },
    y() {
      if (this.dragIng.y > this.dragStart.y) {
        if (this.dragStart.y > this.scrollIng.y + this.dragIng.y) {
          return Math.max(this.dragIng.y, this.dragMin.y);
        } else {
          const y = this.dragStart.y - this.scrollIng.y;
          return Math.max(y, this.dragMin.y);
        }
      } else {
        if (this.scrollIng.y + this.dragIng.y > this.dragStart.y) {
          return Math.max(this.dragStart.y - this.scrollIng.y, this.dragMin.y);
        } else {
          const y = this.dragIng.y;
          return Math.max(y, this.dragMin.y);
        }
      }
    },
    width() {
      return Math.abs(
        this.dragIng.x - Math.max(this.dragMin.x, this.dragStart.x),
      );
    },
    height() {
      if (this.dragIng.y > this.dragStart.y) {
        if (this.dragStart.y > this.scrollIng.y + this.dragIng.y) {
          return this.dragStart.y - this.scrollIng.y - this.y;
        } else {
          return Math.abs(this.dragIng.y - this.y);
        }
      } else {
        if (this.scrollIng.y + this.dragIng.y > this.dragStart.y) {
          return this.dragIng.y - this.y;
        } else {
          return Math.abs(this.dragStart.y - this.dragIng.y - this.scrollIng.y);
        }
      }
    },
    isPopup() {
      return this.hubCourse.isEdit;
    },
  },
  watch: {
    'hubSpaces.isSelecting'(value) {
      this.clearTextSelection();
      if (value) {
        document.body.classList.add('select-none');
      } else {
        document.body.classList.remove('select-none');
      }
    },
    '$route.query': {
      deep: true,
      handler() {
        this.reset();
        this.hubSpaces.uncheck();
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
    document.addEventListener('pointerdown', this.onMouseDown);
    document.addEventListener('pointermove', this.onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);
  },
  beforeUnmount() {
    this.reset();
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('pointerdown', this.onMouseDown);
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  },
  methods: {
    reset() {
      this.hubSpaces.isSelecting = false;
      this.dragMin = { x: 0, y: 0 };
      this.dragStart = { x: 0, y: 0 };
      this.dragIng = { x: 0, y: 0 };
      this.scrollStart = { y: 0 };
      this.scrollIng = { y: 0 };
    },
    checkOverlap(el1, el2) {
      if (!el1 || !el2) {
        return;
      }
      const domRect1 = el1.getBoundingClientRect();
      const domRect2 = el2.getBoundingClientRect();
      return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
      );
    },
    clearTextSelection() {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        document.selection.empty();
      }
    },
    handle() {
      const $items = Array.from(
        document.querySelectorAll('#space-main [data-type]'),
      );

      const spaces = $items.filter(($item) => $item.dataset.type === 'space');
      const folders = $items.filter(($item) => $item.dataset.type === 'folder');
      const courses = $items.filter(($item) => $item.dataset.type === 'course');

      for (let index = 0; index < spaces.length; index++) {
        const $item = spaces[index];
        const id = $item.dataset.id;
        const space = this.hubSpaces.find(id);
        if (space) {
          const isOverlap = this.checkOverlap($item, this.$refs.selected);
          if (isOverlap) {
            space._state = 'checked';
          } else {
            space._state = 'unchecked';
          }
        }
      }

      for (let index = 0; index < folders.length; index++) {
        const $item = folders[index];
        const id = $item.dataset.id;
        const folder = this.hubSpaces.find(id);
        const isOverlap = this.checkOverlap($item, this.$refs.selected);
        if (isOverlap) {
          folder._state = 'checked';
        } else {
          folder._state = 'unchecked';
        }
      }

      for (let index = 0; index < courses.length; index++) {
        const $item = courses[index];
        const id = $item.dataset.id;
        const course = this.hubSpaces.find(id);
        const isOverlap = this.checkOverlap($item, this.$refs.selected);
        if (isOverlap) {
          course._state = 'checked';
        } else {
          course._state = 'unchecked';
        }
      }
    },
    onMouseDown(event) {
      if (event.button !== 0) {
        return;
      }
      if (event.target.closest('a')) {
        return;
      }
      if (event.target.closest('[data-type]')) {
        return;
      }
      if (this.hubSpaces.isDraging) {
        return;
      }
      if (this.$device.isMobile) {
        return;
      }
      if (!event.target.closest('[data-drag="true"]')) {
        return;
      }

      this.dragStart = { x: event.x, y: event.y };
      const $main = document.querySelector('#space-main');
      const { top } = $main.getBoundingClientRect();
      this.dragMin = { x: 70, y: top };
      this.scrollStart.y = window.scrollY;
    },
    onMouseMove(event) {
      if (!this.dragStart.x && !this.dragStart.y) {
        return;
      }
      if (event.x < 0 || event.y < 0) {
        return;
      }
      if (Math.abs(event.x - this.dragStart.x) <= 5) {
        return;
      }
      if (Math.abs(event.y - this.dragStart.y) <= 5) {
        return;
      }
      if (this.hubSpaces.isDraging) {
        return;
      }

      this.hubSpaces.isSelecting = true;

      if (!event.target.closest('[data-type]')) {
        this.hubSpaces.uncheck();
      }

      this.dragIng = {
        x: Math.max(event.x, this.dragMin.x),
        y: Math.max(event.y, this.dragMin.y),
      };

      this.handle();
    },
    async onMouseUp() {
      if (this.hubSpaces.isSelecting) {
        this.hubSpaces.isSelecting = false;
        this.handle();
      }
      this.reset();
    },
    async onScroll() {
      if (!this.hubSpaces.isSelecting) {
        return;
      }
      this.scrollIng.y = window.scrollY - this.scrollStart.y;
      this.handle();
    },
  },
};
</script>
