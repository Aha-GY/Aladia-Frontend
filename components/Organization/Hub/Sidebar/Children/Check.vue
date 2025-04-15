<template>
  <div
    class="absolute -bottom-1.5 -right-1.5 scale-90 rounded-full bg-black p-[1px]"
  >
    <BaseCheckboxStyle :state="item._state" @click.stop="onClick" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    folder: Object,
    space: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  methods: {
    onClick() {
      if (
        this.item._state === 'unchecked' ||
        this.item._state === 'halfChecked'
      ) {
        this.item._state = 'checked';
      } else {
        this.item._state = 'unchecked';
      }
      this.onChange(this.item, this.hubSpaces.spaces);
    },
    onChange(node, root) {
      const state = node._state;

      function updateChildren(node, state) {
        if (node.courses) {
          node.courses.forEach((course) => (course._state = state));
        }
        if (node.folders) {
          node.folders.forEach((folder) => {
            folder._state = state;
            updateChildren(folder, state);
          });
        }
      }

      function updateParent(node, spaces) {
        if (!node._spaceId && !node._folderId) {
          return;
        }

        let parentNode;
        if (node._folderId) {
          parentNode = findNode(
            spaces,
            node._spaceId,
            'folders',
            node._folderId,
          );
        } else if (node._spaceId) {
          parentNode = findNode(spaces, node._spaceId);
        }

        if (parentNode) {
          let states = [];
          if (parentNode.courses) {
            states = parentNode.courses.map((course) => course._state);
          }
          if (parentNode.folders) {
            states = states.concat(
              parentNode.folders.map((folder) => folder._state),
            );
          }

          if (states.every((s) => s === 'checked')) {
            parentNode._state = 'checked';
          } else if (states.every((s) => s === 'unchecked')) {
            parentNode._state = 'unchecked';
          } else {
            parentNode._state = 'halfChecked';
          }

          updateParent(parentNode, spaces);
        }
      }

      function findNode(spaces, spaceId, type = 'spaces', folderId) {
        const space = spaces.find((space) => space.id === spaceId);
        if (type === 'spaces') {
          return space;
        } else {
          return space.folders.find((folder) => folder.id === folderId);
        }
      }

      updateChildren(node, state);
      updateParent(node, root);
    },
  },
};
</script>
