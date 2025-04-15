<template>
  <div>
    <p class="text-[#D9D9D9]">
      {{
        $t(content.title, {
          placeholder: profession,
        })
      }}
    </p>
    <p class="mt-1.5 text-[#B0B0B0]">{{ $t(content.description) }}</p>
    <div class="mt-4">
      <img :src="content.image" class="block w-full" />
    </div>
  </div>
</template>

<script>
import NewCertificationImage from '@/assets/social/autopost/new-certification.png';

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
    profession() {
      return this.placeholder?.profession;
    },
    content() {
      return {
        title: 'post.auto.certificate.title',
        description: 'post.auto.certificate.description',
        image: NewCertificationImage,
      };
    },
  },
};
</script>
