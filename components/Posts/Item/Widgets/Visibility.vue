<template>
  <div v-if="isPublic" class="flex items-center gap-1">
    <i class="fa-solid fa-earth-americas" />
    <div v-if="showVisibility" class="text-xs">
      {{ $t('post.create.menu.public.label') }}
    </div>
  </div>

  <div v-if="isPrivate" class="flex items-center gap-1">
    <i class="fa-solid fa-street-view" />
    <div v-if="showVisibility" class="text-xs">
      {{ $t('post.create.menu.private.label') }}
    </div>
  </div>

  <div v-if="isRestricted" class="flex items-center gap-1">
    <i class="fa-solid fa-users-viewfinder" />
    <div v-if="showVisibility" class="text-xs">
      {{ $t('post.create.menu.restricted.label') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visibility: String, // 'public', 'private', 'restricted'
    showVisibility: {
      type: Boolean,
      default: false,
    },
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
