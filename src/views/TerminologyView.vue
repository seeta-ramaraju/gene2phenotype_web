<script>
import { checkLogInAndAppendAuthHeaders } from "../utility/AuthenticationUtility.js";

export default {
  data() {
    return {
      isDataLoading: false,
      terminologyDescriptionData: null,
      MolecularDescriptionData: null,
      VariantDescriptionData: null,
      errorMsg: null,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData();
      },
      { immediate: true }
    );
  },

  methods: {
    fetchData() {
      this.errorMsg = this.terminologyDescriptionData = null;
      this.isDataLoading = true;

      const apiHeaders = checkLogInAndAppendAuthHeaders({
        "Content-Type": "application/json",
      });
      Promise.all([
        fetch(`/gene2phenotype/api/attribs/description`, {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(`/gene2phenotype/api/molecular_mechanisms/`, {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(`/gene2phenotype/api/ontology_terms/variant_types/`, {
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
                  new Error("Unable to fetch descriptions data")
                );
              }
            })
          );
        })
        .then((responseJsonArr) => {
          const [
            terminologyDescriptionData,
            MolecularDescriptionData,
            VariantDescriptionData,
          ] = responseJsonArr;
          this.isDataLoading = false;
          this.terminologyDescriptionData = terminologyDescriptionData;
          this.MolecularDescriptionData = MolecularDescriptionData;
          this.VariantDescriptionData = VariantDescriptionData;
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
    <div v-if="terminologyDescriptionData">
      <div class="container px-5 py-3" style="min-height: 60vh">
        <h4>G2P Confidence Category</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="con_category in terminologyDescriptionData.confidence_category"
              >
                <tr
                  v-for="(description, category) in con_category"
                  :key="category"
                >
                  <td>{{ category }}</td>
                  <td>
                    <span v-if="description">{{ description }}</span>
                    <span v-else class="text-muted"
                      >No description available</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br />
        <h4>Allelic Requirement</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Genotype</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="genotypes in terminologyDescriptionData.genotype"
              >
                <tr
                  v-for="(description, genotype) in genotypes"
                  :key="genotype"
                >
                  <td>{{ genotype }}</td>
                  <td>
                    <span v-if="description">{{ description }}</span>
                    <span v-else class="text-muted"
                      >No description available</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br />
        <h4>Cross Cutting Modifier</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Modifier</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="modifiers in terminologyDescriptionData.cross_cutting_modifier"
              >
                <tr
                  v-for="(description, modifier) in modifiers"
                  :key="modifier"
                >
                  <td>{{ modifier }}</td>
                  <td>
                    <span v-if="description">{{ description }}</span>
                    <span v-else class="text-muted"
                      >No description available</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br />
        <h4>Molecular Mechanism</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Consequence</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="consequences in MolecularDescriptionData.mechanism"
              >
                <tr
                  v-for="(description, consequence) in consequences"
                  :key="consequence"
                >
                  <td>{{ consequence }}</td>
                  <td>
                    <span v-if="description">{{ description }}</span>
                    <span v-else class="text-muted"
                      >No description available</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br />
        <h4>Molecular Mechanism Synopsis</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Consequence</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="consequences in MolecularDescriptionData.mechanism_synopsis"
              >
                <tr
                  v-for="(description, consequence) in consequences"
                  :key="consequence"
                >
                  <td>{{ consequence }}</td>
                  <td>
                    <span v-if="description">{{ description }}</span>
                    <span v-else class="text-muted"
                      >No description available</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br />
        <h4>Variant Consequences</h4>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Consequence</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loop through each main category in VariantDescriptionData -->
              <tr
                v-for="(consequences, index) in Object.keys(
                  VariantDescriptionData
                )"
                :key="index"
              >
                <td>
                  <strong>{{ consequences }}</strong>
                  <table class="table mt-2">
                    <thead>
                      <tr>
                        <th>Variant Consequence</th>
                        <th>SO term</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="term in VariantDescriptionData[consequences]"
                        :key="term.accession"
                      >
                        <td>{{ term.term }}</td>
                        <td>
                          <a
                            :href="
                              'http://www.sequenceontology.org/browser/current_release/term/' +
                              term.accession
                            "
                            target="_blank"
                          >
                            {{ term.accession }}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
