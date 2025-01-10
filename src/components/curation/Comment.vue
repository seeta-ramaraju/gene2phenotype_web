<script>
export default {
  props: {
    privateComment: String,
    publicComment: String,
  },
  emits: ["update:privateComment", "update:publicComment"],
};
</script>
<template>
  <div class="row py-3 w-50">
    <label for="private-comment-input" class="col-lg-3 col-form-label">
      Private comment
    </label>
    <div class="col-lg-9">
      <textarea
        class="form-control"
        id="private-comment-input"
        rows="3"
        type="text"
        :value="privateComment"
        @input="$emit('update:privateComment', $event.target.value)"
      >
      </textarea>
    </div>
  </div>
  <div class="row pb-3 w-50">
    <label for="public-comment-input" class="col-lg-3 col-form-label">
      Public comment
    </label>
    <div class="col-lg-9">
      <textarea
        class="form-control"
        id="public-comment-input"
        rows="3"
        type="text"
        :value="publicComment"
        @input="$emit('update:publicComment', $event.target.value)"
      >
      </textarea>
    </div>
  </div>
</template>
