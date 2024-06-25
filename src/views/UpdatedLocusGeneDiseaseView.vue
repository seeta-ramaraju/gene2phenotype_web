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
import {
  updateInputWithPublicationsData,
  prepareInputForDataSubmission,
  getInitialInputForNewCuration,
  prepareInputForUpdating,
} from "../utility/CurationUtility.js";
import SaveSuccessAlert from "../components/curation/SaveSuccessAlert.vue";

export default {
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.oldJsoninformation();
      },
      { immediate: true }
    );
  },
  data() {
    return {
      input: prepareInputForDataSubmission,
      issDataLoading: false,
      oldJSON: null,
      errorMsg: null,
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
    SaveSuccessAlert,
  },
  methods: {
    oldJsoninformation() {
      this.issDataLoading = true;
      this.oldJSON = null;
      const stableID = this.$route.params.stableID;
      fetch(`/gene2phenotype/api/curation/${stableID}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to fetch curation information");
          }
        })
        .then((responseJson) => {
          const responseData = responseJson.data;
          this.oldJSON = prepareInputForUpdating(responseData);
          console.log(this.oldJSON.disease);
          this.fetchGeneInformation();
          this.fetchGeneDiseaseInformation();
          this.fetchPanels();
          this.issDataLoading = false;
        })
        .catch((error) => {
          this.issDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
    fetchGeneInformation() {
      this.geneErrorMsg =
        this.geneFunctionData =
        this.geneData =
        this.attributesData =
          null;
      this.isGeneDataLoading = true;
      Promise.all([
        fetch(`/gene2phenotype/api/gene/${this.oldJSON.locus}/function/`),
        fetch(`/gene2phenotype/api/gene/${this.oldJSON.locus}/`),
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
      fetch(`/gene2phenotype/api/gene/${this.oldJSON.locus}/disease`)
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

    saveDraft() {
      this.submitErrorMsg = null;
      this.isSubmitSuccess = false;
      this.isSubmitDataLoading = true;
      const preparedInput = prepareInputForDataSubmission(this.input);
      const requestBody = {
        json_data: preparedInput,
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
  <div
    class="container px-5 py-3"
    style="min-height: 60vh"
    id="curation-form-section"
  >
    <h2>Update G2P Record</h2>
    <div v-if="geneData">
      <GeneInformation
        :geneData="geneData"
        :geneFunctionData="geneFunctionData"
      />
      <Genotype
        :attributesData="attributesData"
        v-model:allelic-requirement="oldJSON.allelic_requirement"
        v-model:cross-cutting-modifiers="oldJSON.cross_cutting_modifier"
      />
      <Disease
        :inputGeneSymbol="oldJSON.locus"
        :geneDiseaseData="geneDiseaseData.results"
        :isGeneDiseaseDataLoading="isGeneDiseaseDataLoading"
        :geneDiseaseErrorMsg="geneDiseaseErrorMsg"
        v-model:disease-name="oldJSON.disease.disease_name"
        v-model:disease-cross-references="oldJSON.disease.cross_references"
      />
      <Panel
        :panelData="panelData"
        :isPanelDataLoading="isPanelDataLoading"
        :panelErrorMsg="panelErrorMsg"
        v-model:panels="oldJSON.panels"
      />
      <Confidence
        :attributesData="attributesData"
        :inputPublications="oldJSON.cross_cutting_modifier"
        v-model:justification="oldJSON.confidence.justification"
        v-model:level="oldJSON.confidence.level"
      />
    </div>
  </div>
</template>
