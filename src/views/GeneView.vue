<script>
export default {
  data() {
    return {
      isDataLoading: false,
      geneSummaryData: null,
      geneData: null,
      errorMsg: null,
    };
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    fetchData() {
      this.errorMsg = this.geneSummaryData = this.geneData = null;
      this.isDataLoading = true;
      Promise.all([
        fetch(`/gene2phenotype/api/gene/${this.$route.params.symbol}/summary/`),
        fetch(`/gene2phenotype/api/gene/${this.$route.params.symbol}/`),
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
          const [geneSummaryData, geneData] = responseJsonArr;
          this.isDataLoading = false;
          this.geneData = geneData;
          this.geneSummaryData = geneSummaryData;
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
  <div class="container px-5 py-3">
    <div v-if="isDataLoading">Data is loading...Please wait...</div>
    <div v-if="errorMsg" class="text-danger">{{ errorMsg }}</div>
    <div v-if="geneData && geneSummaryData">
      <h3 v-if="geneData.gene_symbol">{{ geneData.gene_symbol }}</h3>
      <h3 v-else>Not Available</h3>
      <h4 class="py-3">Other Synonyms</h4>
      <div class="row">
        <p v-if="geneData.synonyms && geneData.synonyms.length > 0">
          {{ geneData.synonyms.join(", ") }}
        </p>
        <p v-else style="color: grey">Not Available</p>
      </div>
      <h4 class="py-3">Latest Records</h4>
      <div class="row mx-1">
        <table
          class="table table-hover table-bordered"
          v-if="
            geneSummaryData.records_summary &&
            geneSummaryData.records_summary.length > 0
          "
        >
          <thead>
            <tr>
              <th>Disease</th>
              <th>Genotype</th>
              <th>Variant Consequence</th>
              <th>Variant Type</th>
              <th>Mechanism</th>
              <th>Confidence</th>
              <th>Panels</th>
              <th>Record Page</th>
            </tr>
          </thead>
          <tbody v-for="item in geneSummaryData.records_summary">
            <tr>
              <td>{{ item.disease }}</td>
              <td>{{ item.genotype }}</td>
              <td>{{ item.variant_consequence.join(", ") }}</td>
              <td>{{ item.variant_type.join(", ") }}</td>
              <td></td>
              <td>{{ item.confidence }}</td>
              <td>{{ item.panels.join(", ") }}</td>
              <td>
                <button class="btn btn-primary">
                  View <i class="bi bi-box-arrow-up-right"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else style="color: grey">Not Available</p>
      </div>
      <h4 class="py-3">Additional Links</h4>
      <div class="row mx-3 pb-3">
        <ul>
          <li>
            <a href="#" style="text-decoration: none">
              View this gene or submit patient variants via DECIPHER
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </li>
          <li v-if="geneData.ids.Ensembl">
            <a
              v-bind:href="`https://www.ensembl.org/Homo_sapiens/Gene?g=${geneData.ids.Ensembl}`"
              style="text-decoration: none"
            >
              View this gene on Ensembl website
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </li>
          <li v-if="geneData.ids.HGNC">
            <a
              v-bind:href="`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:${geneData.ids.HGNC}`"
              style="text-decoration: none"
            >
              View this gene on HGNC website
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </li>
        </ul>
      </div>
      <p>
        <strong>Last Update: </strong>
        <span v-if="geneData.last_updated">
          {{ geneData.last_updated }}
        </span>
        <span v-else style="color: grey">Not Available</span>
      </p>
    </div>
  </div>
</template>
