<script>
export default {
  props: {
    publicationsData: {
      type: Object,
    },
  },
  emits: [
    "updateVariantTypes",
    "updateVariantDescriptions",
    "updateVariantConsequences",
  ],
  watch: {
    variantTypes: {
      handler(newVariantTypes) {
        let variantTypesArray = [];
        for (const [primaryType, primaryTypeValue] of Object.entries(
          newVariantTypes
        )) {
          for (const [secondaryType, secondaryTypeValue] of Object.entries(
            primaryTypeValue
          )) {
            let variantTypesObj = { ...secondaryTypeValue };
            variantTypesObj.primary_type = primaryType;
            variantTypesObj.secondary_type = secondaryType;
            variantTypesArray.push(variantTypesObj);
          }
        }
        this.$emit("updateVariantTypes", variantTypesArray);
      },
      deep: true,
    },
    variantConsequences: {
      handler(newVariantConsequences) {
        let variantConsequencesArray = [];
        for (const [key, value] of Object.entries(newVariantConsequences)) {
          let variantConsequencesObj = {
            name: key,
            support: value,
          };
          variantConsequencesArray.push(variantConsequencesObj);
        }
        this.$emit("updateVariantConsequences", variantConsequencesArray);
      },
      deep: true,
    },
    publicationsData(newPublicationsData) {
      if (newPublicationsData && newPublicationsData.results) {
        let newVariantDescriptions = {};
        newPublicationsData.results.forEach((item) => {
          newVariantDescriptions[item.pmid] = {
            description: "",
          };
        });
        this.variantDescriptions = newVariantDescriptions;
      }
    },
    variantDescriptions: {
      handler(newVariantDescriptions) {
        let variantDescriptionsArray = [];
        for (const [key, value] of Object.entries(newVariantDescriptions)) {
          let variantDescriptionsObj = { ...value };
          variantDescriptionsObj.pmid = key;
          variantDescriptionsArray.push(variantDescriptionsObj);
        }
        this.$emit("updateVariantDescriptions", variantDescriptionsArray);
      },
      deep: true,
    },
  },
  data() {
    return {
      variantTypes: {
        protein_changing: {
          frameshift_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          stop_gained: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          missense_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          inframe_insertion: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          inframe_deletion: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
        },
        splice_variants: {
          splice_region_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          splice_acceptor_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          splice_donor_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
        },
        regulatory_variants: {
          five_prime_UTR_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          three_prime_UTR_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          regulatory_region_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
        },
        other_variants: {
          intergenic_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          intron_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          synonymous_variant: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          stop_loss: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          whole_partial_gene_deletion: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          whole_partial_gene_duplication: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          short_tandem_repeat_change: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          start_lost: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
          ncRNA: {
            nmd_escape: false,
            de_novo: false,
            inherited: false,
            unknown_inheritence: false,
            supporting_papers: [],
            comment: "",
          },
        },
      },
      variantDescriptions: {},
      variantConsequences: {
        altered_gene_product_level: "",
        decreased_gene_product_level: "",
        absent_gene_product_level: "",
        increased_gene_product_level: "",
        altered_gene_product_structure: "",
        uncertain: "",
      },
    };
  },
};
</script>
<template>
  <div class="accordion py-1" id="variant-info-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#variant-info-section-body"
          aria-expanded="false"
          aria-controls="variant-info-section-body"
        >
          Variant Information
        </button>
      </h2>
      <div id="variant-info-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <form>
            <div class="row g-3 px-3 pt-3">
              <div class="col-12"><h5>Variant Types</h5></div>
              <div
                class="col-12"
                v-if="
                  !(
                    publicationsData &&
                    publicationsData.results &&
                    publicationsData.results.length > 0
                  )
                "
              >
                <p>
                  <i class="bi bi-info-circle"></i> Please enter Publication(s)
                  to select supporting papers for Variant Types.
                </p>
              </div>
              <div class="col-12">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 20%">Types</th>
                      <th style="width: 15%"></th>
                      <th style="width: 10%">De Novo</th>
                      <th style="width: 10%">Inherited</th>
                      <th style="width: 10%">Unknown Inheritance</th>
                      <th
                        style="width: 15%"
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        Supporting Papers
                      </th>
                      <th style="width: 35%">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Protein changing</strong></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      ></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>frameshift_variant</td>
                      <td>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="frameshift_variant-nmd_escape-input"
                            v-model="
                              variantTypes.protein_changing.frameshift_variant
                                .nmd_escape
                            "
                          />
                          <label
                            class="form-check-label"
                            for="frameshift_variant-nmd_escape-input"
                          >
                            NMD_escape
                          </label>
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="frameshift_variant-de_novo-input"
                            v-model="
                              variantTypes.protein_changing.frameshift_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="frameshift_variant-inherited-input"
                            v-model="
                              variantTypes.protein_changing.frameshift_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="frameshift_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.protein_changing.frameshift_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`frameshift_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.protein_changing.frameshift_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`frameshift_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="frameshift_variant-comment-input"
                          rows="2"
                          v-model.trim="
                            variantTypes.protein_changing.frameshift_variant
                              .comment
                          "
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>stop_gained</td>
                      <td>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="stop_gained-nmd_escape-input"
                            v-model="
                              variantTypes.protein_changing.stop_gained
                                .nmd_escape
                            "
                          />
                          <label
                            class="form-check-label"
                            for="stop_gained-nmd_escape-input"
                          >
                            NMD_escape
                          </label>
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_gained-de_novo-input"
                            v-model="
                              variantTypes.protein_changing.stop_gained.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_gained-inherited-input"
                            v-model="
                              variantTypes.protein_changing.stop_gained
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_gained-unknown_inheritence-input"
                            v-model="
                              variantTypes.protein_changing.stop_gained
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`stop_gained-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.protein_changing.stop_gained
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`stop_gained-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="stop_gained-comment-input"
                          rows="2"
                          v-model.trim="
                            variantTypes.protein_changing.stop_gained.comment
                          "
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>missense_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="missense_variant-de_novo-input"
                            v-model="
                              variantTypes.protein_changing.missense_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="missense_variant-inherited-input"
                            v-model="
                              variantTypes.protein_changing.missense_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="missense_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.protein_changing.missense_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`missense_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.protein_changing.missense_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`missense_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="missense_variant-comment-input"
                          v-model.trim="
                            variantTypes.protein_changing.missense_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>inframe_insertion</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_insertion-de_novo-input"
                            v-model="
                              variantTypes.protein_changing.inframe_insertion
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_insertion-inherited-input"
                            v-model="
                              variantTypes.protein_changing.inframe_insertion
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_insertion-unknown_inheritence-input"
                            v-model="
                              variantTypes.protein_changing.inframe_insertion
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`inframe_insertion-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.protein_changing.inframe_insertion
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`inframe_insertion-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="inframe_insertion-comment-input"
                          v-model.trim="
                            variantTypes.protein_changing.inframe_insertion
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>inframe_deletion</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_deletion-de_novo-input"
                            v-model="
                              variantTypes.protein_changing.inframe_deletion
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_deletion-inherited-input"
                            v-model="
                              variantTypes.protein_changing.inframe_deletion
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="inframe_deletion-unknown_inheritence-input"
                            v-model="
                              variantTypes.protein_changing.inframe_deletion
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`inframe_deletion-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.protein_changing.inframe_deletion
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`inframe_deletion-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="inframe_deletion-comment-input"
                          v-model.trim="
                            variantTypes.protein_changing.inframe_deletion
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Splice variants</strong></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      ></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>splice_region_variant</td>
                      <td>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="
                              variantTypes.splice_variants.splice_region_variant
                                .nmd_escape
                            "
                            id="splice_region_variant-nmd_escape-input"
                          />
                          <label
                            class="form-check-label"
                            for="splice_region_variant-nmd_escape-input"
                          >
                            NMD_escape
                          </label>
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_region_variant-de_novo-input"
                            v-model="
                              variantTypes.splice_variants.splice_region_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_region_variant-inherited-input"
                            v-model="
                              variantTypes.splice_variants.splice_region_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_region_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.splice_variants.splice_region_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`splice_region_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.splice_variants.splice_region_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`splice_region_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="splice_region_variant-comment-input"
                          v-model.trim="
                            variantTypes.splice_variants.splice_region_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>splice_acceptor_variant</td>
                      <td>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="
                              variantTypes.splice_variants
                                .splice_acceptor_variant.nmd_escape
                            "
                            id="splice_acceptor_variant-nmd_escape-input"
                          />
                          <label
                            class="form-check-label"
                            for="splice_acceptor_variant-nmd_escape-input"
                          >
                            NMD_escape
                          </label>
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_acceptor_variant-de_novo-input"
                            v-model="
                              variantTypes.splice_variants
                                .splice_acceptor_variant.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_acceptor_variant-inherited-input"
                            v-model="
                              variantTypes.splice_variants
                                .splice_acceptor_variant.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_acceptor_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.splice_variants
                                .splice_acceptor_variant.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`splice_acceptor_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.splice_variants
                                .splice_acceptor_variant.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`splice_acceptor_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="splice_acceptor_variant-comment-input"
                          v-model.trim="
                            variantTypes.splice_variants.splice_acceptor_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>splice_donor_variant</td>
                      <td>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="
                              variantTypes.splice_variants.splice_donor_variant
                                .nmd_escape
                            "
                            id="splice_donor_variant-nmd_escape-input"
                          />
                          <label
                            class="form-check-label"
                            for="flexRadioDefault1"
                          >
                            NMD_escape
                          </label>
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_donor_variant-de_novo-input"
                            v-model="
                              variantTypes.splice_variants.splice_donor_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_donor_variant-inherited-input"
                            v-model="
                              variantTypes.splice_variants.splice_donor_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="splice_donor_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.splice_variants.splice_donor_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`splice_donor_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.splice_variants.splice_donor_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`splice_donor_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="splice_donor_variant-comment-input"
                          v-model.trim="
                            variantTypes.splice_variants.splice_donor_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Regulatory variants</strong></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      ></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5_prime_UTR_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="five_prime_UTR_variant-de_novo-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .five_prime_UTR_variant.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="five_prime_UTR_variant-inherited-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .five_prime_UTR_variant.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="five_prime_UTR_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .five_prime_UTR_variant.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`five_prime_UTR_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.regulatory_variants
                                .five_prime_UTR_variant.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`five_prime_UTR_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="five_prime_UTR_variant-comment-input"
                          v-model.trim="
                            variantTypes.regulatory_variants
                              .five_prime_UTR_variant.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>3_prime_UTR_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="three_prime_UTR_variant-de_novo-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .three_prime_UTR_variant.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="three_prime_UTR_variant-inherited-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .three_prime_UTR_variant.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="three_prime_UTR_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .three_prime_UTR_variant.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`three_prime_UTR_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.regulatory_variants
                                .three_prime_UTR_variant.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`three_prime_UTR_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="three_prime_UTR_variant-comment-input"
                          v-model.trim="
                            variantTypes.regulatory_variants
                              .three_prime_UTR_variant.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>regulatory_region_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="regulatory_region_variant-de_novo-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .regulatory_region_variant.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="regulatory_region_variant-inherited-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .regulatory_region_variant.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="regulatory_region_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.regulatory_variants
                                .regulatory_region_variant.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`regulatory_region_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.regulatory_variants
                                .regulatory_region_variant.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`regulatory_region_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="regulatory_region_variant-comment-input"
                          v-model.trim="
                            variantTypes.regulatory_variants
                              .regulatory_region_variant.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Other variants</strong></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      ></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>intergenic_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intergenic_variant-de_novo-input"
                            v-model="
                              variantTypes.other_variants.intergenic_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intergenic_variant-inherited-input"
                            v-model="
                              variantTypes.other_variants.intergenic_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intergenic_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.intergenic_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`intergenic_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.intergenic_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`intergenic_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="intergenic_variant-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.intergenic_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>intron_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intron_variant-de_novo-input"
                            v-model="
                              variantTypes.other_variants.intron_variant.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intron_variant-inherited-input"
                            v-model="
                              variantTypes.other_variants.intron_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="intron_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.intron_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`intron_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.intron_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`intron_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="intron_variant-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.intron_variant.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>synonymous_variant</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="synonymous_variant-de_novo-input"
                            v-model="
                              variantTypes.other_variants.synonymous_variant
                                .de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="synonymous_variant-inherited-input"
                            v-model="
                              variantTypes.other_variants.synonymous_variant
                                .inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="synonymous_variant-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.synonymous_variant
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`synonymous_variant-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.synonymous_variant
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`synonymous_variant-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="synonymous_variant-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.synonymous_variant
                              .comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>Stop loss</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_loss-de_novo-input"
                            v-model="
                              variantTypes.other_variants.stop_loss.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_loss-inherited-input"
                            v-model="
                              variantTypes.other_variants.stop_loss.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="stop_loss-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.stop_loss
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`stop_loss-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.stop_loss
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`stop_loss-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="stop_loss-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.stop_loss.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>Whole/partial gene deletion</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_deletion-de_novo-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_deletion.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_deletion-inherited-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_deletion.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_deletion-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_deletion.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`whole_partial_gene_deletion-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_deletion.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`whole_partial_gene_deletion-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="whole_partial_gene_deletion-comment-input"
                          v-model.trim="
                            variantTypes.other_variants
                              .whole_partial_gene_deletion.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>Whole/partial gene duplication</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_duplication-de_novo-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_duplication.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_duplication-inherited-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_duplication.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="whole_partial_gene_duplication-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_duplication
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`whole_partial_gene_duplication-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants
                                .whole_partial_gene_duplication
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`whole_partial_gene_duplication-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="whole_partial_gene_duplication-comment-input"
                          v-model.trim="
                            variantTypes.other_variants
                              .whole_partial_gene_duplication.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>short_tandem_repeat_change</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="short_tandem_repeat_change-de_novo-input"
                            v-model="
                              variantTypes.other_variants
                                .short_tandem_repeat_change.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="short_tandem_repeat_change-inherited-input"
                            v-model="
                              variantTypes.other_variants
                                .short_tandem_repeat_change.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="short_tandem_repeat_change-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants
                                .short_tandem_repeat_change.unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`short_tandem_repeat_change-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants
                                .short_tandem_repeat_change.supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`short_tandem_repeat_change-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="short_tandem_repeat_change-comment-input"
                          v-model.trim="
                            variantTypes.other_variants
                              .short_tandem_repeat_change.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>start_lost</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="start_lost-de_novo-input"
                            v-model="
                              variantTypes.other_variants.start_lost.de_novo
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="start_lost-inherited-input"
                            v-model="
                              variantTypes.other_variants.start_lost.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="start_lost-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.start_lost
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`start_lost-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.start_lost
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`start_lost-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="start_lost-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.start_lost.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>ncRNA</td>
                      <td></td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="ncRNA-de_novo-input"
                            v-model="variantTypes.other_variants.ncRNA.de_novo"
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="ncRNA-inherited-input"
                            v-model="
                              variantTypes.other_variants.ncRNA.inherited
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="ncRNA-unknown_inheritence-input"
                            v-model="
                              variantTypes.other_variants.ncRNA
                                .unknown_inheritence
                            "
                          />
                        </div>
                      </td>
                      <td
                        v-if="
                          publicationsData &&
                          publicationsData.results &&
                          publicationsData.results.length > 0
                        "
                      >
                        <div
                          class="form-check"
                          v-for="(item, index) in publicationsData.results"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`ncRNA-supporting_papers-input-${index}`"
                            :value="item.pmid"
                            v-model="
                              variantTypes.other_variants.ncRNA
                                .supporting_papers
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="`ncRNA-supporting_papers-input-${index}`"
                          >
                            {{ item.pmid }}
                          </label>
                        </div>
                      </td>
                      <td>
                        <textarea
                          class="form-control"
                          id="ncRNA-comment-input"
                          v-model.trim="
                            variantTypes.other_variants.ncRNA.comment
                          "
                          rows="2"
                        >
                        </textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              v-if="
                publicationsData &&
                publicationsData.results &&
                publicationsData.results.length > 0
              "
            >
              <div class="row g-3 px-3 pt-3">
                <div class="col-12"><h5>Variant Description</h5></div>
              </div>
              <div
                class="row g-3 px-3 py-3"
                v-for="(item, index) in publicationsData.results"
              >
                <div class="col-12">
                  <strong>
                    <p class="mb-0">Publication (PMID: {{ item.pmid }})</p>
                  </strong>
                </div>
                <div class="col-auto">
                  <label
                    :for="`variant-description-input-${index}`"
                    class="col-form-label"
                  >
                    Description (HGVS)
                  </label>
                </div>
                <div class="col-6">
                  <input
                    class="form-control"
                    :id="`variant-description-input-${index}`"
                    v-model.trim="variantDescriptions[item.pmid].description"
                    placeholder="Eg. ENST00000641515:c.4A>C"
                  />
                  <div class="form-text" id="publications-input-help-text">
                    Please follow
                    <a
                      href="https://hgvs-nomenclature.org/stable/"
                      target="_blank"
                      style="text-decoration: none"
                    >
                      HGVS Nomenclature
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="row g-3 px-3 pt-3">
              <div class="col-12">
                <p>
                  <i class="bi bi-info-circle"></i> Please enter Publication(s)
                  to fill Variant Description section.
                </p>
              </div>
            </div>
            <div class="row g-3 px-3 py-3">
              <div class="col-12"><h5>Variant Consequences</h5></div>
              <div class="col-12">
                <table style="width: 70%" class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 65%">
                        Altered protein for protein-coding genes or altered RNA
                        level for non-protein coding genes
                      </th>
                      <th>Inferred</th>
                      <th>Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Altered_gene_product_level SO:0002314</td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="altered_gene_product_level-input-inferred"
                            value="inferred"
                            v-model="
                              variantConsequences.altered_gene_product_level
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="altered_gene_product_level-input-evidence"
                            value="evidence"
                            v-model="
                              variantConsequences.altered_gene_product_level
                            "
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">
                        Decreased_gene_product_level SO:0002316
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="decreased_gene_product_level-input-inferred"
                            value="inferred"
                            v-model="
                              variantConsequences.decreased_gene_product_level
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="decreased_gene_product_level-input-evidence"
                            value="evidence"
                            v-model="
                              variantConsequences.decreased_gene_product_level
                            "
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-end">
                        Absent_gene_product_level SO:0002317
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="absent_gene_product_level-input-inferred"
                            value="inferred"
                            v-model="
                              variantConsequences.absent_gene_product_level
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="absent_gene_product_level-input-evidence"
                            value="evidence"
                            v-model="
                              variantConsequences.absent_gene_product_level
                            "
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">
                        Increased_gene_product_level SO:0002315
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="increased_gene_product_level-input-inferred"
                            value="inferred"
                            v-model="
                              variantConsequences.increased_gene_product_level
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="increased_gene_product_level-input-evidence"
                            value="evidence"
                            v-model="
                              variantConsequences.increased_gene_product_level
                            "
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Altered_gene_product_structure SO:0002318</td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="altered_gene_product_structure-input-inferred"
                            value="inferred"
                            v-model="
                              variantConsequences.altered_gene_product_structure
                            "
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="altered_gene_product_structure-input-evidence"
                            value="evidence"
                            v-model="
                              variantConsequences.altered_gene_product_structure
                            "
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Uncertain</td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="uncertain-input-inferred"
                            value="inferred"
                            v-model="variantConsequences.uncertain"
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check">
                          <input
                            type="radio"
                            id="uncertain-input-evidence"
                            value="evidence"
                            v-model="variantConsequences.uncertain"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
