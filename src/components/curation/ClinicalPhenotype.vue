<script>
import { update } from "lodash";
import { ref } from "vue";

export default {
  setup(props, { emit }) {
    const searchTerm = ref({});
    const isLoadingValue = ref({});
    const HPOsearchResponseJson = ref({});
    const HPOAPIerrormsg = ref({});
    const showDropDown = ref({});

    const initializeStateForPmid = (pmid) => {
      if (!searchTerm.value[pmid]) {
        searchTerm.value[pmid] = ""; // Initialize search term for the pmid
      }
      if (!isLoadingValue.value[pmid]) {
        isLoadingValue.value[pmid] = false; // Initialize loading state
      }
      if (!HPOsearchResponseJson.value[pmid]) {
        HPOsearchResponseJson.value[pmid] = []; // Initialize search results
      }
      if (!HPOAPIerrormsg.value[pmid]) {
        HPOAPIerrormsg.value[pmid] = null; // Initialize error message
      }
      if (!showDropDown.value[pmid]) {
        showDropDown.value[pmid] = false; // Initialize dropdown visibility
      }
    };

    const fetchAndSearchHPO = async (pmid) => {
      initializeStateForPmid(pmid);

      isLoadingValue.value[pmid] = true;
      HPOAPIerrormsg.value[pmid] = null;
      HPOsearchResponseJson.value[pmid] = [];

      if (searchTerm.value[pmid].length < 3) {
        isLoadingValue.value[pmid] = false;
        return [];
      }
      try {
        const hpoApiResponse = await fetch(
          `https://ontology.jax.org/api/hp/search?q=${searchTerm.value[pmid]}&page=0&limit=10`
        );

        if (!hpoApiResponse.ok) {
          throw new Error("Failed to fetch HPO API");
        }

        const ontology_data = await hpoApiResponse.json();
        HPOsearchResponseJson.value[pmid] = ontology_data.terms || [];
      } catch (error) {
        HPOAPIerrormsg.value[pmid] =
          "HPO ontology API not working, try again later";
      } finally {
        isLoadingValue.value[pmid] = false;
      }
    };

    const onInput = (pmid) => {
      initializeStateForPmid(pmid);
      showDropDown.value[pmid] = true;
      fetchAndSearchHPO(pmid);
    };

    const selectTerm = (pmid, term) => {
      if (!term || !pmid) return;
      initializeStateForPmid(pmid);

      searchTerm.value[pmid] = "";
      summaryInputHandler(pmid, term.name);
      hpoTermsInputHandler(pmid, term.id);

      showDropDown.value[pmid] = false;
    };

    const summaryInputHandler = (pmid, inputValue) => {
      let updateClinicalPhenotype = { ...props.clinicalPhenotype };
      if (!updateClinicalPhenotype[pmid].summary) {
        updateClinicalPhenotype[pmid].summary = inputValue;
      } else {
        updateClinicalPhenotype[pmid].summary += `; ${inputValue}`;
      }
      emit("update:clinicalPhenotype", updateClinicalPhenotype);
    };

    const hpoTermsInputHandler = (pmid, inputValue) => {
      let updatedHpoTermsInputHelper = { ...props.hpoTermsInputHelper };
      if (!updatedHpoTermsInputHelper[pmid].hpoTermsInput) {
        updatedHpoTermsInputHelper[pmid].hpoTermsInput = inputValue;
      } else {
        updatedHpoTermsInputHelper[pmid].hpoTermsInput += `; ${inputValue}`;
      }
      emit("update:hpoTermsInputHelper", updatedHpoTermsInputHelper);
    };

    return {
      isLoadingValue,
      HPOsearchResponseJson,
      HPOAPIerrormsg,
      showDropDown,
      searchTerm,
      selectTerm,
      onInput,
    };
  },
  props: {
    clinicalPhenotype: Object,
    hpoTermsInputHelper: Object,
  },
  emits: ["update:clinicalPhenotype", "update:hpoTermsInputHelper"],
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
              <label for="search_phenotype" class="autocomplete">
                Search Phenotypes
              </label>
              <div class="d-flex align-items-center position-relative">
                <input
                  type="text"
                  :id="`search_phenotype_${pmid}`"
                  placeholder="Enter phenotype...."
                  v-model="searchTerm[pmid]"
                  @input="onInput(pmid)"
                />
                <ul
                  v-show="
                    HPOsearchResponseJson[pmid] &&
                    HPOsearchResponseJson[pmid].length > 0 &&
                    showDropDown[pmid]
                  "
                  class="autocomplete results"
                >
                  <li
                    v-for="term in HPOsearchResponseJson[pmid] || []"
                    :key="term.id"
                    @click="selectTerm(pmid, term)"
                    class="autocomplete-result"
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
                  :aria-describedby="`invalid-phenotype-hpoterms-input-feedback-${pmid}`"
                >
                </textarea>
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
<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>
