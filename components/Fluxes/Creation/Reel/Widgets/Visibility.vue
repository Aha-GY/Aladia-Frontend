<template>
  <i v-if="isPublic" class="fa-solid fa-earth-americas" />
  <i v-if="isPrivate" class="fa-solid fa-street-view" />
  <i v-if="isRestricted" class="fa-solid fa-users-viewfinder" />
</template>

<script>
export default {
  props: {
    visibility: String, // 'public', 'private', 'restricted'
  },
  computed: {
    isPublic() {
      return this.visibility === 'public';
    },
    isPrivate() {
      return this.visibility === 'private';
    },
    isRestricted() {
      return this.visibility === 'restricted';
    },
  },
};
</script>
