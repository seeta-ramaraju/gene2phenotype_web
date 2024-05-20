<script>
export default {
  data() {
    return { phenotype: {} };
  },
  props: {
    publicationsData: {
      type: Object,
    },
  },
  emits: ["updateClinicalPhenotype"],
  watch: {
    publicationsData(newPublicationsData) {
      if (newPublicationsData && newPublicationsData.results) {
        let updatedPhenotype = {};
        newPublicationsData.results.forEach((item) => {
          updatedPhenotype[item.pmid] = {
            summary: "",
          };
        });
        this.phenotype = updatedPhenotype;
      }
    },
    phenotype: {
      handler(newPhenotype) {
        let phenotypeArray = [];
        for (const [key, value] of Object.entries(newPhenotype)) {
          let phenotypeObj = { ...value };
          phenotypeObj.pmid = key;
          phenotypeArray.push(phenotypeObj);
        }
        this.$emit("updateClinicalPhenotype", phenotypeArray);
      },
      deep: true,
    },
  },
};
</script>
<template>
  <div class="accordion py-1" id="clinical-phenotype-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#clinical-phenotype-section-body"
          aria-expanded="false"
          aria-controls="clinical-phenotype-section-body"
        >
          Clinical Phenotype
        </button>
      </h2>
      <div
        id="clinical-phenotype-section-body"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <div
            class="row g-3 px-3 py-3"
            v-for="item in publicationsData.results"
            v-if="
              publicationsData &&
              publicationsData.results &&
              publicationsData.results.length > 0
            "
          >
            <div class="col-12">
              <strong
                ><p class="mb-0">Publication (PMID: {{ item.pmid }})</p></strong
              >
            </div>
            <div class="col-1">
              <label for="clinical-phenotype-input" class="col-form-label">
                Summary
              </label>
            </div>
            <div class="col-4">
              <textarea
                class="form-control"
                id="clinical-phenotype-input"
                rows="3"
                v-model.trim="phenotype[item.pmid].summary"
              >
              </textarea>
            </div>
          </div>
          <div class="row g-3 px-3 py-3" v-else>
            <p>
              <i class="bi bi-info-circle"></i> Please enter Publication(s) to
              fill this section.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
