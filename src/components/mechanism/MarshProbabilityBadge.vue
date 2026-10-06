<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    threshold: {
      type: Number,
      required: true,
    },
  },
  computed: {
    hasValue() {
      return this.value != null && this.value !== "";
    },
    badgeClass() {
      return Number(this.value) > this.threshold
        ? "red-text-box"
        : "green-text-box";
    },
  },
};
</script>
<template>
  <span v-if="hasValue" class="badge" :class="badgeClass">
    {{ value }}
  </span>
  <span v-else class="text-muted">Not Available</span>
</template>
<style scoped>
.red-text-box {
  color: white;
  background-color: rgb(255, 21, 0);
}
.green-text-box {
  color: black;
  background-color: rgb(0, 243, 148);
}
</style>
