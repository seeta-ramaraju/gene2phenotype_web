<script>
export default {
  methods: {
    refreshCurrentPage() {
      this.$router.go(); // Reloads current route
    },
  },
};
</script>
<template>
  <div
    class="alert alert-success mx-auto col-6"
    style="margin-top: 50px"
    role="alert"
  >
    <h4 class="alert-heading">
      <i
        class="bi bi-check-circle-fill"
        style="color: green; margin-right: 10px"
      >
      </i>
      Success
    </h4>
    <p>Curation Entry saved as draft.</p>
    <hr />
    <div class="d-flex justify-content-between">
      <router-link to="/curation/entries" class="btn btn-primary me-3">
        View All Saved Drafts
      </router-link>
      <button class="btn btn-primary" @click="refreshCurrentPage">
        Add Another G2P Record
      </button>
    </div>
  </div>
</template>
