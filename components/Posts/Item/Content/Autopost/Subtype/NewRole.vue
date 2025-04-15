<template>
  <div>
    <p class="text-[#D9D9D9]">
      {{
        $t(content.title, {
          organizationName: organizationName,
          profession: profession,
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
import NewRoleImage from '@/assets/social/autopost/new-role.png';

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
        title: 'post.auto.role.title',
        description: 'post.auto.role.description',
        image: NewRoleImage,
      };
    },
  },
};
</script>
