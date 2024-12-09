<script>
export default {
  props: {
    modalId: String,
    alertText: String,
  },
  emits: ["confirmClickHandler"],
};
</script>
<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    aria-labelledby="alert-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="alert-modal-label">
            <i class="bi bi-exclamation-triangle"></i> Caution
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row g-3 py-3">
            <p>{{ alertText }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="$emit('confirmClickHandler')"
            data-bs-dismiss="modal"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#alert-modal-label {
  color: red;
}
</style>
