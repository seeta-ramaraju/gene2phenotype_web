<script>
export default {
  props: {
    // Supports arrays of panel-name strings, e.g. ["DD"], or panel objects,
    // e.g. [{ name: "DD", description: "Developmental Disorders" }]
    panels: {
      type: Array,
      default: () => [],
    },
    emptyText: {
      type: String,
      default: "",
    },
  },
  methods: {
    panelName(panel) {
      return typeof panel === "string" ? panel : panel.name;
    },
    panelLabel(panel) {
      return typeof panel === "string"
        ? panel
        : panel.description || panel.name;
    },
  },
};
</script>
<template>
  <template v-if="panels?.length">
    <template v-for="(panel, index) in panels" :key="panelName(panel)">
      <router-link
        :to="{ name: 'panel', params: { panel: panelName(panel) } }"
        class="text-decoration-none"
      >
        {{ panelLabel(panel) }}
      </router-link>
      <span v-if="index < panels.length - 1">, </span>
    </template>
  </template>
  <span v-else-if="emptyText" class="text-muted">{{ emptyText }}</span>
</template>
