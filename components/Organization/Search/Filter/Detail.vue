<template>
  <div class="mb-4 bg-white/5 px-4 py-2">
    <div class="mb-4 font-medium">
      {{ $t('org.detail') }}
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="totalEmployees"
        trigger="click"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="totalEmployees"
            readonly
            :title="$t('org.employee.count')"
          />
        </template>
        <div class="flex flex-col p-1">
          <div
            v-for="item in employees"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="3a0e55e9c0ef57c0"
            @click="onEmployeeClick(item)"
          >
            {{ $t(item.name, { count: item.key }) }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="industryId"
        :visible="industryFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="industryId"
            :title="$t('org.industry.label')"
            @click="industryFocus = true"
            @blur="industryFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in industries"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="e5b64c9e0fbf3eae"
            @click="onIndustryClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="numberOfMembers"
        trigger="click"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="numberOfMembers"
            readonly
            :title="$t('org.members.count')"
          />
        </template>
        <div class="flex flex-col p-1">
          <div
            v-for="item in members"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="e49d87257005c783"
            @click="onMemberClick(item)"
          >
            {{ $t(item.name, { count: item.key }) }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="text-sm">
      <el-popover
        ref="numberOfPosts"
        trigger="click"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="numberOfPosts"
            readonly
            :title="$t('org.posts.number')"
          />
        </template>
        <div class="flex flex-col p-1">
          <div
            v-for="item in posts"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="55a6dcecfdcaa56c"
            @click="onPostClick(item)"
          >
            {{ $t(item.name, { count: item.key }) }}
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      industryFocus: false,
      totalEmployees: '',
      industryId: '',
      numberOfMembers: '',
      numberOfPosts: '',
    };
  },
  computed: {
    industries() {
      const result = [...this.searchStore.industries].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (
        this.industryId &&
        result.every((item) => item.name !== this.industryId)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.industryId.toLowerCase()),
        );
      }

      return result;
    },
    employees() {
      return [
        {
          id: '1-10',
          key: '1-10',
          name: 'org.employee.members',
        },
        {
          id: '11-50',
          key: '11-50',
          name: 'org.employee.members',
        },
        {
          id: '51-200',
          key: '51-200',
          name: 'org.employee.members',
        },
        {
          id: '201-500',
          key: '201-500',
          name: 'org.employee.members',
        },
        {
          id: '500',
          key: '500+',
          name: 'org.employee.members',
        },
      ];
    },
    members() {
      return [
        {
          id: '1-10',
          key: '1-10',
          name: 'org.employee.members',
        },
        {
          id: '11-50',
          key: '11-50',
          name: 'org.employee.members',
        },
        {
          id: '51-200',
          key: '51-200',
          name: 'org.employee.members',
        },
        {
          id: '201-500',
          key: '201-500',
          name: 'org.employee.members',
        },
        {
          id: '500',
          key: '500+',
          name: 'org.employee.members',
        },
      ];
    },
    posts() {
      return [
        {
          id: '1-5',
          key: '1-5',
          name: 'org.posts.count',
        },
        {
          id: '5-20',
          key: '5-20',
          name: 'org.posts.count',
        },
        {
          id: '21-50',
          key: '20-50',
          name: 'org.posts.count',
        },
        {
          id: '51-100',
          key: '50-100',
          name: 'org.posts.count',
        },
        {
          id: '100',
          key: '100+',
          name: 'org.posts.count',
        },
      ];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.searchStore.industries.length) {
        await this.searchStore.getIndustries();
      }

      if (this.query.totalEmployees) {
        const employee = this.employees.find(
          (item) => item.id === this.query.totalEmployees,
        );
        this.totalEmployees = this.$t(employee.name, { count: employee.key });
      }

      if (this.query.industryId) {
        const industry = this.industries.find(
          (item) => item.id === this.query.industryId,
        );
        this.industryId = this.$t(industry.name, { count: industry.key });
      }

      if (this.query.numberOfMembers) {
        const member = this.members.find(
          (item) => item.id === this.query.numberOfMembers,
        );
        this.numberOfMembers = this.$t(member.name, { count: member.key });
      }

      if (this.query.numberOfPosts) {
        const post = this.posts.find(
          (item) => item.id === this.query.numberOfPosts,
        );
        this.numberOfPosts = this.$t(post.name, { count: post.key });
      }
    },
    onEmployeeClick(item) {
      this.totalEmployees = this.$t(item.name, { count: item.key });
      this.query.totalEmployees = item.id;
      this.$refs.totalEmployees.hide();
    },
    onIndustryClick(item) {
      this.industryId = item.name;
      this.query.industryId = item.id;
    },
    onMemberClick(item) {
      this.numberOfMembers = this.$t(item.name, { count: item.key });
      this.query.numberOfMembers = item.id;
      this.$refs.numberOfMembers.hide();
    },
    onPostClick(item) {
      this.numberOfPosts = this.$t(item.name, { count: item.key });
      this.query.numberOfPosts = item.id;
      this.$refs.numberOfPosts.hide();
    },
  },
};
</script>
