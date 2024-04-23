<script>
export default {
  props: {
    panelData: {
      type: Object,
    },
    isPanelDataLoading: {
      type: Boolean,
    },
    panelErrorMsg: {
      type: String,
    },
  },
  emits: ["updatePanels"],
  watch: {
    panels(newPanels) {
      this.$emit("updatePanels", newPanels);
    },
  },
  data() {
    return {
      panels: [],
    };
  },
};
</script>
<template>
  <div class="accordion py-1" id="panel-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panel-section-body"
          aria-expanded="false"
          aria-controls="panel-section-body"
        >
          Panel
        </button>
      </h2>
      <div id="panel-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div
            class="d-flex justify-content-center"
            v-if="isPanelDataLoading"
            style="margin-top: 20px; margin-bottom: 20px"
          >
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div
            class="alert alert-danger mt-3"
            role="alert"
            v-if="panelErrorMsg"
          >
            <div>
              <i class="bi bi-exclamation-circle-fill"></i>
              {{ panelErrorMsg }}
            </div>
          </div>
          <form
            v-if="
              panelData && panelData.results && panelData.results.length > 0
            "
          >
            <fieldset class="row mb-3">
              <legend class="col-form-label col-sm-1 pt-0">Panel(s)</legend>
              <div class="col-sm-10">
                <div class="form-check" v-for="item in panelData.results">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="panel-input"
                    :value="item.description"
                    v-model="panels"
                  />
                  <label class="form-check-label" for="panel-input">
                    {{ item.description }}
                  </label>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
