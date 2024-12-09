<script>
import router from "@/router";
import { checkLogInAndAppendAuthHeaders } from "../utility/AuthenticationUtility.js";
import { ALL_PANELS_URL, DOWNLOAD_PANEL_URL } from "../utility/UrlConstants.js";
import ToolTip from "../components/tooltip/ToolTip.vue";

export default {
  data() {
    return {
      isDataLoading: false,
      panelData: null,
      activeDownloadPanelName: null,
      errorMsg: null,
      dataDownloadErrorMsg: null,
      searchInput: "",
      selectedSearchType: "all",
      selectedSearchPanel: "all",
    };
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchPanelData();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  components: {
    ToolTip,
  },
  methods: {
    fetchPanelData() {
      this.errorMsg = this.panelData = null;
      this.isDataLoading = true;
      const apiHeaders = checkLogInAndAppendAuthHeaders({
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      });
      fetch(ALL_PANELS_URL, {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(
              new Error("Unable to fetch panel data. Please try again later.")
            );
          }
        })
        .then((responseJson) => {
          this.isDataLoading = false;
          this.panelData = responseJson;
        })
        .catch((error) => {
          this.isDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
    searchClickHandler() {
      if (this.searchInput) {
        let routeQuery = {
          query: this.searchInput,
          type:
            this.selectedSearchType === "all"
              ? undefined
              : this.selectedSearchType,
          panel:
            this.selectedSearchPanel === "all"
              ? undefined
              : this.selectedSearchPanel,
        };
        router.push({ path: "/search", query: routeQuery });
      }
    },
    downloadPanelData(panelName) {
      let responseContentDisposition = null;
      this.dataDownloadErrorMsg = null;
      // before fetching panel data for download, activeDownloadPanelName is set to panelName
      // after fetching data, it is set to null
      this.activeDownloadPanelName = panelName;
      const apiHeaders = checkLogInAndAppendAuthHeaders({
        "Content-Type": "text/csv;charset=UTF-8",
      });
      fetch(DOWNLOAD_PANEL_URL.replace(":panelname", panelName), {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          responseContentDisposition = response.headers.get(
            "Content-Disposition"
          );
          if (response.status === 200) {
            return response.text();
          } else {
            return Promise.reject(
              new Error("Unable to download data. Please try again later.")
            );
          }
        })
        .then((responseText) => {
          this.activeDownloadPanelName = null;
          // get csv file name from response Content-Disposition header
          const regexMatch = responseContentDisposition.match(
            /attachment; filename="([^"]+)"/
          ); // Eg responseContentDisposition value: attachment; filename="some_file_name.csv"
          let csvFileName = "data.csv"; // default csv file name
          if (regexMatch && regexMatch.length > 0 && regexMatch[1]) {
            csvFileName = regexMatch[1];
          }
          // download csv data to file
          const csvDataText = responseText;
          const anchor = document.createElement("a");
          anchor.href =
            "data:text/csv;charset=utf-8," + encodeURIComponent(csvDataText);
          anchor.target = "_blank";
          anchor.download = csvFileName;
          anchor.click();
          anchor.remove();
        })
        .catch((error) => {
          this.activeDownloadPanelName = null;
          this.dataDownloadErrorMsg =
            error.message || "Unable to download data. Please try again later.";
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <div style="min-height: 60vh">
    <div class="container col-xxl-8 px-4">
      <div class="row flex-lg-row align-items-center py-5">
        <div class="col-10 col-sm-8 col-lg-4">
          <img
            src="../assets/G2P-logo.png"
            class="d-block mx-lg-auto img-fluid"
            alt="G2P logo"
            width="280"
            height="auto"
            loading="lazy"
          />
        </div>
        <div class="col-lg-8">
          <h1 class="display-5 fw-bold lh-1 mb-3">Gene2Phenotype (G2P)</h1>
          <h5 class="fw-bold lh-1 mb-3">
            Accelerating genomic medicine with high confidence evidence based
            gene disease models
          </h5>
          <p class="lead">
            Browse, search and download detailed gene-disease associations with
            information on allelic requirement, observed variant classes and
            disease mechanism.
          </p>
        </div>
      </div>
    </div>
    <div
      class="d-flex justify-content-center"
      v-if="isDataLoading"
      style="margin-top: 150px; margin-bottom: 150px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div class="px-5 py-4 text-center bg-body-tertiary">
        <div class="container px-3">
          <h1 class="pb-3">Search G2P</h1>
          <div class="col-lg-8 mx-auto">
            <div class="input-group shadow-sm">
              <input
                type="text"
                class="form-control"
                aria-label="Search text input"
                placeholder="Search for a Gene, Disease, Phenotype or G2P ID"
                v-model="searchInput"
                id="search-input"
                @keyup.enter="searchClickHandler"
              />
              <button
                class="btn btn-primary dropdown-toggle"
                style="border-right: solid"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter
              </button>
              <div class="dropdown-menu dropdown-menu-end p-3">
                <p class="fw-bold mb-1">Filter by type</p>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="all"
                    v-model="selectedSearchType"
                    id="filter-input-type-all"
                  />
                  <label class="form-check-label" for="filter-input-type-all">
                    All
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="gene"
                    v-model="selectedSearchType"
                    id="filter-input-type-gene"
                  />
                  <label class="form-check-label" for="filter-input-type-gene">
                    Gene
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="disease"
                    v-model="selectedSearchType"
                    id="filter-input-type-disease"
                  />
                  <label
                    class="form-check-label"
                    for="filter-input-type-disease"
                  >
                    Disease
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="phenotype"
                    v-model="selectedSearchType"
                    id="filter-input-type-phenotype"
                  />
                  <label
                    class="form-check-label"
                    for="filter-input-type-phenotype"
                  >
                    Phenotype
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="g2p_id"
                    v-model="selectedSearchType"
                    id="filter-input-type-g2p-id"
                  />
                  <label
                    class="form-check-label"
                    for="filter-input-type-g2p-id"
                  >
                    G2P ID
                  </label>
                </div>
                <div
                  v-if="
                    panelData &&
                    panelData.results &&
                    panelData.results.length > 0
                  "
                >
                  <hr class="dropdown-divider" />
                  <p class="fw-bold mb-1">Filter by panel</p>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="all"
                      v-model="selectedSearchPanel"
                      id="filter-input-panel-all"
                    />
                    <label
                      class="form-check-label"
                      for="filter-input-panel-all"
                    >
                      All
                    </label>
                  </div>
                  <div class="form-check" v-for="item in panelData.results">
                    <input
                      class="form-check-input"
                      type="radio"
                      :value="item.name.toLowerCase()"
                      v-model="selectedSearchPanel"
                      :id="`filter-input-panel-${item.name}`"
                    />
                    <label
                      class="form-check-label"
                      :for="`filter-input-panel-${item.name}`"
                    >
                      {{ item.description ? item.description : item.name }}
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-primary"
                @click="searchClickHandler"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
            <div class="form-text text-start">
              Example searches:
              <router-link
                :to="{
                  path: '/search',
                  query: { query: 'Weill-Marchesani syndrome' },
                }"
                style="text-decoration: none"
                >Weill-Marchesani syndrome</router-link
              >
              |
              <router-link
                :to="{
                  path: '/search',
                  query: { query: 'Tuberous sclerosis' },
                }"
                style="text-decoration: none"
                >Tuberous sclerosis</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="container px-5 py-4">
        <h1 class="pb-3 text-center">Browse panels</h1>
        <div
          class="alert alert-danger mx-auto col-lg-6"
          role="alert"
          v-if="errorMsg || dataDownloadErrorMsg"
        >
          <div>
            <i class="bi bi-exclamation-circle-fill"></i>
            {{ errorMsg || dataDownloadErrorMsg }}
          </div>
        </div>
        <div
          v-if="panelData && panelData.results && panelData.results.length > 0"
          class="col-lg-7 mx-auto"
        >
          <table class="table table-hover table-bordered shadow-sm">
            <thead>
              <tr>
                <th>Disorder Panel</th>
                <th>
                  Total LGMDE Records
                  <ToolTip
                    toolTipText="G2P records are Locus-Genotype-Mechanism-Disease-Evidence (LGMDE)
                    threads describing gene-disease associations"
                  />
                </th>
                <th>Total Genes</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in panelData.results">
                <td>
                  <router-link
                    :to="`/panel/${item.name}`"
                    v-if="item.name"
                    style="text-decoration: none"
                  >
                    {{ item.description ? item.description : item.name }}
                  </router-link>
                </td>
                <td>{{ item.stats?.total_records.toLocaleString() }}</td>
                <td>{{ item.stats?.total_genes.toLocaleString() }}</td>
                <td class="p-0">
                  <div class="d-flex justify-content-center">
                    <button
                      v-if="
                        activeDownloadPanelName &&
                        activeDownloadPanelName === item.name
                      "
                      disabled
                      class="btn btn-link p-0 mt-2"
                      type="button"
                    >
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="btn btn-link p-0"
                      @click="downloadPanelData(item.name)"
                      :disabled="
                        activeDownloadPanelName &&
                        activeDownloadPanelName !== item.name
                      "
                    >
                      <i class="bi bi-cloud-arrow-down-fill fs-4"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
