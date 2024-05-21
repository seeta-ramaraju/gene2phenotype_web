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
      if (newPublicationsData && newPublicationsData.results) {
        let updatedMechanismEvidence = {};
        newPublicationsData.results.forEach((item) => {
          updatedMechanismEvidence[item.pmid] = {
            description: "",
            evidence_types: {
              Function: [],
              "Functional Alteration": [],
              Models: [],
              Rescue: [],
            },
          };
        });
        this.mechanismEvidence = updatedMechanismEvidence;
      }
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
                <label for="probabilities-input" class="col-form-label"
                  >Badoyni et al probabilities</label
                >
              </div>
              <div class="col-md-3">
                <label for="gain-of-function-input" class="form-label">
                  Gain of Function
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="gain-of-function-input"
                  disabled
                  value="Not Available"
                />
              </div>
              <div class="col-md-3">
                <label for="loss-of-function-input" class="form-label">
                  Loss of Function
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="loss-of-function-input"
                  disabled
                  value="Not Available"
                />
              </div>
              <div class="col-md-3">
                <label for="dominant-negative-input" class="form-label">
                  Dominant Negative
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="dominant-negative-input"
                  disabled
                  value="Not Available"
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
                  id="mechanism-input-source"
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
                <label for="categorisation-input" class="col-form-label"
                  >Categorisation</label
                >
              </div>
              <div class="col-3">
                <select
                  id="categorisation-input"
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
                  id="categorisation-input-source"
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
                !(
                  publicationsData &&
                  publicationsData.results &&
                  publicationsData.results.length > 0
                ) &&
                (molecularMechanism.support === 'evidence' ||
                  mechanismSynopsis.support === 'evidence')
              "
            >
              <p>
                <i class="bi bi-info-circle"></i> Please enter Publication(s) to
                provide information on evidence.
              </p>
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
              v-for="(item, index) in publicationsData.results"
            >
              <div class="col-12">
                <h6>Publication (PMID: {{ item.pmid }})</h6>
              </div>
              <div class="col-1">
                <label
                  :for="`evidence-type-input-${index}`"
                  class="col-form-label"
                  >Type</label
                >
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
                            :id="`evidence-type-biochemical-input-${index}`"
                            value="Biochemical"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-biochemical-input-${index}`"
                          >
                            Biochemical
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-protein-interaction-input-${index}`"
                            value="Protein Interaction"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-protein-interaction-input-${index}`"
                          >
                            Protein Interaction
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-protein-expression-input-${index}`"
                            value="Protein Expression"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Function'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-protein-expression-input-${index}`"
                          >
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
                            :id="`evidence-type-patient-cells-input-${index}`"
                            value="Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Functional Alteration'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-patient-cells-input-${index}`"
                          >
                            Patient Cells
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-non-patient-cells-input-${index}`"
                            value="Non Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Functional Alteration'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-non-patient-cells-input-${index}`"
                          >
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
                            :id="`evidence-type-models-non-human-model-organism-input-${index}`"
                            value="Non-Human Model Organism"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Models'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-models-non-human-model-organism-input-${index}`"
                          >
                            Non-Human Model Organism
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-models-cell-culture-model-input-${index}`"
                            value="Cell Culture Model"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Models'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-models-cell-culture-model-input-${index}`"
                          >
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
                            :id="`evidence-type-human-input-${index}`"
                            value="Human"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-human-input-${index}`"
                          >
                            Human
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-rescue-non-human-model-organism-input-${index}`"
                            value="Non-Human Model Organism"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-rescue-non-human-model-organism-input-${index}`"
                          >
                            Non-Human Model Organism
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-rescue-cell-culture-model-input-${index}`"
                            value="Cell Culture Model"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-rescue-cell-culture-model-input-${index}`"
                          >
                            Cell Culture Model
                          </label>
                        </div>
                      </li>
                      <li>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`evidence-type-patient-cells-input-${index}`"
                            value="Patient Cells"
                            v-model="
                              mechanismEvidence[item.pmid].evidence_types[
                                'Rescue'
                              ]
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`evidence-type-patient-cells-input-${index}`"
                          >
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
                <label
                  :for="`evidence-type-description-input-${index}`"
                  class="col-form-label"
                  >Description</label
                >
              </div>
              <div class="col-4">
                <textarea
                  class="form-control"
                  :id="`evidence-type-description-input-${index}`"
                  rows="3"
                  v-model.trim="mechanismEvidence[item.pmid].description"
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
