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
  <div class="container-fluid d-flex">
    <div>
      <div class="p-3 bg-light border-end" style="min-width: 200px">
        <h5 class="text-dark fw-bold">G2P terminologies</h5>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link text-dark" href="#g2p-confidence"
              >G2P Confidence Category</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#allelic-requirement"
              >Allelic Requirement</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#cross-cutting-modifier"
              >Cross Cutting Modifier</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#molecular-mechanism"
              >Molecular Mechanism</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#mechanism-synopsis"
              >Molecular Mechanism Synopsis</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#variant-consequences"
              >Variant Consequences</a
            >
          </li>
        </ul>
      </div>
    </div>

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
          <section id="g2p-confidence">
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
          </section>
          <br />
          <section id="allelic-requirement">
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
          </section>
          <br />
          <section id="cross-cutting-modifier">
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
          </section>
          <br />
          <section id="molecular-mechanism">
            <h4>Molecular Mechanism</h4>
            <div class="pt-3">
              <table class="table">
                <thead>
                  <tr>
                    <th>Molecular Mechanism</th>
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
          </section>
          <br />
          <section id="mechanism-synopsis">
            <h4>Molecular Mechanism Synopsis</h4>
            <div class="pt-3">
              <table class="table">
                <thead>
                  <tr>
                    <th>Molecular Mechanism Synopsis</th>
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
          </section>
          <br />
          <section id="variant-consequences">
            <h4>Variant Consequences</h4>
            <div class="pt-3">
              <table class="table">
                <thead>
                  <tr>
                    <th>Primary Consequence</th>
                    <th>Variant Consequence</th>
                    <th>Description in SO</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Loop through each main category in VariantDescriptionData -->
                  <template
                    v-for="(consequences, index) in Object.keys(
                      VariantDescriptionData
                    )"
                    :key="index"
                  >
                    <!-- Row for the first term in each category with Primary Consequence in the first column -->
                    <tr
                      v-for="(term, termIndex) in VariantDescriptionData[
                        consequences
                      ]"
                      :key="term.accession"
                    >
                      <td
                        v-if="termIndex === 0"
                        :rowspan="VariantDescriptionData[consequences].length"
                      >
                        {{ consequences }}
                      </td>
                      <td>{{ term.term }}</td>
                      <td>
                        <a
                          :href="`http://www.sequenceontology.org/browser/current_release/term/${term.accession}`"
                          style="text-decoration: none"
                          target="_blank"
                        >
                          {{ term.accession }}
                        </a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
