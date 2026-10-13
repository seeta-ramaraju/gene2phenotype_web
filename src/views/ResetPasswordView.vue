<script>
import api from "../services/api.js";
import { useAuthStore } from "../store/auth.js";
import { RESET_PASSWORD_URL } from "../utility/UrlConstants.js";
import { fetchAndLogApiResponseErrorListMsg } from "../utility/ErrorUtility.js";

export default {
  data() {
    return {
      errorMsg: null,
      isSubmitting: false,
      newPassword: "",
      newPasswordRepeat: "",
      arePasswordsVisible: false,
      isResetSuccess: false,
    };
  },
  methods: {
    resetPassword() {
      if (this.isSubmitting) return;

      this.errorMsg = null;

      if (this.newPassword !== this.newPasswordRepeat) {
        this.errorMsg = "Passwords do not match.";
        return;
      }

      this.isSubmitting = true;
      this.isResetSuccess = false;
      const requestBody = {
        password: this.newPassword,
        password2: this.newPasswordRepeat,
      };
      api
        .post(
          RESET_PASSWORD_URL.replace(":uid", this.$route.params.uid).replace(
            ":token",
            this.$route.params.token,
          ),
          requestBody,
          {
            _skipAuthRefresh: true,
            _skipAuthRedirect: true,
          },
        )
        .then(() => {
          const authStore = useAuthStore();
          authStore.logout();
          this.newPassword = "";
          this.newPasswordRepeat = "";
          this.arePasswordsVisible = false;
          this.isResetSuccess = true;
        })
        .catch((error) => {
          const apiError = error.response?.data?.error;
          const apiErrors = Array.isArray(apiError)
            ? apiError
            : apiError
              ? [apiError]
              : [];
          this.errorMsg = fetchAndLogApiResponseErrorListMsg(
            error,
            apiErrors,
            "Unable to reset password. Please check your credentials or try again later.",
          );
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>
<template>
  <div class="container px-5 py-5" style="min-height: 60vh">
    <div v-if="isResetSuccess" class="alert alert-success mt-3" role="alert">
      <div>
        <i class="bi bi-check-circle-fill"></i>
        Password reset successful. Please
        <router-link to="/login">log in</router-link>.
      </div>
    </div>
    <div v-else class="form-signin w-100 m-auto">
      <form @submit.prevent="resetPassword">
        <h1 class="h3 mb-3 fw-normal">Reset password</h1>
        <div class="form-floating">
          <input
            :type="arePasswordsVisible ? 'text' : 'password'"
            class="form-control"
            id="input-new-password"
            placeholder="New Password"
            v-model="newPassword"
            :disabled="isSubmitting"
            @input="errorMsg = null"
            required
            minlength="8"
            autocomplete="new-password"
            aria-describedby="password-help"
          />
          <label for="input-new-password">New Password</label>
        </div>
        <div class="form-floating">
          <input
            :type="arePasswordsVisible ? 'text' : 'password'"
            class="form-control"
            id="input-new-password-repeat"
            placeholder="Repeat New Password"
            v-model="newPasswordRepeat"
            :disabled="isSubmitting"
            @input="errorMsg = null"
            required
            minlength="8"
            autocomplete="new-password"
            aria-describedby="password-help"
          />
          <label for="input-new-password-repeat">Repeat New Password</label>
        </div>
        <div
          id="password-help"
          class="form-text border rounded bg-light p-3 mb-2"
          role="note"
        >
          <div class="fw-semibold text-body mb-1">Password requirements</div>
          <ul class="mb-0 ps-3">
            <li>At least 8 characters</li>
            <li>Not too similar to your name, username, or email</li>
            <li>Not a commonly used password</li>
            <li>Not entirely numeric</li>
            <li>Matches the confirmation password</li>
          </ul>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            id="show-password"
            v-model="arePasswordsVisible"
            type="checkbox"
            :disabled="isSubmitting"
          />
          <label class="form-check-label" for="show-password">
            Show passwords
          </label>
        </div>
        <button
          class="btn btn-primary w-100 mt-2"
          type="submit"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          {{ isSubmitting ? "Resetting password…" : "Submit" }}
        </button>
      </form>
      <div v-if="errorMsg" class="alert alert-danger mt-3" role="alert">
        <div><i class="bi bi-exclamation-circle-fill"></i> {{ errorMsg }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.form-signin {
  max-width: 350px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

#input-new-password {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

#input-new-password-repeat {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
