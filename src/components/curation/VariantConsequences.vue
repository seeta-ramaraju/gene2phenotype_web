<script>
import { getVariantConsequenceCssClass } from "../../utility/CurationUtility.js";
import { VariantConsequencesAttribs } from "../../utility/CurationConstants.js";
export default {
  props: {
    variantConsequences: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["updateVariantConsequences"],
  methods: {
    variantConsequencesInputHandler(key, inputValue) {
      let updatedVariantConsequences = { ...this.variantConsequences };
      updatedVariantConsequences[key] = inputValue;
      this.$emit("updateVariantConsequences", updatedVariantConsequences);
    },
    getVariantConsequenceCssClass,
  },
  data() {
    return {
      variantConsequencesAttribs: [...VariantConsequencesAttribs],
    };
  },
};
</script>
<template>
  <div class="row g-3 px-3 py-3">
    <div class="col-12">
      <h5>Variant Consequences<span class="text-danger">*</span></h5>
    </div>
    <div class="col-12">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>
              Altered protein for protein-coding genes or altered RNA level for
              non-protein coding genes
            </th>
            <th>Description</th>
            <th style="width: 140px">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in variantConsequencesAttribs" :key="item.inputKey">
            <td :class="getVariantConsequenceCssClass(item.hierarchyLevel)">
              <a
                class="text-decoration-none"
                v-if="item.accession"
                :href="`http://www.sequenceontology.org/browser/current_release/term/${item.accession}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.labelText }}
              </a>
              <span v-else>
                {{ item.labelText }}
              </span>
            </td>
            <td>
              <template v-if="item.description">
                {{ item.description }} <br />
                See table
                <a
                  class="text-decoration-none"
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11039201/figure/F2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >here</a
                >.
              </template>
            </td>
            <td>
              <select
                :id="`variant-consequence-input-source-${item.inputKey}`"
                class="form-select"
                :value="variantConsequences[item.inputKey]"
                :disabled="disabled"
                @input="
                  variantConsequencesInputHandler(
                    item.inputKey,
                    $event.target.value,
                  )
                "
              >
                >
                <option value="">Select</option>
                <option value="inferred">inferred</option>
                <option value="evidence">evidence</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
