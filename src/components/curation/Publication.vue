<script>
export default {
  data() {
    return {
      inputPmids: null,
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
      newPublicationsData.results.forEach((item) => {
        this.publications[item.pmid] = {
          families: null,
          affectedIndividuals: null,
          consanguineous: "unknown",
          ancestries: "",
          comment: "",
        };
      });
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
      this.fetchPublications(this.inputPmids);
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
              <label for="inputPassword6" class="col-form-label"
                >Publication(s)</label
              >
            </div>
            <div class="col-4">
              <textarea
                class="form-control"
                id="gene-symbol-input"
                v-model="inputPmids"
                rows="3"
              >
              </textarea>
              <div class="form-text" id="basic-addon4">
                Enter multiple entries separated by semicolon
              </div>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-primary mb-3"
                @click="fetchInputPublications"
              >
                Look Up
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
                        <label for="inputEmail4" class="form-label">
                          PMID
                        </label>
                        <input
                          class="form-control"
                          type="text"
                          v-bind:value="item.pmid"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-6">
                        <label for="inputEmail4" class="form-label">Year</label>
                        <input
                          class="form-control"
                          type="text"
                          v-bind:value="item.year"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-12">
                        <label for="inputEmail4" class="form-label"
                          >Title</label
                        >
                        <input
                          class="form-control"
                          type="text"
                          v-bind:value="item.title"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-12">
                        <label for="inputEmail4" class="form-label"
                          >Authors</label
                        >
                        <input
                          class="form-control"
                          type="text"
                          v-bind:value="item.authors"
                          aria-label="readonly input example"
                          disabled
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="families-input" class="form-label"
                          >Number of Families</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          id="families-input"
                          v-model="publications[item.pmid].families"
                        />
                      </div>
                      <div class="col-md-3">
                        <label
                          for="affected-individuals-input"
                          class="form-label"
                          >Affected Individuals</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          id="affected-individuals-input"
                          v-model="publications[item.pmid].affectedIndividuals"
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="consanguineous-input" class="form-label"
                          >Consanguineous</label
                        >
                        <select
                          id="consanguineous-input"
                          class="form-select"
                          v-model="publications[item.pmid].consanguineous"
                        >
                          <option value="unknown">Unknown</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label for="ancestries-input" class="form-label">
                          Ancestries
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="ancestries-input"
                          v-model="publications[item.pmid].ancestries"
                        />
                      </div>
                      <div class="col-12">
                        <label
                          for="publication-comment-input"
                          class="form-label"
                        >
                          Comment
                        </label>
                        <textarea
                          class="form-control"
                          id="publication-comment-input"
                          rows="3"
                          v-model="publications[item.pmid].comment"
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
