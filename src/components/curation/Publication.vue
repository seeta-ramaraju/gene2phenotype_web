<script>
export default {
  data() {
    return {
      inputPmids: "",
      isInputPmidsValid: true,
      publications: {},
    };
  },
  props: {
    fetchPublications: {
      type: Function,
    },
    publicationsData: {
      type: Object,
    },
    isPublicationsDataLoading: {
      type: Boolean,
    },
    publicationsErrorMsg: {
      type: String,
    },
  },
  emits: ["updatePublications"],
  watch: {
    publicationsData(newPublicationsData) {
      if (newPublicationsData && newPublicationsData.results) {
        let updatedPublications = {};
        newPublicationsData.results.forEach((item) => {
          updatedPublications[item.pmid] = {
            families: null,
            affectedIndividuals: null,
            consanguineous: "unknown",
            ancestries: "",
            comment: "",
            source: item.source,
          };
        });
        this.publications = updatedPublications;
      }
    },
    publications: {
      handler(newPublications) {
        let publicationsArray = [];
        for (const [key, value] of Object.entries(newPublications)) {
          let publicationObj = { ...value };
          publicationObj.pmid = key;
          publicationsArray.push(publicationObj);
        }
        this.$emit("updatePublications", publicationsArray);
      },
      deep: true,
    },
  },
  methods: {
    fetchInputPublications() {
      if (this.inputPmids !== "") {
        this.isInputPmidsValid = true;
        this.fetchPublications(this.inputPmids);
      } else {
        this.isInputPmidsValid = false;
      }
    },
  },
};
</script>
<template>
  <div class="accordion py-1" id="publication-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publication-section-body"
          aria-expanded="false"
          aria-controls="publication-section-body"
        >
          Publications
        </button>
      </h2>
      <div id="publication-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div class="row g-3 py-3">
            <div class="col-auto">
              <label for="publications-input" class="col-form-label">
                Publication(s)
              </label>
            </div>
            <div class="col-4">
              <textarea
                :class="
                  isInputPmidsValid ? 'form-control' : 'form-control is-invalid'
                "
                id="publications-input"
                v-model.trim="inputPmids"
                rows="3"
                aria-describedby="invalid-publications-input-feedback"
              >
              </textarea>
              <div
                id="invalid-publications-input-feedback"
                class="invalid-feedback"
              >
                Please enter valid Publication(s).
              </div>
              <div class="form-text" id="publications-input-help-text">
                For multiple entries, separate by semicolon
              </div>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-primary mb-3"
                @click="fetchInputPublications"
              >
                <i class="bi bi-search"></i> Look Up
              </button>
            </div>
          </div>
          <div
            class="d-flex justify-content-center"
            v-if="isPublicationsDataLoading"
            style="margin-top: 20px; margin-bottom: 20px"
          >
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div
            class="alert alert-danger mt-3"
            role="alert"
            v-if="publicationsErrorMsg"
          >
            <div>
              <i class="bi bi-exclamation-circle-fill"></i>
              {{ publicationsErrorMsg }}
            </div>
          </div>
          <div v-if="publicationsData">
            <div>
              <strong><p>Enter Publications Data</p></strong>
            </div>
            <div
              class="accordion py-1"
              :id="`parent-accordion-${item.pmid}`"
              v-if="
                publicationsData &&
                publicationsData.results &&
                publicationsData.results.length > 0
              "
              v-for="item in publicationsData.results"
            >
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#inner-accordion-${item.pmid}`"
                    aria-expanded="true"
                    :aria-controls="`inner-accordion-${item.pmid}`"
                  >
                    PMID: {{ item.pmid }}
                  </button>
                </h2>
                <div
                  :id="`inner-accordion-${item.pmid}`"
                  class="accordion-collapse collapse show"
                  :data-bs-parent="`parent-accordion-${item.pmid}`"
                >
                  <div class="accordion-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <a
                          v-bind:href="`https://europepmc.org/article/MED/${item.pmid}`"
                          style="text-decoration: none"
                          v-if="item.pmid"
                          target="_blank"
                        >
                          View Publication
                          <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                      <div class="col-6">
                        <label
                          :for="`publication-pmid-input-${item.pmid}`"
                          class="form-label"
                        >
                          PMID
                        </label>
                        <input
                          class="form-control"
                          type="text"
                          v-bind:value="item.pmid"
                          aria-label="readonly input example"
                          :id="`publication-pmid-input-${item.pmid}`"
                          disabled
                        />
                      </div>
                      <div class="col-6">
                        <label
                          :for="`publication-year-input-${item.pmid}`"
                          class="form-label"
                          >Year</label
                        >
                        <input
                          class="form-control"
                          type="text"
                          :id="`publication-year-input-${item.pmid}`"
                          v-bind:value="item.year"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-12">
                        <label
                          :for="`publication-title-input-${item.pmid}`"
                          class="form-label"
                        >
                          Title
                        </label>
                        <input
                          class="form-control"
                          type="text"
                          :id="`publication-title-input-${item.pmid}`"
                          v-bind:value="item.title"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-12">
                        <label
                          :for="`publication-authors-input-${item.pmid}`"
                          class="form-label"
                        >
                          Authors
                        </label>
                        <input
                          class="form-control"
                          type="text"
                          :id="`publication-authors-input-${item.pmid}`"
                          v-bind:value="item.authors"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-md-3">
                        <label
                          :for="`publication-families-input-${item.pmid}`"
                          class="form-label"
                        >
                          Number of Families
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          :id="`publication-families-input-${item.pmid}`"
                          v-model="publications[item.pmid].families"
                        />
                      </div>
                      <div class="col-md-3">
                        <label
                          :for="`publication-affected-individuals-input-${item.pmid}`"
                          class="form-label"
                        >
                          Affected Individuals
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          :id="`publication-affected-individuals-input-${item.pmid}`"
                          v-model="publications[item.pmid].affectedIndividuals"
                        />
                      </div>
                      <div class="col-md-3">
                        <label
                          :for="`publication-consanguineous-input-${item.pmid}`"
                          class="form-label"
                          >Consanguineous</label
                        >
                        <select
                          :id="`publication-consanguineous-input-${item.pmid}`"
                          class="form-select"
                          v-model="publications[item.pmid].consanguineous"
                        >
                          <option value="unknown">Unknown</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label
                          :for="`publication-ancestries-input-${item.pmid}`"
                          class="form-label"
                        >
                          Ancestries
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          :id="`publication-ancestries-input-${item.pmid}`"
                          v-model.trim="publications[item.pmid].ancestries"
                        />
                      </div>
                      <div class="col-12">
                        <label
                          :for="`publication-comment-input-${item.pmid}`"
                          class="form-label"
                        >
                          Comment
                        </label>
                        <textarea
                          class="form-control"
                          :id="`publication-comment-input-${item.pmid}`"
                          rows="3"
                          v-model.trim="publications[item.pmid].comment"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
