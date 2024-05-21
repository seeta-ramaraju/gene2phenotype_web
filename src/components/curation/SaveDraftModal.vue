<script>
export default {
  props: {
    sessionname: String,
  },
  emits: ["update:sessionname", "savedraft"],
};
</script>
<template>
  <div
    class="modal fade"
    id="save-draft-modal"
    tabindex="-1"
    aria-labelledby="save-draft-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="save-draft-modal-label">
            Draft Submission
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
            <div class="col-3">
              <label for="session-name-input" class="col-form-label">
                Session Name (Optional)
              </label>
            </div>
            <div class="col">
              <input
                class="form-control"
                id="session-name-input"
                :value="sessionname"
                @input="$emit('update:sessionname', $event.target.value.trim())"
              />
            </div>
            <p>
              <i class="bi bi-info-circle"></i> If session name is not provided,
              an auto generated ID will be set as the session name.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i> Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('savedraft')"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-floppy-fill"></i> Save Draft
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
