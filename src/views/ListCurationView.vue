<script>
import { ALL_SAVED_DRAFTS_URL } from "../utility/UrlConstants.js";
import {
  appendAuthenticationHeaders,
  isUserLoggedIn,
  logOutUser,
} from "../utility/AuthenticationUtility.js";
import LoginErrorAlert from "@/components/alert/LoginErrorAlert.vue";

export default {
  data() {
    return {
      isDataLoading: false,
      curationListData: null,
      errorMsg: null,
      isLogInSessionExpired: false,
    };
  },
  components: {
    LoginErrorAlert,
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
      if (!isUserLoggedIn()) {
        logOutUser();
        this.isLogInSessionExpired = true;
        return;
      }

      this.errorMsg = this.curationListData = null;
      this.isDataLoading = true;
      let apiHeaders = appendAuthenticationHeaders({
        "Content-Type": "application/json",
      });
      fetch(ALL_SAVED_DRAFTS_URL, {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to fetch Curation entries");
          }
        })
        .then((responseJson) => {
          this.curationListData = responseJson;
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
    <h2>Saved Curation Entries</h2>
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
    <LoginErrorAlert v-if="isLogInSessionExpired" />
    <div v-if="curationListData">
      <div class="py-3">
        <table
          class="table table-hover table-bordered"
          v-if="curationListData && curationListData.count > 0"
        >
          <thead>
            <tr>
              <th>Session Name</th>
              <th>G2P ID</th>
              <th>Locus</th>
              <th>Date Created</th>
              <th>Date Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in curationListData.results">
              <td>
                <router-link
                  :to="`/lgd/update-draft/${item.stable_id}`"
                  style="text-decoration: none"
                  v-if="item.session_name"
                >
                  {{ item.session_name }}
                </router-link>
              </td>
              <td>{{ item.stable_id }}</td>
              <td>{{ item.locus }}</td>
              <td>{{ item.created_on }}</td>
              <td>{{ item.last_update }}</td>
            </tr>
          </tbody>
        </table>
        <p class="text-dark" v-else>You currently have no saved drafts.</p>
      </div>
    </div>
  </div>
</template>
