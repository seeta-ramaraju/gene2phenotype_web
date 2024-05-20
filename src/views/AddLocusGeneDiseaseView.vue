<script>
import GeneInformation from "../components/curation/GeneInformation.vue";
import Publication from "../components/curation/Publication.vue";
import ClinicalPhenotype from "../components/curation/ClinicalPhenotype.vue";
import Genotype from "../components/curation/Genotype.vue";
import VariantInformation from "../components/curation/VariantInformation.vue";
import Mechanism from "../components/curation/Mechanism.vue";
import Disease from "../components/curation/Disease.vue";
import Panel from "../components/curation/Panel.vue";
import Confidence from "../components/curation/Confidence.vue";
import SaveDraftModal from "../components/curation/SaveDraftModal.vue";

export default {
  data() {
    return {
      input: {
        locus: "",
        session_name: "",
        publications: [],
        phenotypes: [],
        allelic_requirement: "",
        cross_cutting_modifier: [],
        variant_types: [],
        variant_descriptions: [],
        variant_consequences: [],
        molecular_mechanism: {},
        mechanism_synopsis: {},
        mechanism_evidence: [],
        disease: { disease_name: "", cross_references: [] },
        panels: [],
        confidence: {
          justification: "",
          level: "",
        },
      },
      inputValidation: {
        isLocusValid: true,
      },
      isGeneDataLoading: false,
      isGeneDiseaseDataLoading: false,
      isSubmitDataLoading: false,
      geneData: null,
      geneFunctionData: null,
      attributesData: null,
      geneErrorMsg: null,
      submitErrorMsg: null,
      isSubmitSuccess: false,
      publicationsErrorMsg: null,
      isPublicationsDataLoading: false,
      publicationsData: null,
      panelErrorMsg: null,
      isPanelDataLoading: false,
      panelData: null,
    };
  },
  components: {
    GeneInformation,
    Publication,
    ClinicalPhenotype,
    Genotype,
    VariantInformation,
    Mechanism,
    Disease,
    Panel,
    Confidence,
    SaveDraftModal,
  },
  methods: {
    geneSearchBtnClickHandler() {
      if (this.input.locus !== "") {
        this.inputValidation.isLocusValid = true;
        this.fetchGeneInformation();
        this.fetchGeneDiseaseInformation();
        this.fetchPanels();
      } else {
        this.inputValidation.isLocusValid = false;
      }
    },
    fetchGeneInformation() {
      this.geneErrorMsg =
        this.geneFunctionData =
        this.geneData =
        this.attributesData =
          null;
      this.isGeneDataLoading = true;
      Promise.all([
        fetch(`/gene2phenotype/api/gene/${this.input.locus}/function/`),
        fetch(`/gene2phenotype/api/gene/${this.input.locus}/`),
        fetch("/gene2phenotype/api/attribs/"),
      ])
        .then((responseArr) => {
          return Promise.all(
            responseArr.map((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                return Promise.reject(new Error("Unable to fetch gene data"));
              }
            })
          );
        })
        .then((responseJsonArr) => {
          const [geneFunctionData, geneData, attributesData] = responseJsonArr;
          this.isGeneDataLoading = false;
          this.geneData = geneData;
          this.geneFunctionData = geneFunctionData;
          this.attributesData = attributesData;
        })
        .catch((error) => {
          this.isGeneDataLoading = false;
          this.geneErrorMsg = error.message;
          console.log(error);
        });
    },
    fetchGeneDiseaseInformation() {
      this.geneDiseaseErrorMsg = this.geneDiseaseData = null;
      this.isGeneDiseaseDataLoading = true;
      fetch(`/gene2phenotype/api/gene/${this.input.locus}/disease`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(
              new Error("Unable to fetch gene disease data")
            );
          }
        })
        .then((responseJson) => {
          this.isGeneDiseaseDataLoading = false;
          this.geneDiseaseData = responseJson;
        })
        .catch((error) => {
          this.isGeneDiseaseDataLoading = false;
          this.geneDiseaseErrorMsg = error.message;
          console.log(error);
        });
    },
    fetchPanels() {
      this.panelErrorMsg = this.panelData = null;
      this.isPanelDataLoading = true;
      fetch("/gene2phenotype/api/panels/")
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(new Error("Unable to fetch panel data"));
          }
        })
        .then((responseJson) => {
          this.isPanelDataLoading = false;
          this.panelData = responseJson;
        })
        .catch((error) => {
          this.isPanelDataLoading = false;
          this.panelErrorMsg = error.message;
          console.log(error);
        });
    },
    fetchPublications(inputPmids) {
      this.publicationsErrorMsg = this.publicationsData = null;
      this.isPublicationsDataLoading = true;
      let pmidListStr = inputPmids
        .split(";")
        .filter((item) => item)
        .join(",");
      fetch(`/gene2phenotype/api/publication/${pmidListStr}/`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(
              new Error("Unable to fetch publications data")
            );
          }
        })
        .then((responseJson) => {
          this.isPublicationsDataLoading = false;
          this.publicationsData = responseJson;
        })
        .catch((error) => {
          this.isPublicationsDataLoading = false;
          this.publicationsErrorMsg = error.message;
          console.log(error);
        });
    },
    filterMechanismEvidence(input) {
      let filteredInput = { ...input };
      for (
        let index = 0;
        index < filteredInput.mechanism_evidence.length;
        index++
      ) {
        filteredInput.mechanism_evidence[index].evidence_types =
          filteredInput.mechanism_evidence[index].evidence_types.filter(
            (evidenceTypeItem) => evidenceTypeItem.secondary_type.length > 0
          );
      }
      filteredInput.mechanism_evidence =
        filteredInput.mechanism_evidence.filter(
          (inputItem) =>
            inputItem.description !== "" || inputItem.evidence_types.length > 0
        );
      return filteredInput;
    },
    filterPhenotypes(input) {
      let filteredInput = { ...input };
      filteredInput.phenotypes = filteredInput.phenotypes.filter(
        (inputItem) => inputItem.summary !== ""
      );
      return filteredInput;
    },
    saveDraft() {
      this.submitErrorMsg = null;
      this.isSubmitSuccess = false;
      this.isSubmitDataLoading = true;
      let filteredInput = this.filterMechanismEvidence(this.input);
      filteredInput = this.filterPhenotypes(filteredInput);
      const requestBody = {
        json_data: filteredInput,
      };
      let responseStatus = null;
      fetch("/gene2phenotype/api/add/curation/", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          responseStatus = response.status;
          return response.json();
        })
        .then((responseJson) => {
          this.isSubmitDataLoading = false;
          if (responseStatus === 200) {
            this.isSubmitSuccess = true;
          } else {
            let errorMsg = "Unable to submit data. Please try again later.";
            if (
              responseJson.errors?.message &&
              responseJson.errors?.message.length > 0
            ) {
              errorMsg = "Error: " + responseJson.errors.message[0];
            }
            this.submitErrorMsg = errorMsg;
            console.log(errorMsg);
          }
        })
        .catch((error) => {
          this.isSubmitDataLoading = false;
          this.submitErrorMsg =
            "Unable to submit data. Please try again later.";
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <h2>Add New G2P Record</h2>
    <form
      class="row g-3 pt-3 pb-1"
      @submit.prevent="geneSearchBtnClickHandler"
      v-if="!isSubmitSuccess"
    >
      <div class="col-auto">
        <label for="gene-symbol-input" class="col-form-label">Gene</label>
      </div>
      <div class="col-3">
        <input
          :class="
            inputValidation.isLocusValid
              ? 'form-control'
              : 'form-control is-invalid'
          "
          id="gene-symbol-input"
          v-model.trim="input.locus"
          aria-describedby="invalid-gene-symbol-input-feedback"
        />
        <div id="invalid-gene-symbol-input-feedback" class="invalid-feedback">
          Please enter a valid Gene.
        </div>
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3">Search</button>
      </div>
    </form>
    <p v-if="!geneData">
      <i class="bi bi-info-circle"></i> Please enter Gene and click Search to
      proceed further.
    </p>
    <div
      class="d-flex justify-content-center"
      v-if="isGeneDataLoading || isSubmitDataLoading"
      style="margin-top: 250px; margin-bottom: 250px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="alert alert-danger mt-3" role="alert" v-if="geneErrorMsg">
      <div>
        <i class="bi bi-exclamation-circle-fill"></i> {{ geneErrorMsg }}
      </div>
    </div>
    <div
      id="curation-form-section"
      v-if="geneData && !isSubmitDataLoading && !isSubmitSuccess"
    >
      <GeneInformation
        :geneData="geneData"
        :geneFunctionData="geneFunctionData"
      />
      <Publication
        :fetchPublications="fetchPublications"
        :publicationsData="publicationsData"
        :isPublicationsDataLoading="isPublicationsDataLoading"
        :publicationsErrorMsg="publicationsErrorMsg"
        @update-publications="(valueArray) => (input.publications = valueArray)"
      />
      <ClinicalPhenotype
        :publicationsData="publicationsData"
        @update-clinical-phenotype="
          (valueArray) => (input.phenotypes = valueArray)
        "
      />
      <Genotype
        :attributesData="attributesData"
        v-model:allelic-requirement="input.allelic_requirement"
        @update-cross-cutting-modifiers="
          (valueArray) => (input.cross_cutting_modifier = valueArray)
        "
      />
      <VariantInformation
        :publicationsData="publicationsData"
        @update-variant-types="
          (valueArray) => (input.variant_types = valueArray)
        "
        @update-variant-descriptions="
          (valueArray) => (input.variant_descriptions = valueArray)
        "
        @update-variant-consequences="
          (valueArray) => (input.variant_consequences = valueArray)
        "
      />
      <Mechanism
        :publicationsData="publicationsData"
        :attributesData="attributesData"
        @update-molecular-mechanism="
          (valueObj) => (input.molecular_mechanism = valueObj)
        "
        @update-mechanism-synopsis="
          (valueObj) => (input.mechanism_synopsis = valueObj)
        "
        @update-mechanism-evidence="
          (valueArray) => (input.mechanism_evidence = valueArray)
        "
      />
      <Disease
        :inputGeneSymbol="input.locus"
        :geneDiseaseData="geneDiseaseData"
        :isGeneDiseaseDataLoading="isGeneDiseaseDataLoading"
        :geneDiseaseErrorMsg="geneDiseaseErrorMsg"
        @update-disease="(valueObj) => (input.disease = valueObj)"
      />
      <Panel
        :panelData="panelData"
        :isPanelDataLoading="isPanelDataLoading"
        :panelErrorMsg="panelErrorMsg"
        @update-panels="(valueArray) => (input.panels = valueArray)"
      />
      <Confidence
        :attributesData="attributesData"
        :inputPublications="input.publications"
        v-model:justification="input.confidence.justification"
        v-model:level="input.confidence.level"
      />
    </div>
    <div class="alert alert-danger mt-3" role="alert" v-if="submitErrorMsg">
      <div>
        <i class="bi bi-exclamation-circle-fill"></i> {{ submitErrorMsg }}
      </div>
    </div>
    <div
      class="d-flex justify-content-between py-3"
      v-if="geneData && !isSubmitDataLoading && !isSubmitSuccess"
    >
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#save-draft-modal"
      >
        Save Draft
      </button>
      <button class="btn btn-primary">Publish</button>
    </div>
    <div
      class="alert alert-success mx-auto col-6"
      style="margin-top: 50px"
      role="alert"
      v-if="isSubmitSuccess"
    >
      <h4 class="alert-heading">
        <i
          class="bi bi-check-circle-fill"
          style="color: green; margin-right: 10px"
        >
        </i>
        Success
      </h4>
      <p>Curation Entry saved as draft.</p>
      <hr />
      <div class="d-flex justify-content-between">
        <router-link to="/curation/entries" class="btn btn-primary me-3">
          View All Saved Drafts
        </router-link>
        <router-link to="/lgd/add" class="btn btn-primary">
          Add Another G2P Record
        </router-link>
      </div>
    </div>
    <SaveDraftModal
      v-model:sessionname="input.session_name"
      @savedraft="saveDraft"
    />
  </div>
</template>
<style scoped>
h5 {
  font-weight: bold;
}
h6 {
  font-weight: bold;
}
</style>
