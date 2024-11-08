<script>
import { PROFILE_URL } from "../utility/UrlConstants.js";
import {
  appendAuthenticationHeaders
} from "../utility/AuthenticationUtility.js";

export default {
  data() {
    return {
      userProfileData: null,
      errorMsg: null,
      isDataLoading: false,
    }
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
  mounted() {
    this.fetchData();
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
};
</script>
<template>
  <div class="container px-5 py-3" style="min-height: 60vh">
    <h2 class="pb-3">Profile</h2>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}
    </div>
    <div class="pt-3" v-if="userProfileData">
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
            <td>{{ userProfileData.panels.join(", ") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
