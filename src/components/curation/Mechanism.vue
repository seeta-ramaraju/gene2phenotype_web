<script>
export default {
  data() {
    return {
      molecularMechanism: {
        name: "undetermined",
        support: "inferred",
      },
      mechanismSynopsis: {
        name: "",
        support: "inferred",
      },
      mechanismEvidence: {},
    };
  },
  props: {
    publicationsData: {
      type: Object,
    },
    attributesData: {
      type: Object,
    },
  },
  emits: [
    "updateMolecularMechanism",
    "updateMechanismSynopsis",
    "updateMechanismEvidence",
  ],
  watch: {
    publicationsData(newPublicationsData) {
      newPublicationsData.results.forEach((item) => {
        this.mechanismEvidence[item.pmid] = {
          description: "",
          evidence_types: {
            Function: [],
            "Functional Alteration": [],
            Models: [],
            Rescue: [],
          },
        };
      });
    },
    molecularMechanism: {
      handler(newMolecularMechanism) {
        this.$emit("updateMolecularMechanism", newMolecularMechanism);
      },
      deep: true,
    },
    mechanismSynopsis: {
      handler(newMechanismSynopsis) {
        this.$emit("updateMechanismSynopsis", newMechanismSynopsis);
      },
      deep: true,
    },
    mechanismEvidence: {
      handler(newMechanismEvidence) {
        let mechanismEvidenceArray = [];
        for (const [key, value] of Object.entries(newMechanismEvidence)) {
          let mechanismEvidenceObj = { ...value };
          mechanismEvidenceObj.pmid = key;
          let evidenceTypesArray = [];
          for (const [primaryType, secondaryType] of Object.entries(
            mechanismEvidenceObj.evidence_types
          )) {
            let evidenceTypeObj = {};
            evidenceTypeObj.primary_type = primaryType;
            evidenceTypeObj.secondary_type = secondaryType;
            evidenceTypesArray.push(evidenceTypeObj);
          }
          mechanismEvidenceObj.evidence_types = evidenceTypesArray;
          mechanismEvidenceArray.push(mechanismEvidenceObj);
        }
        this.$emit("updateMechanismEvidence", mechanismEvidenceArray);
      },
      deep: true,
    },
  },
};
</script>
<template>
  <div class="accordion py-1" id="mechanism-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mechanism-section-body"
          aria-expanded="false"
          aria-controls="mechanism-section-body"
        >
          Mechanism
        </button>
      </h2>
      <div id="mechanism-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <form>
            <div class="row g-3 px-3">
              <div class="col-2">
                <label for="inputPassword6" class="col-form-label"
                  >Badoyni et al probabilities</label
                >
              </div>
              <div class="col-md-3">
                <label for="inputEmail4" class="form-label"
                  >Gain of Function</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="inputEmail4"
                  disabled
                  value="0.610"
                />
              </div>
              <div class="col-md-3">
                <label for="inputEmail4" class="form-label"
                  >Loss of Function</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="inputEmail4"
                  disabled
                  value="0.242"
                />
              </div>
              <div class="col-md-3">
                <label for="inputEmail4" class="form-label"
                  >Dominant Negative</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="inputEmail4"
                  disabled
                  value="0.777"
                />
              </div>
            </div>
            <div class="row g-3 px-3 pt-4">
              <div class="col-2">
                <label for="mechanism-input" class="col-form-label">
                  Mechanism
                </label>
              </div>
              <div class="col-3">
                <select
                  id="mechanism-input"
                  class="form-select"
                  v-model="molecularMechanism.name"
                >
                  <option
                    v-for="item in attributesData.mechanism"
                    :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>
              <div class="col-3">
                <select
                  id="inputState"
                  class="form-select"
                  v-model="molecularMechanism.support"
                >
                  <option value="inferred">Inferred</option>
                  <option value="evidence">Evidence</option>
                </select>
              </div>
            </div>
            <div class="row g-3 px-3 py-3">
              <div class="col-2">
                <label for="inputPassword6" class="col-form-label"
                  >Categorisation</label
                >
              </div>
              <div class="col-3">
                <select
                  id="inputState"
                  class="form-select"
                  v-model="mechanismSynopsis.name"
                >
                  <option disabled value="">Select</option>
                  <option
                    v-for="item in attributesData.mechanism_synopsis"
                    :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>
              <div class="col-3">
                <select
                  id="inputState"
                  class="form-select"
                  v-model="mechanismSynopsis.support"
                >
                  <option value="inferred">Inferred</option>
                  <option value="evidence">Evidence</option>
                </select>
              </div>
            </div>
            <div
              class="row g-3 px-3 pt-3"
              v-if="
                publicationsData &&
                publicationsData.results &&
                publicationsData.results.length > 0 &&
                (molecularMechanism.support === 'evidence' ||
                  mechanismSynopsis.support === 'evidence')
              "
            >
              <div class="col-12"><h5>Evidence</h5></div>
            </div>
            <div
              class="row g-3 px-3 py-3"
              v-if="
                publicationsData &&
                publicationsData.results &&
                publicationsData.results.length > 0 &&
                (molecularMechanism.support === 'evidence' ||
                  mechanismSynopsis.support === 'evidence')
              "
              v-for="item in publicationsData.results"
            >
              <div class="col-12">
                <h6>Publication (PMID: {{ item.pmid }})</h6>
              </div>
              <div class="col-1">
                <label for="inputPassword6" class="col-form-label">Type</label>
              </div>
              <div class="col-3">
                <ul style="list-style: none; padding-left: 0">
                  <li>
                    Function
                    <ul style="list-style: none">
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Biochemical"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Biochemical
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Protein Interaction"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Protein Interaction
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Protein Expression"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Protein Expression
                          </label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Functional Alteration
                    <ul style="list-style: none">
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Functional Alteration'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Patient Cells
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Non Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Functional Alteration'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Non Patient Cells
                          </label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Models
                    <ul style="list-style: none">
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Non-Human Model Organism"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Models'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Non-Human Model Organism
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Cell Culture Model"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Models'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Cell Culture Model
                          </label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Rescue
                    <ul style="list-style: none">
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Human"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Human
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Non-Human Model Organism"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Non-Human Model Organism
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Cell Culture Model"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Cell Culture Model
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            value="Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label class="form-check-label" for="gridCheck1">
                            Patient Cells
                          </label>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="col-8"></div>
              <div class="col-1">
                <label for="inputPassword6" class="col-form-label"
                  >Description</label
                >
              </div>
              <div class="col-4">
                <textarea
                  class="form-control"
                  id="gene-symbol-input"
                  rows="3"
                  v-model="mechanismEvidence[item.pmid].description"
                >
                </textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
