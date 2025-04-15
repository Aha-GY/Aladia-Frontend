<template>
  <BaseCheckboxStyle :state="item._state" @click="onClick" />
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    onClick() {
      const newState =
        this.item._state === 'unchecked' ? 'checked' : 'unchecked';
      this.updateItemState(this.item, newState);
    },

    updateItemState(item, state) {
      item._state = state;

      if (item._type === 'course') {
        item.chapters.forEach((chapter) => {
          this.updateItemState(chapter, state);
        });
      } else if (item._type === 'chapter') {
        item.lectures.forEach((lecture) => {
          lecture._state = state;
        });
      }

      if (item._parent) {
        this.updateParentState(item._parent);
      }
    },

    updateParentState(parent) {
      let children;
      if (parent._type === 'course') {
        children = parent.chapters;
      } else if (parent._type === 'chapter') {
        children = parent.lectures;
      }

      this.calculateParentState(parent, children);

      if (parent._parent) {
        this.updateParentState(parent._parent);
      }
    },

    calculateParentState(parent, children) {
      if (!children || children.length === 0) {
        return;
      }

      const totalCount = children.length;
      const checkedCount = children.filter(
        (child) => child._state === 'checked',
      ).length;
      const uncheckedCount = children.filter(
        (child) => child._state === 'unchecked',
      ).length;
      if (checkedCount === totalCount) {
        parent._state = 'checked';
      } else if (uncheckedCount === totalCount) {
        parent._state = 'unchecked';
      } else {
        parent._state = 'halfChecked';
      }
    },
  },
};
</script>
