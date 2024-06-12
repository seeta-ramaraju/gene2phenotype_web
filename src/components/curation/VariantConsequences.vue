<script>
import { VariantConsequencesAttribs } from "../../utility/CurationConstants";
export default {
  props: {
    variantConsequences: Object,
  },
  emits: ["updateVariantConsequences"],
  methods: {
    variantConsequencesRadioBtnHandler(key, checked, value) {
      let updatedVariantConsequences = { ...this.variantConsequences };
      if (checked) {
        updatedVariantConsequences[key] = value;
      } else {
        updatedVariantConsequences[key] = "";
      }
      this.$emit("updateVariantConsequences", updatedVariantConsequences);
    },
    variantConsequenceCssClass(hierarchyLevel) {
      if (hierarchyLevel === 1) {
        return "text-start";
      } else if (hierarchyLevel === 2) {
        return "text-center";
      } else if (hierarchyLevel === 3) {
        return "text-end";
      }
      return "text-start";
    },
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
    <div class="col-12"><h5>Variant Consequences</h5></div>
    <div class="col-12">
      <table style="width: 70%" class="table table-bordered">
        <thead>
          <tr>
            <th style="width: 65%">
              Altered protein for protein-coding genes or altered RNA level for
              non-protein coding genes
            </th>
            <th>Inferred</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in variantConsequencesAttribs">
            <td :class="variantConsequenceCssClass(item.hierarchyLevel)">
              {{ item.labelText }}
            </td>
            <td>
              <div class="form-check">
                <input
                  type="radio"
                  :id="`variant-consequence-input-${item.inputKey}-inferred`"
                  :checked="variantConsequences[item.inputKey] === 'inferred'"
                  @input="
                    variantConsequencesRadioBtnHandler(
                      item.inputKey,
                      $event.target.checked,
                      'inferred'
                    )
                  "
                />
              </div>
            </td>
            <td>
              <div class="form-check">
                <input
                  type="radio"
                  :id="`variant-consequence-input-${item.inputKey}-evidence`"
                  :checked="variantConsequences[item.inputKey] === 'evidence'"
                  @input="
                    variantConsequencesRadioBtnHandler(
                      item.inputKey,
                      $event.target.checked,
                      'evidence'
                    )
                  "
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
