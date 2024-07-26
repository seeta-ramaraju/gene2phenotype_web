<script>
export default {
  props: {
    inputGeneSymbol: String,
    geneDiseaseData: Object,
    isGeneDiseaseDataLoading: Boolean,
    geneDiseaseErrorMsg: String,
    diseaseName: String,
    diseaseCrossReferences: Array,
  },
  emits: ["update:diseaseName", "update:diseaseCrossReferences"],
  watch: {
    selectedDiseaseObj(newSelectedDiseaseObj) {
      this.$emit("update:diseaseName", newSelectedDiseaseObj.disease_name);
    },
  },
  data() {
    return {
      selectedDiseaseObj: {},
    };
  },
  methods: {
    checkboxHandler(diseaseCrossReference, checked) {
      let updatedDiseaseCrossReferences = [...this.diseaseCrossReferences];
      if (checked) {
        updatedDiseaseCrossReferences.push(diseaseCrossReference);
      } else {
        const elementIndexToBeRemoved = updatedDiseaseCrossReferences.findIndex(
          (item) => item.identifier === diseaseCrossReference.identifier
        );
        updatedDiseaseCrossReferences.splice(elementIndexToBeRemoved, 1);
      }
      this.$emit(
        "update:diseaseCrossReferences",
        updatedDiseaseCrossReferences
      );
    },
  },
};
</script>
<template>
  <div class="accordion py-1" id="disease-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#disease-section-body"
          aria-expanded="false"
          aria-controls="disease-section-body"
        >
          Disease Name
        </button>
      </h2>
      <div id="disease-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div
            class="d-flex justify-content-center"
            v-if="isGeneDiseaseDataLoading"
            style="margin-top: 20px; margin-bottom: 20px"
          >
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="row g-3">
            <div class="row g-3">
              <div class="col-auto">
                <label for="disease-name-input" class="col-form-label"
                  >Disease Name</label
                >
              </div>
              <div class="col input-group">
                <span class="input-group-text"
                  >{{ inputGeneSymbol.toUpperCase() }}-related</span
                >
                <input
                  class="form-control"
                  id="disease-name-input"
                  type="text"
                  :value="diseaseName"
                  @input="$emit('update:diseaseName', $event.target.value)"
                />
              </div>
            </div>
            <div
              class="row g-3 px-3"
              v-if="
                !geneDiseaseErrorMsg &&
                geneDiseaseData &&
                geneDiseaseData.results &&
                geneDiseaseData.results.length > 0
              "
            >
              <strong class="p-0">
                <p class="mb-0">Possible Disease Names and Cross References</p>
              </strong>
              <table
                class="table table-hover table-bordered"
                style="width: 100%"
              >
                <thead>
                  <tr>
                    <th>Use</th>
                    <th>Link</th>
                    <th>Name</th>
                    <th>Accession</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in geneDiseaseData.results">
                    <td>
                      <input
                        type="radio"
                        :id="`disease-name-use-input-${index}`"
                        :value="item"
                        v-model="selectedDiseaseObj"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :id="`disease-name-link-input-${index}`"
                        :checked="
                          diseaseCrossReferences.findIndex(
                            (diseaseCrossReference) =>
                              diseaseCrossReference.identifier ===
                              item.identifier
                          ) !== -1
                        "
                        @input="checkboxHandler(item, $event.target.checked)"
                      />
                    </td>
                    <td>{{ item.disease_name }}</td>
                    <td>
                      <a
                        v-bind:href="`https://www.omim.org/entry/${item.identifier}`"
                        style="text-decoration: none"
                        v-if="item.source === 'OMIM'"
                        target="_blank"
                      >
                        {{ item.identifier }}
                      </a>
                      <a
                        v-bind:href="`https://monarchinitiative.org/${item.identifier}`"
                        style="text-decoration: none"
                        v-else-if="item.source === 'Mondo'"
                        target="_blank"
                      >
                        {{ item.identifier }}
                      </a>
                      <span v-else>{{ item.identifier }}</span>
                    </td>
                    <td>{{ item.source }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
