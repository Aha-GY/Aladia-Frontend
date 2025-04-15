<template>
  <ProfileBox>
    <div class="mb-3 text-base font-medium text-[#B0B0B0]">
      {{ $t('post.favorite') }}
    </div>
    <div class="grid grid-cols-3 gap-x-4 gap-y-5">
      <div
        v-for="item in posts"
        :key="item.id"
        class="h-24 w-24 rounded-md bg-white/80"
      />
    </div>
  </ProfileBox>
</template>
<script>
export default {
  data() {
    return {
      posts: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
    };
  },
};
</script>
