<template>
  <div class="mb-4 px-6 py-3">
    <div class="mb-1 flex items-center justify-between pl-2">
      <div>
        {{ $t('post.label') }}
      </div>
      <div class="cursor-pointer rounded px-2 py-1 hover:bg-white/10">
        {{ $t('post.viewAll') }}
      </div>
    </div>
    <div v-if="loading" class="flex flex-wrap">
      <div v-for="n in 4" :key="n" class="w-full shrink-0 px-2 xl:w-1/2">
        <HeaderSearchSkeletonPost />
      </div>
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="post in posts"
        :key="post.id"
        class="mb-4 w-full shrink-0 px-2 xl:w-1/2"
      >
        <HeaderSearchTypePost :item="post" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
