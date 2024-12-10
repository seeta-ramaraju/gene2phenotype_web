<script>
export default {
  props: {
    errorMsg: String,
    stableId: String,
  },
  methods: {
    redirectToAddG2pPage() {
      if (this.$route.name === "add-g2p-record") {
        // If user is on add g2p record page then reload current page
        this.$router.go();
      } else if (this.$route.name === "update-g2p-record-draft") {
        // If user is on update g2p record draft page then redirect to add g2p record page
        this.$router.push("/lgd/add");
      }
    },
    redirectToUpdateG2pDraftPage() {
      if (this.$route.name === "update-g2p-record-draft") {
        // If user is on update g2p record draft page then reload current page
        this.$router.go();
      } else if (this.$route.name === "add-g2p-record") {
        // If user is on add g2p record page then redirect to update g2p record draft page
        this.$router.push(`/lgd/update-draft/${this.stableId}`);
      }
    },
  },
};
</script>
<template>
  <div
    class="alert alert-danger mx-auto col-6"
    style="margin-top: 50px"
    role="alert"
  >
    <p>{{ errorMsg }}</p>
    <hr />
    <div class="d-flex justify-content-between">
      <button
        class="btn btn-primary me-3"
        @click="redirectToUpdateG2pDraftPage"
      >
        Update Current Record Draft
      </button>
      <button class="btn btn-primary" @click="redirectToAddG2pPage">
        Add Another G2P Record
      </button>
    </div>
  </div>
</template>
