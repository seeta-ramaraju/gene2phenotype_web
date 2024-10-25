<script>
export default {
  data() {
    return {
      isLoadingValue: {},
      HPOsearchResponseJson: {},
      HPOAPIerrormsg: {},
      showDropDown: {},
      searchTerm: {},
    };
  },

  props: {
    clinicalPhenotype: Object,
    hpoTermsInputHelper: Object,
  },
  emits: ["update:clinicalPhenotype", "update:hpoTermsInputHelper"],
  methods: {
    initializeStateForPmid(pmid) {
      if (!this.searchTerm[pmid]) this.searchTerm[pmid] = "";
      if (!this.isLoadingValue[pmid]) this.isLoadingValue[pmid] = false;
      if (!this.HPOsearchResponseJson[pmid])
        this.HPOsearchResponseJson[pmid] = [];
      if (!this.HPOAPIerrormsg[pmid]) this.HPOAPIerrormsg[pmid] = null;
      if (!this.showDropDown[pmid]) this.showDropDown[pmid] = false;
    },

    async fetchAndSearchHPO(pmid) {
      this.initializeStateForPmid(pmid);
      this.isLoadingValue[pmid] = true;
      this.HPOsearchResponseJson[pmid] = [];
      this.HPOAPIerrormsg[pmid] = null;

      if (!this.searchTerm[pmid] || this.searchTerm[pmid].length < 3) {
        this.isLoadingValue[pmid] = false;
        return;
      }

      try {
        const hpoApiResponse = await fetch(
          `https://ontology.jax.org/api/hp/search?q=${this.searchTerm[pmid]}&page=0&limit=10`
        );
        if (!hpoApiResponse.ok) throw new Error("Failed to fetch HPO API");

        const ontology_data = await hpoApiResponse.json();
        this.HPOsearchResponseJson[pmid] = ontology_data.terms;
      } catch (error) {
        this.HPOsearchResponseJson[pmid] = [];
        this.HPOAPIerrormsg[pmid] = "HPO API not working, try again later";
      } finally {
        this.isLoadingValue[pmid] = false;
      }
    },

    onInput(pmid) {
      this.initializeStateForPmid(pmid);
      this.showDropDown[pmid] = true;
      this.fetchAndSearchHPO(pmid);
    },

    selectTerm(pmid, term) {
      if (!term || !pmid) return;
      this.initializeStateForPmid(pmid);

      this.hpoTermsInputHandler(pmid, term.id);
      this.searchTerm[pmid] = "";
      this.HPOsearchResponseJson = []; // to make the dropdown have nothing to dropdown since a term has been selected

      // Ensure clinicalPhenotype is not mutated directly
      let updatedClinicalPhenotype = { ...this.clinicalPhenotype };
      updatedClinicalPhenotype[pmid].hpo_terms.push({
        accession: term.id,
        term: term.name,
      });

      this.$emit("update:clinicalPhenotype", updatedClinicalPhenotype);
      this.showDropDown[pmid] = false;
    },

    hpoTermsInputHandler(pmid, inputValue) {
      let updatedHpoTermsInputHelper = { ...this.hpoTermsInputHelper };
      if (!updatedHpoTermsInputHelper[pmid]) {
        updatedHpoTermsInputHelper[pmid] = { hpoTermsInput: inputValue };
      } else if (!updatedHpoTermsInputHelper[pmid].hpoTermsInput) {
        updatedHpoTermsInputHelper[pmid].hpoTermsInput = inputValue;
      } else {
        updatedHpoTermsInputHelper[pmid].hpoTermsInput += `;${inputValue}`;
      }

      this.$emit("update:hpoTermsInputHelper", updatedHpoTermsInputHelper);
    },

    summaryInputHandler(pmid, inputValue) {
      let updatedClinicalPhenotype = { ...this.clinicalPhenotype };
      if (!updatedClinicalPhenotype[pmid]) updatedClinicalPhenotype[pmid] = {};
      updatedClinicalPhenotype[pmid].summary = inputValue;
      this.$emit("update:clinicalPhenotype", updatedClinicalPhenotype);
    },

    handleBlur(pmid) {
      setTimeout(() => {
        this.showDropDown[pmid] = false;
      }, 100);
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
            :key="pmid"
          >
            <div class="row">
              <div class="col-12">
                <strong>
                  <p class="mb-0">Publication (PMID: {{ pmid }})</p>
                </strong>
              </div>
            </div>
            <div class="row pt-3">
              <label :for="`search_phenotype_${pmid}`"
                >Search Phenotypes using the Human Phenotype Ontology
                database</label
              >
              <div class="d-flex align-items-center position-relative">
                <input
                  type="text"
                  :id="`search_phenotype_${pmid}`"
                  placeholder="e.g Marfan syndrome"
                  v-model="searchTerm[pmid]"
                  @input="onInput(pmid)"
                  @focus="showDropDown[pmid] = true"
                  @blur="handleBlur(pmid)"
                  class="form-control dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="showDropDown[pmid]"
                />
                <ul
                  v-show="
                    HPOsearchResponseJson[pmid] &&
                    HPOsearchResponseJson[pmid].length > 0 &&
                    showDropDown[pmid]
                  "
                  class="dropdown-menu"
                  :aria-labelledby="`search_phenotype_${pmid}`"
                >
                  <li
                    v-for="term in HPOsearchResponseJson[pmid]"
                    :key="term.id"
                    @mousedown="selectTerm(pmid, term)"
                    class="dropdown-item"
                  >
                    {{ term.name }}
                  </li>
                </ul>
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
                  v-model="clinicalPhenotype[pmid].summary"
                  @input="summaryInputHandler(pmid, $event.target.value)"
                ></textarea>
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
                  HPO Term(s)
                </label>
              </div>
              <div class="col-4">
                <textarea
                  :class="{
                    'form-control': true,
                    'is-invalid': !hpoTermsInputHelper[pmid].isHpoTermsValid,
                  }"
                  :id="`phenotype-hpo-terms-input-${pmid}`"
                  v-model="hpoTermsInputHelper[pmid].hpoTermsInput"
                  @input="hpoTermsInputHandler(pmid, $event.target.value)"
                  rows="3"
                  :aria-describedby="`invalid-phenotype-hpo-terms-input-feedback-${pmid}`"
                ></textarea>
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
  </div>
</template>
