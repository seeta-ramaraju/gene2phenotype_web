<script>
import { ATTRIBS_URL, LGD_RECORD_URL } from "../utility/UrlConstants.js";
import { appendAuthenticationHeaders } from "../utility/AuthenticationUtility.js";
import UpdateConfidence from "./update/UpdateConfidence.vue";
import UpdatePanel from "./update/UpdatePanel.vue";

export default {
  data() {
    return {
      isApiCallLoading: false,
      locusGeneDiseaseData: null,
      attributesData: null,
      errorMsg: null,
      stableId: null,
    };
  },
  components: {
    UpdateConfidence,
    UpdatePanel,
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchLGDAndAttribsData();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    fetchLGDAndAttribsData() {
      this.stableId = this.$route.params.stableId;
      this.errorMsg = this.locusGeneDiseaseData = this.attributesData = null;
      this.isApiCallLoading = true;
      const apiHeaders = appendAuthenticationHeaders({
        "Content-Type": "application/json",
      });
      Promise.all([
        fetch(ATTRIBS_URL, {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(LGD_RECORD_URL.replace(":stableid", this.stableId), {
          method: "GET",
          headers: apiHeaders,
        }),
      ])
        .then((responseArr) => {
          return Promise.all(
            responseArr.map((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                return Promise.reject(new Error("Unable to fetch data"));
              }
            })
          );
        })
        .then((responseJsonArr) => {
          this.isApiCallLoading = false;
          const [attributesData, locusGeneDiseaseData] = responseJsonArr;
          this.attributesData = attributesData;
          this.locusGeneDiseaseData = locusGeneDiseaseData;
        })
        .catch((error) => {
          this.isApiCallLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
    goToRecordPage() {
      this.$router.push(`/lgd/${this.stableId}`);
    },
  },
};
</script>
<template>
  <div
    class="container px-5 py-3"
    style="min-height: 60vh"
    id="update-g2p-record-form-section"
  >
    <div class="d-flex justify-content-between pb-2">
      <h2>Update G2P Record</h2>
      <button class="btn btn-outline-primary" @click="goToRecordPage">
        Go to record page
      </button>
    </div>
    <div
      class="d-flex justify-content-center"
      v-if="isApiCallLoading"
      style="margin-top: 250px; margin-bottom: 250px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="alert alert-danger mt-3" role="alert" v-if="errorMsg">
      <div>
        <i class="bi bi-exclamation-circle-fill"></i>
        {{ errorMsg }}
      </div>
    </div>
    <div v-if="locusGeneDiseaseData">
      <h4 v-if="locusGeneDiseaseData.disease?.name" class="pb-2">
        {{ locusGeneDiseaseData.disease.name }}
      </h4>
      <h4 v-else class="text-muted pb-2">Disease Name Not Available</h4>
      <p>
        <i class="bi bi-info-circle"></i> Open any individual section to update
        data accordingly.
      </p>
      <UpdatePanel
        :stableId="stableId"
        :currentPanels="locusGeneDiseaseData.panels"
      />
      <UpdateConfidence
        :stableId="stableId"
        :attributesData="attributesData"
        :currentLevel="locusGeneDiseaseData.confidence"
        :currentJustification="locusGeneDiseaseData.confidence_support"
      />
    </div>
  </div>
</template>
