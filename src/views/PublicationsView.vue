<script>
export default {
  data() {
    return {
      gene2phenotype: "/gene2phenotype/",
      gene2phenotype_article: "https://doi.org/10.1038/s41467-019-10016-3",
      curation: "https://doi.org/10.1186/s13073-024-01398-1",
      eye: "https://doi.org/10.1136/jmg-2022-108618",
      gene_validity: "https://doi.org/10.1186/s13073-023-01246-8",
    };
  },
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <h2>Publications</h2>
    <h4 class="pb-2">Citing G2P</h4>
    <h6 class="pb-2">
      If you have used Gene2Phenotype in your work, please cite the
      <a
        v-bind:href="gene2phenotype"
        style="text-decoration: none"
        target="_blank"
      >
        website
      </a>
      with date accessed and below article.
    </h6>
    <a
      v-bind:href="gene2phenotype_article"
      style="text-decoration: none"
      target="_blank"
    >
      <h6>
        Flexible and scalable diagnostic filtering of genomic variants using G2P
        with Ensembl VEP.
      </h6>
    </a>
    <div class="pb-2 citation-div">
      <p>
        Thormann, A., Halachev, M., McLaren, W. et al. Flexible and scalable
        diagnostic filtering of genomic variants using G2P with Ensembl VEP. Nat
        Commun 10, 2373 (2019). https://doi.org/10.1038/s41467-019-10016-3
      </p>
    </div>
    <h4 class="pb-2">Additional G2P Publications</h4>
    <a v-bind:href="curation" style="text-decoration: none" target="_blank">
      <h6>Curating genomic disease-gene relationships with Gene2Phenotype (G2P).</h6>
    </a>
    <div class="pb-2 citation-div">
      <p>
        T Michael Yates, Morad Ansari, Louise Thompson, Sarah E Hunt, Elena
        Cibrian Uhalte, Rachel J Hobson, Joseph A Marsh, Caroline F Wright,
        Helen V Firth. Curating genomic disease-gene relationships with
        Gene2Phenotype (G2P). Genome Med 16, 127 (2024).
        https://doi.org/10.1186/s13073-024-01398-1.
      </p>
    </div>
    <a v-bind:href="eye" style="text-decoration: none" target="_blank">
      <h6>
        EyeG2P: an automated variant filtering approach improves efficiency of
        diagnostic genomic testing for inherited ophthalmic disorders.
      </h6>
    </a>
    <div class="pb-2 citation-div">
      <p>
        Lenassi E, Carvalho A, Thormann A, et al. EyeG2P: an automated variant
        filtering approach improves efficiency of diagnostic genomic testing for
        inherited ophthalmic disordersJournal of Medical Genetics
        2023;60:810-818.
      </p>
    </div>
    <a
      v-bind:href="gene_validity"
      style="text-decoration: none"
      target="_blank"
    >
      <h6>
        Beyond gene-disease validity: capturing structured data on inheritance,
        allelic-requirement, disease-relevant variant classes, and disease
        mechanism for inherited cardiac conditions.
      </h6>
    </a>
    <div class="pb-2 citation-div">
      <p>
        Josephs, K.S., Roberts, A.M., Theotokis, P. et al. Beyond gene-disease
        validity: capturing structured data on inheritance, allelic requirement,
        disease-relevant variant classes, and disease mechanism for inherited
        cardiac conditions. Genome Med 15, 86 (2023).
        https://doi.org/10.1186/s13073-023-01246-8
      </p>
    </div>
  </div>
</template>
<style scoped>
.citation-div {
  margin: 0;
}

.citation-div p {
  padding: 15px;
  background: #eee;
  border-radius: 5px;
}
</style>
