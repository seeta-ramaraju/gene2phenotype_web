<script>
export default {
  props: {
    attributesData: {
      type: Object,
    },
    justification: String,
    level: String,
    inputPublications: Array,
  },
  emits: ["update:justification", "update:level"],
};
</script>
<template>
  <div class="accordion py-1" id="confidence-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#confidence-section-body"
          aria-expanded="false"
          aria-controls="confidence-section-body"
        >
          Confidence
        </button>
      </h2>
      <div id="confidence-section-body" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div class="row g-3">
            <div class="col-12">
              <strong><p class="mb-0">Summary</p></strong>
            </div>
            <div class="col-3">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th width="50%">Total Papers</th>
                    <td width="50%">{{ inputPublications.length }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Total Families</th>
                    <td width="50%">
                      {{
                        inputPublications.reduce(
                          (accumulator, currentValue) =>
                            currentValue.families
                              ? accumulator + currentValue.families
                              : accumulator,
                          0
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th width="50%">Total Cases</th>
                    <td width="50%">
                      {{
                        inputPublications.reduce(
                          (accumulator, currentValue) =>
                            currentValue.affectedIndividuals
                              ? accumulator + currentValue.affectedIndividuals
                              : accumulator,
                          0
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <div class="col-2">Total Papers</div>
            <div class="col-10">{{ inputPublications.length }}</div>
            <div class="col-2">Total Families</div>
            <div class="col-10">
              {{
                inputPublications.reduce(
                  (accumulator, currentValue) =>
                    currentValue.families
                      ? accumulator + currentValue.families
                      : accumulator,
                  0
                )
              }}
            </div>
            <div class="col-2">Total Cases</div>
            <div class="col-10">
              {{
                inputPublications.reduce(
                  (accumulator, currentValue) =>
                    currentValue.affectedIndividuals
                      ? accumulator + currentValue.affectedIndividuals
                      : accumulator,
                  0
                )
              }}
            </div> -->
          </div>

          <form>
            <strong><p class="mb-0 pt-3">Confidence</p></strong>
            <div class="row g-3 pt-4">
              <div class="col-1">
                <label for="justification-input" class="col-form-label">
                  Justification
                </label>
              </div>
              <div class="col-4">
                <textarea
                  class="form-control"
                  id="justification-input"
                  rows="3"
                  type="text"
                  :value="justification"
                  @input="$emit('update:justification', $event.target.value)"
                >
                </textarea>
              </div>
            </div>
            <div class="row g-3 py-3">
              <div class="col-1">
                <label for="inputPassword6" class="col-form-label">Level</label>
              </div>
              <div class="col-3">
                <select
                  id="inputState"
                  class="form-select"
                  :value="level"
                  @input="$emit('update:level', $event.target.value)"
                >
                  <option disabled value="">Select</option>
                  <option
                    v-for="item in attributesData.confidence_category"
                    :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
