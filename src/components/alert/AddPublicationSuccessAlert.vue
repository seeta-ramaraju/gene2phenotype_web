<script>
export default {
  props: {
    stableId: String,
    successMsg: String,
  },
  methods: {
    refreshPage() {
      this.$router.go(); // refresh current page
    },
    goToRecordPage() {
      this.$router.push(`/lgd/${this.stableId}`);
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
    <p>{{ successMsg }}</p>
    <hr />
    <div class="d-flex justify-content-between">
      <router-link :to="`/lgd/${stableId}`" class="btn btn-primary me-3">
        View record page
      </router-link>
      <button class="btn btn-primary" @click="refreshPage">
        Add more Publication(s)
      </button>
    </div>
  </div>
</template>
