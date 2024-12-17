<script>
import {
  ATTRIBS_DESCRIPTION_URL,
  MECHANISMS_URL,
  VARIANT_TYPES_URL,
} from "../utility/UrlConstants.js";
import { checkLogInAndAppendAuthHeaders } from "../utility/AuthenticationUtility.js";
import { CONFIDENCE_COLOR_MAP } from "../utility/Constants.js";
import {
  ConfidenceAttribsOrder,
  VariantConsequencesAttribs,
} from "../utility/CurationConstants.js";
export default {
  data() {
    return {
      isDataLoading: false,
      terminologyDescriptionData: null,
      molecularDescriptionData: null,
      variantDescriptionData: null,
      errorMsg: null,
      confidenceColorMap: { ...CONFIDENCE_COLOR_MAP },
      VariantConsequencesAttribs,
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
        fetch(ATTRIBS_DESCRIPTION_URL, {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(MECHANISMS_URL, {
          method: "GET",
          headers: apiHeaders,
        }),
        fetch(VARIANT_TYPES_URL, {
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
            molecularDescriptionData,
            variantDescriptionData,
          ] = responseJsonArr;
          this.isDataLoading = false;
          this.terminologyDescriptionData = terminologyDescriptionData;
          this.molecularDescriptionData = molecularDescriptionData;
          this.variantDescriptionData = variantDescriptionData;
        })
        .catch((error) => {
          this.isDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
    reorderedConfidenceCategoryList() {
      return this.terminologyDescriptionData.confidence_category.sort(
        (a, b) =>
          ConfidenceAttribsOrder.indexOf(Object.keys(a)[0]) -
          ConfidenceAttribsOrder.indexOf(Object.keys(b)[0])
      );
    },
  },
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <h2 class="pb-3">Terminology</h2>
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
      <section id="g2p-confidence">
        <h4>G2P Confidence Category</h4>
        <h6>GenCC confidence terms are used</h6>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in reorderedConfidenceCategoryList()"
                :key="item.index"
              >
                <td>
                  <span
                    v-if="Object.entries(item)[0][0]"
                    class="badge text-white"
                    :style="{
                      backgroundColor:
                        confidenceColorMap[
                          Object.entries(item)[0][0].toLowerCase()
                        ],
                    }"
                  >
                    {{ Object.entries(item)[0][0] }}
                  </span>
                </td>
                <td>
                  <span v-if="Object.entries(item)[0][1]">{{
                    Object.entries(item)[0][1]
                  }}</span>
                  <span v-else class="text-muted"
                    >No description available</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Operationally several groups use <b>definitive</b>,
            <b>strong</b> and <b>moderate</b> for clinical reporting.
          </p>
          <p>
            <b>Limited</b>, <b>disputed</b> and <b>refuted</b> are not used for
            clinical reporting.
          </p>
        </div>
      </section>
      <br />
      <section id="allelic-requirement">
        <h4>Allelic Requirement</h4>
        <h6>
          HPO Mode of inheritance terminology is used. G2P uses synonyms of the
          MOI terms as many of the disorders described are de novo.
        </h6>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Genotype</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in terminologyDescriptionData.genotype"
                :key="index"
              >
                <td>{{ Object.entries(item)[0][0] }}</td>
                <td>
                  <span v-if="Object.entries(item)[0][1]">{{
                    Object.entries(item)[0][1]
                  }}</span>
                  <span v-else class="text-muted"
                    >No description available</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <br />
      <section id="cross-cutting-modifier">
        <h4>Cross Cutting Modifier</h4>
        <h6>HPO inheriance qualifier terms are used where available</h6>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Modifier</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(
                  item, index
                ) in terminologyDescriptionData.cross_cutting_modifier"
                :key="index"
              >
                <td>{{ Object.entries(item)[0][0] }}</td>
                <td>
                  <span v-if="Object.entries(item)[0][1]">{{
                    Object.entries(item)[0][1]
                  }}</span>
                  <span v-else class="text-muted"
                    >No description available</span
                  >
                </td>
              </tr>
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
              <tr
                v-for="(item, index) in molecularDescriptionData.mechanism"
                :key="index"
              >
                <td>{{ Object.entries(item)[0][0] }}</td>
                <td>
                  <span v-if="Object.entries(item)[0][1]">{{
                    Object.entries(item)[0][1]
                  }}</span>
                  <span v-else class="text-muted"
                    >No description available</span
                  >
                </td>
              </tr>
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
              <tr
                v-for="(
                  item, index
                ) in molecularDescriptionData.mechanism_synopsis"
                :key="index"
              >
                <td>{{ Object.entries(item)[0][0] }}</td>
                <td>
                  <span v-if="Object.entries(item)[0][1]">{{
                    Object.entries(item)[0][1]
                  }}</span>
                  <span v-else class="text-muted"
                    >No description available</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <br />
      <section id="variant-consequence">
        <h4>Variant Consequence</h4>
        <h6>
          The consequence of the reported variants at the protein (for
          protein-coding genes) or the RNA (for non-protein coding genes), per
          allele.
        </h6>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Consequence</th>
                <th>Description in SO</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(term, index) in variantDescriptionData.other_variants"
                :key="term.accession"
              >
                <td
                  v-if="
                    VariantConsequencesAttribs.some(
                      (attr) => attr.inputKey === term.term.replace(/ /g, '_')
                    )
                  "
                >
                  {{ term.term }}
                </td>
                <td
                  v-if="
                    VariantConsequencesAttribs.some(
                      (attr) => attr.inputKey === term.term.replace(/ /g, '_')
                    )
                  "
                >
                  <a
                    :href="`http://www.sequenceontology.org/browser/current_release/term/${term.accession}`"
                    style="text-decoration: none"
                    target="_blank"
                  >
                    {{ term.accession }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section id="variant-types">
        <h4>Variant Types</h4>
        <h6>
          The types of variants associated with the curated gene-disease pair
          reported in the publication
        </h6>
        <div class="pt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Primary Type</th>
                <th>Variant Type</th>
                <th>Description in SO</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(consequences, index) in Object.keys(
                  variantDescriptionData
                )"
                :key="index"
              >
                <tr
                  v-for="(term, termIndex) in variantDescriptionData[
                    consequences
                  ]"
                  :key="term.accession"
                >
                  <td
                    v-if="termIndex === 0"
                    :rowspan="variantDescriptionData[consequences].length"
                  >
                    {{ consequences }}
                  </td>
                  <td
                    v-if="
                      !VariantConsequencesAttribs.some(
                        (attr) => attr.inputKey === term.term.replace(/ /g, '_')
                      )
                    "
                  >
                    {{ term.term }}
                  </td>
                  <td
                    v-if="
                      !VariantConsequencesAttribs.some(
                        (attr) => attr.inputKey === term.term.replace(/ /g, '_')
                      )
                    "
                  >
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
</template>
