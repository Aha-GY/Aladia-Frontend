<template>
  <div class="mb-4 bg-white/5 px-4 py-2">
    <div class="mb-4 font-medium">
      {{ $t('personal.experiences') }}
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="jobRole"
        :visible="jobRolesFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.jobRole"
            :title="$t('personal.job.role')"
            @click="jobRolesFocus = true"
            @blur="jobRolesFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in jobRoles"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="404d36f76c4aa584"
            @click="onJobRolesClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="companyName"
        :visible="companyNameFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.companyName"
            :title="$t('personal.name.company')"
            @click="companyNameFocus = true"
            @blur="companyNameFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in brands"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="1bc683ad6f4299f5"
            @click="onBrandClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="degree"
        :visible="degreeFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.degree"
            title="Degree"
            @click="degreeFocus = true"
            @blur="degreeFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in degrees"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="f9bc97fd1639b797"
            @click="onDegreeClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="text-sm">
      <BaseInput v-model="query['certificate-name']" title="Certificate Name" />
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
      jobRolesFocus: false,
      companyNameFocus: false,
      degreeFocus: false,
    };
  },
  computed: {
    jobRoles() {
      const result = this.searchStore.jobRoles;

      if (
        this.query.jobRole &&
        result.every((item) => item.name !== this.query.jobRole)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.query.jobRole.toLowerCase()),
        );
      }

      return result;
    },
    degrees() {
      const result = this.searchStore.degrees;

      if (
        this.query.degree &&
        result.every((item) => item.name !== this.query.degree)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.query.degree.toLowerCase()),
        );
      }

      return result;
    },
    brands() {
      const result = this.searchStore.brands;

      if (
        this.query.companyName &&
        result.every((item) => item.name !== this.query.companyName)
      ) {
        return result.filter((item) =>
          item.name
            .toLowerCase()
            .includes(this.query.companyName.toLowerCase()),
        );
      }

      return result;
    },
  },
  mounted() {
    if (!this.jobRoles.length) {
      this.searchStore.searchJobRole();
    }
    if (!this.degrees.length) {
      this.searchStore.searchDegrees();
    }
    if (!this.brands.length) {
      this.searchStore.getBrands();
    }
  },
  methods: {
    onJobRolesClick(item) {
      this.query.jobRole = item.name;
    },
    onDegreeClick(item) {
      this.query.degree = item.name;
    },
    onBrandClick(item) {
      this.query.companyName = item.name;
    },
  },
};
</script>
