<script>
import MechanismEvidence from "./MechanismEvidence.vue";
import ToolTip from "../tooltip/ToolTip.vue";
import {
  MechanismAttribs,
  MechanismSynopsisAttribs,
  MechanismSupportAttribs,
} from "../../utility/CurationConstants";

export default {
  props: {
    molecularMechanism: String,
    molecularMechanismSupport: String,
    mechanismSynopsis: String,
    mechanismSynopsisSupport: String,
    mechanismEvidence: Object,
    mechanismGeneStats: Object,
  },
  emits: [
    "update:molecularMechanism",
    "update:molecularMechanismSupport",
    "update:mechanismSynopsis",
    "update:mechanismSynopsisSupport",
    "updateMechanismEvidence",
  ],
  components: {
    MechanismEvidence,
    ToolTip,
  },
  data() {
    return {
      mechanismAttribs: [...MechanismAttribs],
      mechanismSynopsisAttribs: [...MechanismSynopsisAttribs],
      mechanismSupportAttribs: [...MechanismSupportAttribs],
    };
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
              <p class="mb-0 fw-bold">
                Badoyni et al probabilities
                <ToolTip
                  toolTipText="These scores were calculated using a tripartite statistical model based on diverse gene and protein level features 
                  that are known to discriminate between molecular mechanisms. It is made up of machine classifiers trained to predict 
                  whether human protein coding genes are likely to be associated with dominant-negative, gain-of-function, or loss-of-function 
                  molecular disease mechanisms In many cases, the different dominant molecular mechanisms are not mutually exclusive in a gene."
                />
              </p>
              <p class="mb-0 mt-1">
                See
                <a
                  href="https://europepmc.org/article/MED/39172982"
                  target="_blank"
                  style="text-decoration: none"
                  >Badonyi and Marsh, 2024</a
                >
              </p>
              <div class="col-xl-5 col-lg-6">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <td width="60%">
                        Gain of Function (pGOF)
                        <ToolTip
                          toolTipText="Badonyi and Marsh pGOF:
                          the probability that the protein is associated with a gain-of-function disease mechanism 
                          (pGOF). Gain-of-function mechanisms are characterized by an altered or newly appeared function in the mutant protein. 
                          Genes with higher scores are more likely to be associated with a dominant-negative disease mechanism."
                        />
                      </td>
                      <td width="40%">
                        <span v-if="mechanismGeneStats.gain_of_function_mp">
                          {{ mechanismGeneStats.gain_of_function_mp }}
                        </span>
                        <span v-else class="text-muted">Not Available</span>
                      </td>
                    </tr>
                    <tr>
                      <td width="60%">
                        Loss of Function (pLOF)
                        <ToolTip
                          toolTipText="Badonyi and Marsh pLOF:
                          the probability that the protein is associated with a loss-of-function disease mechanism (pLOF).
                          A loss-of-function mechanism is characterised by complete ablation of the function of the proteinGenes
                          with higher scores are more likely to be associated with a dominant-negative disease mechanism."
                        />
                      </td>
                      <td width="40%">
                        <span v-if="mechanismGeneStats.loss_of_function_mp">
                          {{ mechanismGeneStats.loss_of_function_mp }}
                        </span>
                        <span v-else class="text-muted">Not Available</span>
                      </td>
                    </tr>
                    <tr>
                      <td width="60%">
                        Dominant Negative (pDN)
                        <ToolTip
                          toolTipText="Badonyi and Marsh pDN: 
                          the probability that the protein is associated with a dominant-negative disease mechanism (pDN). 
                          Dominant-negative mechanisms are characterized by the mutant protein directly or indirectly disrupting the function of the wild type protein.
                          Genes with higher scores are more likely to be associated with a dominant-negative disease mechanism."
                        />
                      </td>
                      <td width="40%">
                        <span v-if="mechanismGeneStats.dominant_negative_mp">
                          {{ mechanismGeneStats.dominant_negative_mp }}
                        </span>
                        <span v-else class="text-muted">Not Available</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <hr />
            <div class="row g-3 px-3 pt-3">
              <div class="col-lg-2">
                <label for="mechanism-input" class="col-form-label">
                  Mechanism<span class="text-danger">*</span>
                </label>
              </div>
              <div class="col-xl-3 col-lg-3 col-6">
                <select
                  id="mechanism-input"
                  class="form-select"
                  :value="molecularMechanism"
                  @input="
                    $emit('update:molecularMechanism', $event.target.value)
                  "
                >
                  <option value="">Select</option>
                  <option v-for="item in mechanismAttribs" :value="item">
                    {{ item }}
                  </option>
                </select>
              </div>
              <div class="col-xl-3 col-lg-3 col-6">
                <select
                  id="mechanism-input-source"
                  class="form-select"
                  :value="molecularMechanismSupport"
                  @input="
                    $emit(
                      'update:molecularMechanismSupport',
                      $event.target.value
                    )
                  "
                >
                  <option value="">Select Source</option>
                  <option v-for="item in mechanismSupportAttribs" :value="item">
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row g-3 px-3 py-3">
              <div class="col-lg-2">
                <label for="categorisation-input" class="col-form-label">
                  Categorisation
                </label>
              </div>
              <div class="col-xl-3 col-lg-3 col-6">
                <select
                  id="categorisation-input"
                  class="form-select"
                  :value="mechanismSynopsis"
                  @input="
                    $emit('update:mechanismSynopsis', $event.target.value)
                  "
                >
                  <option value="">Select</option>
                  <option
                    v-for="item in mechanismSynopsisAttribs"
                    :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>
              <div class="col-xl-3 col-lg-3 col-6">
                <select
                  id="categorisation-input-source"
                  class="form-select"
                  :value="mechanismSynopsisSupport"
                  @input="
                    $emit(
                      'update:mechanismSynopsisSupport',
                      $event.target.value
                    )
                  "
                >
                  <option value="">Select Source</option>
                  <option v-for="item in mechanismSupportAttribs" :value="item">
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
            <MechanismEvidence
              :molecularMechanismSupport="molecularMechanismSupport"
              :mechanismSynopsisSupport="mechanismSynopsisSupport"
              :mechanismEvidence="mechanismEvidence"
              @update-mechanism-evidence="
                (updatedMechanismEvidence) =>
                  $emit('updateMechanismEvidence', updatedMechanismEvidence)
              "
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
