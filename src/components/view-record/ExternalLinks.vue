<script>
import {
  DECIPHER_URL,
  ENSEMBL_GENE_URL,
  HGNC_URL,
  OMIM_URL,
} from "../../utility/UrlConstants.js";
export default {
  props: {
    geneSymbol: String,
    omimId: String,
    ensemblId: String,
    hgncId: String,
  },
  data() {
    return {
      DECIPHER_URL,
      OMIM_URL,
      ENSEMBL_GENE_URL,
      HGNC_URL,
    };
  },
};
</script>
<template>
  <table class="table table-bordered mb-0">
    <thead>
      <tr>
        <th>DECIPHER</th>
        <th>OMIM</th>
        <th>Ensembl ID</th>
        <th>HGNC ID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a
            class="text-decoration-none"
            v-if="geneSymbol"
            :href="DECIPHER_URL + geneSymbol"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ geneSymbol }}
          </a>
          <p v-else class="text-muted">Not Available</p>
        </td>
        <td>
          <a
            class="text-decoration-none"
            v-if="omimId"
            :href="OMIM_URL + omimId"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ omimId }}
          </a>
          <p v-else class="text-muted">Not Available</p>
        </td>
        <td>
          <a
            class="text-decoration-none"
            v-if="ensemblId"
            :href="ENSEMBL_GENE_URL + ensemblId"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ ensemblId }}
          </a>
          <p v-else class="text-muted">Not Available</p>
        </td>
        <td>
          <a
            class="text-decoration-none"
            v-if="hgncId"
            :href="HGNC_URL + hgncId"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ hgncId }}
          </a>
          <p v-else class="text-muted">Not Available</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
