<script>
export default {
  props: {
    inputGeneSymbol: {
      type: String,
    },
    geneDiseaseData: {
      type: Object,
    },
    isGeneDiseaseDataLoading: {
      type: Boolean,
    },
    geneDiseaseErrorMsg: {
      type: String,
    },
  },
  emits: ["updateDisease"],
  watch: {
    pickedDiseaseName(newPickedDiseaseName) {
      this.diseaseName = newPickedDiseaseName.disease_name;
    },
    diseaseName(newDiseaseName) {
      const fullDiseaseName = `${this.inputGeneSymbol}-related ${newDiseaseName}`;
      const diseaseObj = {
        disease_name: fullDiseaseName,
        cross_references: this.diseaseCrossReferences,
      };
      this.$emit("updateDisease", diseaseObj);
    },
    diseaseCrossReferences(newDiseaseCrossReferences) {
      const fullDiseaseName = `${this.inputGeneSymbol}-related ${this.diseaseName}`;
      const diseaseObj = {
        disease_name: fullDiseaseName,
        cross_references: newDiseaseCrossReferences,
      };
      this.$emit("updateDisease", diseaseObj);
    },
  },
  data() {
    return {
      diseaseName: "",
      pickedDiseaseName: "",
      diseaseCrossReferences: [],
    };
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
          <div
            class="alert alert-danger mt-3"
            role="alert"
            v-if="geneDiseaseErrorMsg"
          >
            <div>
              <i class="bi bi-exclamation-circle-fill"></i>
              {{ geneDiseaseErrorMsg }}
            </div>
          </div>
          <div
            class="row g-3"
            v-if="
              geneDiseaseData &&
              geneDiseaseData.results &&
              geneDiseaseData.results.length > 0
            "
          >
            <div class="row g-3">
              <div class="col-auto">
                <label for="disease-name-input" class="col-form-label"
                  >Disease Name</label
                >
              </div>
              <div class="col input-group">
                <span class="input-group-text"
                  >{{ inputGeneSymbol.toUpperCase() }} - related</span
                >
                <input
                  class="form-control"
                  id="disease-name-input"
                  type="text"
                  v-model="diseaseName"
                />
              </div>
            </div>

            <div class="row g-3 px-3">
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
                  <tr v-for="item in geneDiseaseData.results">
                    <td>
                      <input
                        type="radio"
                        id="disease-name-use-input"
                        :value="item"
                        v-model="pickedDiseaseName"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        id="disease-name-link-input"
                        :value="item"
                        v-model="diseaseCrossReferences"
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
