<template>
  <div>
    <p class="text-[#D9D9D9]">
      {{ $t(content.title, { organizationName: organizationName }) }}
    </p>
    <p class="mt-1.5 text-[#B0B0B0]">{{ $t(content.description) }}</p>
    <div class="mt-4">
      <img :src="content.image" class="block w-full" />
    </div>
  </div>
</template>

<script>
import OneYearAnniversaryImage from '@/assets/social/autopost/one-year-anniversary.png';

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
    placeholder() {
      return this.item.placeholder;
    },
    organizationName() {
      return this.placeholder?.organizationName;
    },
    profession() {
      return this.placeholder?.profession;
    },
    content() {
      return {
        title: 'post.auto.year.title',
        description: 'post.auto.year.description',
        image: OneYearAnniversaryImage,
      };
    },
  },
};
</script>
