<script>
import { LOGIN_URL } from "../utility/UrlConstants.js";
import {
  getCookie,
  setItemsInLocalStorage,
} from "../utility/AuthenticationUtility.js";

export default {
  data() {
    return {
      errorMsg: null,
      isDataLoading: false,
      username: "",
      password: "",
      isPasswordVisible: false,
    };
  },
  methods: {
    login() {
      this.errorMsg = null;
      this.isDataLoading = true;
      fetch(LOGIN_URL, {
        method: "POST",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to login. Please check your credentials.");
          }
        })
        .then((responseJson) => {
          setItemsInLocalStorage({
            authenticationToken: responseJson.token,
            tokenExpiry: responseJson.expiry,
            username: responseJson.user?.user_name,
          });
          this.$router.replace("/"); // Navigate to homepage
          this.isDataLoading = false;
        })
        .catch((error) => {
          this.isDataLoading = false;
          this.errorMsg = error.message;
          console.log(error);
        });
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>
<template>
  <div class="container px-5 py-5" style="min-height: 60vh">
    <div
      class="d-flex justify-content-center"
      v-if="isDataLoading"
      style="margin-top: 250px; margin-bottom: 250px"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="form-signin w-100 m-auto" v-else>
      <form @submit.prevent="login">
        <img
          class="mb-4 m-auto d-flex align-items-center"
          alt="G2P logo"
          src="../assets/G2P-logo.png"
          width="50%"
          height="auto"
        />
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="input-username"
            placeholder="name@example.com"
            v-model.trim="username"
          />
          <label for="input-username">Email address</label>
        </div>
        <div class="form-floating">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            class="form-control"
            id="input-password"
            placeholder="Password"
            v-model.trim="password"
          />
          <label for="input-password">Password</label>
          <input type="checkbox" @click="togglePasswordVisibility" />
          {{ isPasswordVisible ? "Hide Password" : "Show Password" }}
        </div>
        <button class="btn btn-primary w-100 mt-2" type="submit">Log in</button>
      </form>
      <div class="alert alert-danger mt-3" role="alert" v-if="errorMsg">
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

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"],
.form-signin input[type="text"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
