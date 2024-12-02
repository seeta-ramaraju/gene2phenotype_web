<script>
export default {
  props: {
    pmidList: Array,
  },
  data() {
    return {
      selectedPmidList: [],
    };
  },
  emits: ["removePublication"],
  methods: {
    removePublication() {
      this.$emit("removePublication", this.selectedPmidList);
      this.selectedPmidList = [];
    },
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="remove-publication-modal"
    tabindex="-1"
    aria-labelledby="remove-publication-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="remove-publication-modal-label">
            Remove Publication(s)
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row py-3">
            <fieldset class="row">
              <legend class="col-form-label col-auto">Publication(s)</legend>
              <div class="col-6">
                <div class="form-check" v-for="pmid in pmidList">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`remove-publication-input-${pmid}`"
                    v-model="selectedPmidList"
                    :value="pmid"
                  />
                  <label
                    class="form-check-label"
                    :for="`remove-publication-input-${pmid}`"
                  >
                    {{ pmid }}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <p class="fs-6">
            <i class="bi bi-info-circle"></i> Removing Publications(s) will
            remove its related data from these input sections: Publications,
            Phenotypic Features, Variant Types, Variant Descriptions, and
            Mechanism Evidence.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="removePublication"
            data-bs-dismiss="modal"
            :disabled="selectedPmidList.length === 0"
          >
            <i class="bi bi-trash-fill"></i> Remove Publication(s)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
