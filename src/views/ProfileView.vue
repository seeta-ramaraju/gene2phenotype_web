<script>
import { PROFILE_URL } from "../utility/UrlConstants.js";
import { appendAuthenticationHeaders } from "../utility/AuthenticationUtility.js";

export default {
  data() {
    return {
      userProfileData: null,
      errorMsg: null,
      isDataLoading: false,
    };
  },
  created() {
    // watch the params of this route to fetch this data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData();
      },
      { immediate: true }
    );
  },
  methods: {
    fetchData() {
      this.userProfileData = null;
      this.errorMsg = null;
      this.isDataLoading = true;

      const apiHeaders = appendAuthenticationHeaders({
        "Content-Type": "application/json",
      });

      fetch(PROFILE_URL, {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to fetch user data");
          }
        })
        .then((responseJson) => {
          this.userProfileData = responseJson;
          this.isDataLoading = false;
        })
        .catch((error) => {
          this.isDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <h2 class="pb-3">Profile</h2>
    <div
      class="d-flex justify-content-center"
      v-if="isDataLoading"
      style="margin-top: 250px; margin-bottom: 250px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="alert alert-danger mt-3" role="alert" v-if="errorMsg">
      <div><i class="bi bi-exclamation-circle-fill"></i> {{ errorMsg }}</div>
    </div>
    <div v-if="userProfileData">
      <table class="table" style="max-width: 80%">
        <tbody>
          <tr>
            <th>Username</th>
            <td>{{ userProfileData.user_name }}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{{ userProfileData.email }}</td>
          </tr>
          <tr>
            <th>Panel(s)</th>
            <td>
              <span
                v-if="
                  userProfileData.panels && userProfileData.panels.length > 0
                "
              >
                {{ userProfileData.panels.join(", ") }}
              </span>
              <span v-else class="text-muted">No permission to edit</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
