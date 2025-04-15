<template>
  <div
    class="fixed left-0 z-[65] w-full overflow-y-auto bg-[#060606] md:pl-[4.375rem]"
  >
    <div ref="tabs" class="relative flex h-10 items-center text-xs">
      <div class="hidden h-full items-center pl-5 pr-3 md:flex">
        <div
          class="flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-all hover:opacity-100 active:scale-95"
          :class="open ? 'opacity-100' : ''"
          data-cy="0ce6b5ef7c5a0115"
          @click="open = !open"
        >
          <i class="fa-solid fa-filters" />
        </div>
      </div>
      <OrganizationHubHeaderMenu
        class="md:hidden"
        title="Marketplace"
        label="filter.header.marketplace"
        icon="fa-shop"
      />
      <OrganizationHubHeaderMenu
        title="Dashboard"
        label="filter.header.dashboard"
        icon="fa-chart-pie"
      />
      <OrganizationHubHeaderMenu
        v-show="isOrg"
        title="IAM"
        label="filter.header.iam"
        icon="fa-user"
      />
      <OrganizationHubHeaderMenu
        v-if="!isOrg || isOrgAdmin"
        title="Payment"
        label="filter.header.payment"
        icon="fa-credit-card"
      />
      <OrganizationHubHeaderMenu
        title="Calendar"
        label="filter.header.calendar"
        icon="fa-calendar"
      />
      <OrganizationHubHeaderMenu
        title="Spaces"
        label="filter.header.spaces"
        icon="fa-box"
      />
      <OrganizationHubHeaderMenu
        title="Chat"
        label="filter.header.chat"
        icon="fa-comments"
      />
      <OrganizationHubHeaderMenu
        title="Feed"
        label="filter.feed"
        icon="fa-share-nodes"
      />
      <OrganizationHubHeaderMenu
        title="Profile"
        label="filter.header.profile"
        icon="fa-address-card"
      />
      <OrganizationHubHeaderMenu
        v-if="isAdmin"
        title="Management"
        label="filter.management"
        icon="fa-address-card"
      />
    </div>
    <OrganizationHubHeaderFilters
      :class="
        open
          ? 'max-h-10 py-1 opacity-100'
          : 'max-h-0 overflow-hidden py-0 opacity-0'
      "
    />
  </div>
</template>

<script setup>
const authStore = useAuthStore();

const open = ref(false);
const isOrg = computed(() => authStore.isOrg);
const isAdmin = computed(() => authStore.isAdmin);
const isOrgAdmin = computed(() => authStore.isOrgAdmin);
</script>
