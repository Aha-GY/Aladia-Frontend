<template>
  <div>
    <p class="flex gap-1 text-[#D9D9D9]">
      {{ $t(content.title) }}
      <span
        class="group flex cursor-pointer items-center"
        data-cy="be361aff15a1a1f0"
        @click="handleGoToCourse"
      >
        <span
          class="inline-block h-4 w-7 overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"
        >
          <BaseCourseThumbnail class="h-full" :url="entity?.thumbnail?.url" />
        </span>
        <span
          class="ml-2 mt-0.5 cursor-pointer truncate text-xs text-[#D9D9D9] group-hover:underline group-hover:underline-offset-2"
          :class="$device.isMobile ? 'max-w-[4rem]' : 'max-w-[5rem]'"
        >
          {{ profession || '---' }}
        </span>
      </span>
    </p>
    <p class="mt-1.5 text-[#B0B0B0]">
      {{
        $t(content.description, {
          instructorName: instructorName,
        })
      }}
    </p>
    <div class="mt-4">
      <img :src="content.image" class="block w-full" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
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
        title: 'post.auto.CourseCertificate.title',
        description: 'post.auto.CourseCertificate.description',
        image: this.item?.files[0]?.url,
      };
    },
    instructorName() {
      return this.item?.entity?.teacherName;
    },
    entity() {
      return this.item.entity;
    },
  },
  methods: {
    handleGoToCourse() {
      // TODO after getting the real data

      this.$router.push(`/marketplace`);
    },
  },
};
</script>
