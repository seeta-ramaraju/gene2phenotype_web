<script>
import { checkLogInAndAppendAuthHeaders } from "../utility/AuthenticationUtility.js";

export default {
  data() {
    return {
      isDataLoading: false,
      terminologyDescriptionData: null,
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

      fetch(`/gene2phenotype/api/attribs/description`, {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to fetch terminology information");
          }
        })
        .then((responseJson) => {
          this.isDataLoading = false;
          this.terminologyDescriptionData = responseJson;
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
        <h4>Mutation Consequence</h4>
        <div class="pt-3">
          <div
            v-for="consequences in terminologyDescriptionData.mutation_consequence"
          >
            <div v-for="(description, consequence) in consequences">
              <ul class="list-group">
                <li class="list-group-item" v-if="description">
                  {{ consequence }} : {{ description }}
                </li>
                <li class="list-group-item" v-else>
                  {{ consequence }} :
                  <text class="text-muted">No description available</text>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br />
        <h4>Mutation Consequence Flag</h4>
        <div class="pt-3">
          <div
            v-for="flags in terminologyDescriptionData.mutation_consequence_flag"
          >
            <div v-for="(description, flag) in flags">
              <ul class="list-group">
                <li class="list-group-item" v-if="description">
                  {{ flag }} : {{ description }}
                </li>
                <li class="list-group-item" v-else>
                  {{ flag }} :
                  <text class="text-muted">No description available</text>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br />
        <h4>Evidence Support</h4>
        <div class="pt-3">
          <div v-for="supports in terminologyDescriptionData.support">
            <div v-for="(description, support) in supports">
              <ul class="list-group">
                <li class="list-group-item" v-if="description">
                  {{ support }} : {{ description }}
                </li>
                <li class="list-group-item" v-else>
                  {{ support }} :
                  <text class="text-muted">No description available</text>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br />
        <h4>Inheritance type</h4>
        <div class="pt-3">
          <div v-for="types in terminologyDescriptionData.inheritance_type">
            <div v-for="(description, type) in types">
              <ul class="list-group">
                <li class="list-group-item" v-if="description">
                  {{ type }} : {{ description }}
                </li>
                <li class="list-group-item" v-else>
                  {{ type }} :
                  <text class="text-muted">No description available</text>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
