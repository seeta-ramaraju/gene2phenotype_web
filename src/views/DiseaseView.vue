<script>
import { DISEASE_SUMMARY_URL, DISEASE_URL } from "../utility/UrlConstants.js";
import { CONFIDENCE_COLOR_MAP, HELP_TEXT } from "../utility/Constants.js";
import { checkLogInAndAppendAuthHeaders } from "../utility/AuthenticationUtility.js";
import ToolTip from "../components/tooltip/ToolTip.vue";

export default {
  data() {
    return {
      isDataLoading: false,
      diseaseSummaryData: null,
      diseaseData: null,
      errorMsg: null,
      confidenceColorMap: { ...CONFIDENCE_COLOR_MAP },
      helpText: { ...HELP_TEXT },
    };
  },
  created() {
    //watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData();
      },
      // fetch this data when the view is created and the data is already being observed
      { immediate: true }
    );
  },
  components: { ToolTip },
  methods: {
    fetchData() {
      this.errorMsg = this.diseaseSummaryData = this.diseaseData = null;
      this.isDataLoading = true;
      const diseaseName = this.$route.params.name;
      const apiHeaders = checkLogInAndAppendAuthHeaders({
        "Content-Type": "application/json",
      });
      Promise.all([
        fetch(DISEASE_SUMMARY_URL.replace(":diseasename", diseaseName), {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(DISEASE_URL.replace(":diseasename", diseaseName), {
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
                return Promise.reject(
                  new Error(
                    `Unable to fetch Disease information for ${diseaseName}`
                  )
                );
              }
            })
          );
        })
        .then((responseJsonArr) => {
          const [diseaseSummaryData, diseaseData] = responseJsonArr;
          this.isDataLoading = false;
          this.diseaseData = diseaseData;
          this.diseaseSummaryData = diseaseSummaryData;
        })
        .catch((error) => {
          this.isDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <div
      class="d-flex justify-content-center"
      v-if="isDataLoading"
      style="margin-top: 250px; margin-bottom: 250px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="alert alert-danger mt-3" role="alert" v-if="errorMsg">
      <div><i class="bi bi-exclamation-circle-fill"></i> {{ errorMsg }}</div>
    </div>
    <div v-if="diseaseData && diseaseSummaryData">
      <h2 v-if="diseaseData.name">{{ diseaseData.name }}</h2>
      <h2 v-else class="text-muted">Not Available</h2>
      <h4 class="py-3">Synonyms</h4>
      <div>
        <ul v-if="diseaseData.synonyms && diseaseData.synonyms.length > 0">
          <li v-for="item in diseaseData.synonyms" :key="item">{{ item }}</li>
        </ul>
        <p v-else class="text-muted">Not Available</p>
      </div>
      <h4 class="py-3">Latest Records</h4>
      <div class="table-responsive-xl">
        <table
          class="table table-hover table-bordered shadow-sm"
          v-if="
            diseaseSummaryData.records_summary &&
            diseaseSummaryData.records_summary.length > 0
          "
        >
          <thead>
            <tr>
              <th>G2P ID</th>
              <th>Gene</th>
              <th>Genotype</th>
              <th>Variant Consequence</th>
              <th>Variant Type</th>
              <th>Mechanism</th>
              <th>Confidence</th>
              <th>Panels</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in diseaseSummaryData.records_summary">
              <td>
                <router-link
                  :to="`/lgd/${item.stable_id}`"
                  style="text-decoration: none"
                  v-if="item.stable_id"
                >
                  {{ item.stable_id }}
                </router-link>
              </td>
              <td>
                <router-link
                  :to="`/gene/${item.locus}`"
                  style="text-decoration: none"
                  v-if="item.locus"
                >
                  {{ item.locus }}
                </router-link>
              </td>
              <td>
                {{ item.genotype }}
              </td>
              <td>
                {{
                  Array.isArray(item.variant_consequence)
                    ? item.variant_consequence.join(", ")
                    : item.variant_consequence
                }}
              </td>
              <td>
                {{
                  Array.isArray(item.variant_type)
                    ? item.variant_type.join(", ")
                    : item.variant_type
                }}
              </td>
              <td>
                {{ item.molecular_mechanism }}
              </td>
              <td>
                <span
                  v-if="item.confidence"
                  class="badge text-white"
                  :style="{
                    backgroundColor:
                      confidenceColorMap[item.confidence.toLowerCase()],
                  }"
                >
                  {{ item.confidence }}
                </span>
              </td>
              <td>
                <span
                  v-if="item.panels && item.panels.length > 0"
                  v-for="(panelName, index) in item.panels"
                >
                  <router-link
                    :to="`/panel/${panelName}`"
                    style="text-decoration: none"
                  >
                    {{ panelName }} </router-link
                  ><span v-if="index < item.panels.length - 1">, </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No Records found</p>
      </div>
      <h4
        v-if="
          diseaseData.ontology_terms && diseaseData.ontology_terms.length > 0
        "
        class="py-3"
      >
        Cross references <ToolTip :toolTipText="helpText.CROSS_REFERENCES" />
      </h4>
      <table
        class="table table-bordered table-hover w-50 shadow-sm"
        v-if="
          diseaseData.ontology_terms && diseaseData.ontology_terms.length > 0
        "
        width="50%"
      >
        <thead>
          <tr>
            <th>Accession</th>
            <th>Term</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in diseaseData.ontology_terms">
            <td>
              <a
                :href="`https://www.omim.org/entry/${item.accession}`"
                v-if="item.source === 'OMIM'"
                target="_blank"
                style="text-decoration: none"
              >
                {{ item.accession }}
              </a>
              <a
                :href="`https://monarchinitiative.org/${item.accession}`"
                v-else-if="item.source === 'Mondo'"
                target="_blank"
                style="text-decoration: none"
              >
                {{ item.accession }}
              </a>
              <span v-else>{{ item.accession }}</span>
            </td>
            <td>{{ item.term }}</td>
            <td>{{ item.source }}</td>
          </tr>
        </tbody>
      </table>
      <h4
        v-if="diseaseData.publications && diseaseData.publications.length > 0"
        class="py-3"
      >
        Publications
      </h4>
      <ul
        v-for="item in diseaseData.publications"
        v-if="diseaseData.publications && diseaseData.publications.length > 0"
      >
        <li>
          <a
            :href="`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`"
            target="_blank"
          >
            {{ item.title }}
          </a>
        </li>
      </ul>
      <p>
        <strong>Last Update: </strong>
        <span v-if="diseaseData.last_updated && diseaseData.last_updated != ''">
          {{ diseaseData.last_updated }}
        </span>
        <span v-else class="text-muted">Not Available</span>
      </p>
    </div>
  </div>
</template>
