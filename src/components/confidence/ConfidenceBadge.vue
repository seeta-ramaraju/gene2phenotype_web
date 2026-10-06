<script>
import { CONFIDENCE_COLOR_MAP } from "../../utility/Constants.js";
export default {
  props: {
    confidence: {
      type: String,
      default: "",
    },
  },
  computed: {
    badgeStyle() {
      return {
        backgroundColor: CONFIDENCE_COLOR_MAP[this.confidence.toLowerCase()],
      };
    },
  },
};
</script>
<template>
  <span v-if="confidence" class="badge text-white" :style="badgeStyle">
    {{ confidence }}
  </span>
</template>
