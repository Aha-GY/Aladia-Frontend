<template>
  <div class="w-full">
    <p class="text-[#D9D9D9]">{{ $t(content.title) }}</p>
    <p class="mt-1.5 text-[#B0B0B0]">{{ $t(content.description) }}</p>
    <div class="mt-4">
      <img :src="content.image" class="block w-full" />
    </div>
  </div>
</template>

<script>
import JoinImage from '@/assets/social/autopost/join.png';

export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { authStore, socialStore, searchStore };
  },
  computed: {
    content() {
      return {
        title: 'post.auto.join.title',
        description: 'post.auto.join.description',
        image: JoinImage,
      };
    },
  },
};
</script>
