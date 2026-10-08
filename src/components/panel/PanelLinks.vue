<script>
export default {
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
    emptyText: {
      type: String,
      default: "",
    },
  },
};
</script>
<template>
  <template v-if="panels?.length">
    <template v-for="(panelName, index) in panels" :key="panelName">
      <router-link :to="`/panel/${panelName}`" class="text-decoration-none">
        {{ panelName }}
      </router-link>
      <span v-if="index < panels.length - 1">, </span>
    </template>
  </template>
  <span v-else-if="emptyText" class="text-muted">{{ emptyText }}</span>
</template>
