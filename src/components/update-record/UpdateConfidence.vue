<script>
import LoginErrorAlert from "../alert/LoginErrorAlert.vue";
import { ConfidenceAttribsOrder } from "../../utility/CurationConstants.js";
import {
  isUserLoggedIn,
  logOutUser,
  appendAuthenticationHeaders,
} from "../../utility/AuthenticationUtility";
import { UPDATE_CONFIDENCE_URL } from "../../utility/UrlConstants";

export default {
  props: {
    stableId: String,
    attributesData: Object,
    currentConfidence: String,
  },
  components: {
    LoginErrorAlert,
  },
  data() {
    return {
      confidence: this.currentConfidence,
      isLogInSessionExpired: false,
      isUpdateApiCallLoading: false,
      updateConfidenceErrorMsg: null,
      isUpdateConfidenceSuccess: false,
      updateConfidenceSuccessMsg: null,
    };
  },
  computed: {
    reorderedConfidenceCategoryList() {
      return this.attributesData.confidence_category.sort(
        (a, b) =>
          ConfidenceAttribsOrder.indexOf(a) - ConfidenceAttribsOrder.indexOf(b)
      );
    },
  },
  methods: {
    updateConfidence() {
      if (!isUserLoggedIn()) {
        logOutUser();
        this.isLogInSessionExpired = true;
        return;
      }

      this.updateConfidenceErrorMsg = this.updateConfidenceSuccessMsg = null;
      this.isUpdateConfidenceSuccess = false;
      this.isUpdateApiCallLoading = true;

      const requestBody = {
        confidence: this.confidence,
      };
      let responseStatus = null;
      let apiHeaders = appendAuthenticationHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      fetch(UPDATE_CONFIDENCE_URL.replace(":stableid", this.stableId), {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: apiHeaders,
      })
        .then((response) => {
          responseStatus = response.status;
          return response.json();
        })
        .then((responseJson) => {
          this.isUpdateApiCallLoading = false;
          if (responseStatus === 200) {
            this.isUpdateConfidenceSuccess = true;
            this.updateConfidenceSuccessMsg = responseJson.message;
          } else {
            let errorMsg =
              "Unable to update confidence. Please try again later.";
            if (responseJson.error) {
              errorMsg =
                "Unable to update confidence. Error: " + responseJson.error;
            }
            this.updateConfidenceErrorMsg = errorMsg;
            console.log(errorMsg);
          }
        })
        .catch((error) => {
          this.isUpdateApiCallLoading = false;
          this.updateConfidenceErrorMsg =
            "Unable to update confidence. Please try again later.";
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <div class="accordion py-1" id="update-confidence-section">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#update-confidence-section-body"
          aria-expanded="false"
          aria-controls="update-confidence-section-body"
        >
          Confidence
          <span
            class="badge rounded-pill text-bg-success mx-2"
            v-if="isUpdateConfidenceSuccess"
          >
            <i class="bi bi-check-circle-fill"></i> Updated
          </span>
        </button>
      </h2>
      <div
        id="update-confidence-section-body"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <div class="row g-3 p-2">
            <h5>Confidence</h5>
            <div
              class="d-flex justify-content-center"
              v-if="isUpdateApiCallLoading"
              style="margin-top: 122px; margin-bottom: 122px"
            >
              <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <div class="row pb-4 w-50">
                <label
                  for="update-confidence-level-input"
                  class="col-lg-2 col-form-label"
                >
                  Level<span class="text-danger">*</span>
                </label>
                <div class="col-lg-7">
                  <select
                    id="update-confidence-level-input"
                    class="form-select"
                    v-model="confidence"
                  >
                    <option
                      v-for="item in reorderedConfidenceCategoryList"
                      :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-primary"
                @click="updateConfidence"
              >
                <i class="bi bi-pencil-square"></i> Update confidence
              </button>
            </div>
            <div
              class="alert alert-danger mt-3"
              role="alert"
              v-if="updateConfidenceErrorMsg"
            >
              <div>
                <i class="bi bi-exclamation-circle-fill"></i>
                {{ updateConfidenceErrorMsg }}
              </div>
            </div>
            <div
              class="alert alert-success mt-3"
              role="alert"
              v-if="isUpdateConfidenceSuccess"
            >
              <div>
                <i class="bi bi-check-circle-fill"></i>
                {{ updateConfidenceSuccessMsg }}
              </div>
            </div>
            <LoginErrorAlert v-if="isLogInSessionExpired" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
