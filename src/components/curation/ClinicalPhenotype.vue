<script>
export default {
  props: {
    fetchHpoTerms: Function,
    clinicalPhenotype: Object,
    hpoTermsInputHelper: Object,
  },
  emits: ["update:clinicalPhenotype", "update:hpoTermsInputHelper"],
  methods: {
    summaryInputHandler(pmid, inputValue) {
      let updateClinicalPhenotype = { ...this.clinicalPhenotype };
      updateClinicalPhenotype[pmid].summary = inputValue;
      this.$emit("update:clinicalPhenotype", updateClinicalPhenotype);
    },
    hpoTermsInputHandler(pmid, inputValue) {
      let updatedHpoTermsInputHelper = { ...this.hpoTermsInputHelper };
      updatedHpoTermsInputHelper[pmid].hpoTermsInput = inputValue;
      this.$emit("update:hpoTermsInputHelper", updatedHpoTermsInputHelper);
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
          Phenotypic Features
        </button>
      </h2>
      <div
        id="clinical-phenotype-section-body"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <div
            class="row g-3 px-3 py-3"
            v-if="
              clinicalPhenotype && Object.keys(clinicalPhenotype).length > 0
            "
            v-for="pmid in Object.keys(clinicalPhenotype)"
          >
            <div class="row">
              <div class="col-12">
                <strong>
                  <p class="mb-0">Publication (PMID: {{ pmid }})</p>
                </strong>
              </div>
            </div>
            <div class="row pt-3">
              <div class="col-2">
                <label
                  :for="`phenotype-summary-input-${pmid}`"
                  class="col-form-label"
                >
                  Summary
                </label>
              </div>
              <div class="col-4">
                <textarea
                  class="form-control"
                  :id="`phenotype-summary-input-${pmid}`"
                  rows="3"
                  :value="clinicalPhenotype[pmid].summary"
                  @input="summaryInputHandler(pmid, $event.target.value)"
                >
                </textarea>
              </div>
            </div>
            <div
              class="row py-3"
              v-if="hpoTermsInputHelper && hpoTermsInputHelper[pmid]"
            >
              <div class="col-2">
                <label
                  :for="`phenotype-hpo-terms-input-${pmid}`"
                  class="col-form-label"
                >
                  HPO Terms(s)
                </label>
              </div>
              <div class="col-4">
                <textarea
                  :class="
                    hpoTermsInputHelper[pmid].isHpoTermsValid
                      ? 'form-control'
                      : 'form-control is-invalid'
                  "
                  :id="`phenotype-hpo-terms-input-${pmid}`"
                  :value="hpoTermsInputHelper[pmid].hpoTermsInput"
                  @input="hpoTermsInputHandler(pmid, $event.target.value)"
                  rows="3"
                  :aria-describedby="`invalid-phenotype-hpo-terms-input-feedback-${pmid}`"
                >
                </textarea>
                <div
                  :id="`invalid-phenotype-hpo-terms-input-feedback-${pmid}`"
                  class="invalid-feedback"
                >
                  Please enter valid HPO Terms(s).
                </div>
                <div
                  class="form-text"
                  :id="`phenotype-hpo-terms-input-help-text-${pmid}`"
                >
                  For multiple entries, separate by semicolon
                </div>
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn btn-primary mb-3"
                  @click="fetchHpoTerms(pmid)"
                >
                  <i class="bi bi-search"></i> Look Up
                </button>
              </div>
            </div>
            <div
              class="d-flex justify-content-center"
              v-if="
                hpoTermsInputHelper &&
                hpoTermsInputHelper[pmid]?.isHpoTermsDataLoading
              "
              style="margin-top: 20px; margin-bottom: 20px"
            >
              <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div
              class="alert alert-danger mt-3"
              role="alert"
              v-if="
                hpoTermsInputHelper &&
                hpoTermsInputHelper[pmid]?.hpoTermsErrorMsg
              "
            >
              <div>
                <i class="bi bi-exclamation-circle-fill"></i>
                {{ hpoTermsInputHelper[pmid].hpoTermsErrorMsg }}
              </div>
            </div>
            <div
              class="row py-3"
              v-if="
                clinicalPhenotype[pmid].hpo_terms &&
                clinicalPhenotype[pmid].hpo_terms.length > 0
              "
            >
              <div class="col-12">
                <strong><p class="mb-3">HPO Terms</p></strong>
              </div>
              <div class="col-6">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th width="30%">Accession</th>
                      <th width="70%">Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in clinicalPhenotype[pmid].hpo_terms">
                      <td>{{ item.accession }}</td>
                      <td>{{ item.term }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
