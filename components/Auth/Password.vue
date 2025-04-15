<template>
  <div class="flex w-full items-center justify-between text-xs">
    <div
      v-if="hasChange || error"
      :class="{
        'text-[#E54E4E]': level === 1,
        'text-[#dc7c56]': level === 2,
        'text-[#e1c361]': level === 3,
        'text-[#e3e469]': level === 4,
        'text-[#49a02f]': level === 5,
      }"
    >
      <span v-if="checkRequired">
        {{ $t('auth.error.required') }}
      </span>
      <span v-else-if="checkIsSame">
        {{ $t('auth.error.password.required.char7') }}
      </span>
      <span v-else-if="checkUpper">
        {{ $t('auth.error.password.required.uppercase') }}
      </span>
      <span v-else-if="invaildSymbol">
        {{ $t('auth.error.password.required.symbol') }} : {{ invaildSymbol }}
      </span>
      <span v-else-if="checkLength">
        {{ $t('auth.error.password.required.char8') }}
      </span>
      <span v-else-if="checkLowercase">
        {{ $t('auth.error.password.required.lowercase') }}
      </span>
      <span v-else-if="checkNumber">
        {{ $t('auth.error.password.required.number') }}
      </span>
      <span v-else-if="checkSymbol">
        {{ $t('auth.error.password.required.special') }}(@$!%*?&)
      </span>
      <span v-else-if="level === 5">
        {{ $t('auth.error.password.strong') }}
      </span>
    </div>
    <div v-else />
    <div class="h-1.5 w-36 rounded bg-[#4e4e4e]">
      <div
        class="h-full rounded transition-all duration-300"
        :class="{
          'w-0': level === 0,
          'w-1/5 bg-[#E54E4E]': level === 1,
          'w-2/5 bg-[#dc7c56]': level === 2,
          'w-3/5 bg-[#e1c361]': level === 3,
          'w-4/5 bg-[#e3e469]': level === 4,
          'w-full bg-[#49a02f]': level === 5,
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: String,
    password: String,
    currentPassword: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hasChange: false,
    };
  },
  computed: {
    level() {
      let level = 0;
      level = [
        !this.checkUpper,
        !this.checkLowercase,
        !this.checkNumber,
        !this.checkSymbol,
        !this.checkLength,
      ].filter(Boolean).length;
      if (
        (this.checkRequired && (this.hasChange || this.error)) ||
        this.checkIsSame ||
        this.invaildSymbol
      ) {
        level = 1;
      }
      return level;
    },
    checkIsSame() {
      return this.currentPassword
        ? this.currentPassword === this.password
        : false;
    },
    checkRequired() {
      return this.password.length === 0;
    },
    invaildSymbol() {
      const invalidChars = [
        ...new Set(this.password.match(/[^A-Za-z0-9@$!%*?&]/g) || []),
      ].join('');
      return invalidChars;
    },
    checkUpper() {
      return !/^[A-Z]/.test(this.password);
    },
    checkLowercase() {
      return !/(?=.*[a-z])/.test(this.password);
    },
    checkNumber() {
      return !/(?=.*\d)/.test(this.password);
    },
    checkSymbol() {
      return !/(?=.*[@$!%*?&])/.test(this.password);
    },
    checkLength() {
      return this.password.length < 8;
    },
    haveError() {
      return (
        this.checkIsSame ||
        this.checkRequired ||
        this.checkUpper ||
        this.checkLowercase ||
        this.checkNumber ||
        this.checkSymbol ||
        this.checkLength ||
        this.invaildSymbol
      );
    },
  },
  watch: {
    password: {
      immediate: true,
      handler(newVal, oldVal) {
        this.hasChange = false;
        if (newVal && !this.hasChange && newVal !== oldVal) {
          this.hasChange = true;
        }
      },
    },
  },
};
</script>
