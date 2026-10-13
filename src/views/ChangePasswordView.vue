<script>
import api from "../services/api.js";
import { SESSION_END_REASON, useAuthStore } from "../store/auth.js";
import { CHANGE_PASSWORD_URL } from "../utility/UrlConstants.js";
import { fetchAndLogApiResponseErrorListMsg } from "../utility/ErrorUtility.js";

export default {
  data() {
    return {
      errorMsg: null,
      isSubmitting: false,
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      arePasswordsVisible: false,
    };
  },
  methods: {
    changePassword() {
      if (this.isSubmitting) return;

      this.errorMsg = null;

      if (this.newPassword !== this.newPasswordRepeat) {
        this.errorMsg = "Passwords do not match.";
        return;
      }

      this.isSubmitting = true;
      const requestBody = {
        old_password: this.oldPassword,
        password: this.newPassword,
        password2: this.newPasswordRepeat,
      };

      api
        .post(CHANGE_PASSWORD_URL, requestBody)
        .then(() => {
          this.oldPassword = "";
          this.newPassword = "";
          this.newPasswordRepeat = "";
          this.arePasswordsVisible = false;

          // A successful password change clears both authentication cookies on
          // the server, so only local session cleanup is needed here.
          const authStore = useAuthStore();
          authStore.logout(SESSION_END_REASON.USER_LOGOUT);

          return this.$router.replace("/login");
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
            "Unable to change password. Please check your credentials or try again later.",
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
    <div class="form-signin w-100 m-auto">
      <form @submit.prevent="changePassword">
        <h1 class="h3 mb-3 fw-normal">Change password</h1>
        <div class="alert alert-info" role="note">
          You will be logged out after changing your password and will need to
          log in again.
        </div>
        <div class="form-floating">
          <input
            :type="arePasswordsVisible ? 'text' : 'password'"
            class="form-control"
            id="input-old-password"
            placeholder="Old Password"
            v-model="oldPassword"
            :disabled="isSubmitting"
            @input="errorMsg = null"
            required
            autocomplete="current-password"
          />
          <label for="input-old-password">Old Password</label>
        </div>
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
            <li>Different from the current password</li>
            <li>Matches the confirmation password</li>
          </ul>
        </div>
        <div class="form-check">
          <input
            id="show-passwords"
            v-model="arePasswordsVisible"
            class="form-check-input"
            type="checkbox"
            :disabled="isSubmitting"
          />
          <label class="form-check-label" for="show-passwords">
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
          {{ isSubmitting ? "Changing password…" : "Submit" }}
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

#input-old-password {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

#input-new-password {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

#input-new-password-repeat {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
