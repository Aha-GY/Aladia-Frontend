<template>
  <div
    class="h-5 cursor-pointer truncate text-sm text-white"
    @click="onClick"
    v-html="content"
  />
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const searchStore = useSearchStore();
    return { authStore, searchStore };
  },
  computed: {
    entity() {
      return this.item.entity;
    },
    placeholder() {
      return this.item.placeholder;
    },
    organizationName() {
      return this.placeholder?.organizationName;
    },
    profession() {
      return this.placeholder?.profession;
    },
    autoPost() {
      return {
        'joined-platform': this.$t('post.auto.join.title'),
        'became-teacher': this.$t('post.auto.beTeacher.title'),
        'published-course': this.$t('post.share.course'),
        'enrolled-course': `${this.$t('post.auto.journey.title1')} ${this.entity?.title} ${this.$t('post.auto.journey.title2')}`,
        'started-new_role': this.$t('post.auto.role.title', {
          profession: this.profession,
          organizationName: this.organizationName,
        }),

        'one-year-anniversary': this.$t('post.auto.year.title', {
          organizationName: this.organizationName,
        }),

        graduation: this.$t('post.auto.graduation.title', {
          organizationName: this.profession,
        }),
        'earned-certification': this.$t('post.auto.certificate.title', {
          placeholder: this.profession,
        }),
      };
    },
    title() {
      return this.searchStore.query.title;
    },
    content() {
      if (this.item.type === 'auto-post') {
        const content = this.autoPost[this.item.subType] || '';
        return this.title ? highlightKeywords(content, [this.title]) : content;
      } else {
        const content = stripHtml(this.item.content || '');
        return this.title ? highlightKeywords(content, [this.title]) : content;
      }
    },
  },
  methods: {
    onClick() {
      this.searchStore.isFocus = false;
      this.$router.push(`${this.authStore.hub}/feed?postId=${this.item.id}`);
    },
  },
};
</script>
