<script>
import router from "@/router";
import {
  checkLogInAndAppendAuthHeaders,
  getUsername,
  isUserLoggedIn,
  logOutUser,
} from "../../utility/AuthenticationUtility.js";
import { ALL_PANELS_URL } from "../../utility/UrlConstants.js";

export default {
  data() {
    return {
      isDataLoading: false,
      panelData: null,
      searchInput: "",
      selectedSearchType: "all",
      selectedSearchPanel: "all",
    };
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchPanelData();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    fetchPanelData() {
      this.searchInput = "";
      this.selectedSearchType = "all";
      this.selectedSearchPanel = "all";
      this.panelData = null;
      this.isDataLoading = true;
      const apiHeaders = checkLogInAndAppendAuthHeaders({
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      });
      fetch(ALL_PANELS_URL, {
        method: "GET",
        headers: apiHeaders,
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(new Error("Unable to fetch panel data"));
          }
        })
        .then((responseJson) => {
          this.isDataLoading = false;
          this.panelData = responseJson;
        })
        .catch((error) => {
          this.isDataLoading = false;
          console.log(error);
        });
    },
    searchClickHandler() {
      if (this.searchInput) {
        let routeQuery = {
          query: this.searchInput,
          type:
            this.selectedSearchType === "all"
              ? undefined
              : this.selectedSearchType,
          panel:
            this.selectedSearchPanel === "all"
              ? undefined
              : this.selectedSearchPanel,
        };
        router.push({ path: "/search", query: routeQuery });
      }
    },
    logout() {
      logOutUser();
      this.$router.go(); // Reloads current route
    },
    isLoggedIn() {
      return isUserLoggedIn();
    },
    getUsername,
  },
};
</script>
<template>
  <header class="py-2 top-header">
    <div
      class="container d-grid gap-3 align-items-center"
      style="grid-template-columns: 2fr 3fr"
    >
      <router-link
        to="/"
        class="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-decoration-none"
      >
        <img
          src="../../assets/G2P-logo.png"
          alt="G2P logo"
          width="70"
          height="70"
        />
        <span class="navbar-brand mb-0 h1 mx-2 fs-4 text-white">
          Gene2Phenotype
        </span>
      </router-link>
      <div class="d-flex align-items-center">
        <div class="input-group w-100">
          <input
            type="text"
            class="form-control"
            aria-label="Search text input"
            placeholder="Search G2P"
            v-model="searchInput"
            id="header-search-input"
            @keyup.enter="searchClickHandler"
          />
          <button
            class="btn dropdown-toggle text-white fw-bold filter-btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter
          </button>
          <div class="dropdown-menu dropdown-menu-end p-3">
            <p class="fw-bold mb-1">Filter by type</p>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="all"
                v-model="selectedSearchType"
                id="header-filter-input-type-all"
              />
              <label
                class="form-check-label"
                for="header-filter-input-type-all"
              >
                All
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="gene"
                v-model="selectedSearchType"
                id="header-filter-input-type-gene"
              />
              <label
                class="form-check-label"
                for="header-filter-input-type-gene"
              >
                Gene
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="disease"
                v-model="selectedSearchType"
                id="header-filter-input-type-disease"
              />
              <label
                class="form-check-label"
                for="header-filter-input-type-disease"
              >
                Disease
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="phenotype"
                v-model="selectedSearchType"
                id="header-filter-input-type-phenotype"
              />
              <label
                class="form-check-label"
                for="header-filter-input-type-phenotype"
              >
                Phenotype
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="g2p_id"
                v-model="selectedSearchType"
                id="header-filter-input-type-g2p-id"
              />
              <label
                class="form-check-label"
                for="header-filter-input-type-g2p-id"
              >
                G2P ID
              </label>
            </div>
            <div v-if="panelData?.results?.length > 0">
              <hr class="dropdown-divider" />
              <p class="fw-bold mb-1">Filter by panel</p>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  value="all"
                  v-model="selectedSearchPanel"
                  id="header-filter-input-panel-all"
                />
                <label
                  class="form-check-label"
                  for="header-filter-input-panel-all"
                >
                  All
                </label>
              </div>
              <div class="form-check" v-for="item in panelData.results">
                <input
                  class="form-check-input"
                  type="radio"
                  :value="item.name.toLowerCase()"
                  v-model="selectedSearchPanel"
                  :id="`header-filter-input-panel-${item.name}`"
                />
                <label
                  class="form-check-label"
                  :for="`header-filter-input-panel-${item.name}`"
                >
                  {{ item.description ? item.description : item.name }}
                </label>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn text-white search-btn"
            @click="searchClickHandler"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
  <nav class="py-2 border-bottom text-white bottom-header">
    <div class="container d-flex flex-wrap">
      <ul class="nav me-auto nav-underline">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link px-1 fw-bold text-white text-decoration-none"
          >
            Home
          </router-link>
        </li>
        <li class="nav-item dropdown">
          <span
            class="nav-link dropdown-toggle px-1 text-white fw-bold"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            About
          </span>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/about/project" class="dropdown-item">
                The G2P project
              </router-link>
            </li>
            <li>
              <router-link to="/about/terminology" class="dropdown-item"
                >Terminology</router-link
              >
            </li>
            <li>
              <router-link to="/variant-filtering" class="dropdown-item">
                Variant filtering
              </router-link>
            </li>
            <li>
              <router-link to="/publications" class="dropdown-item">
                Publications
              </router-link>
            </li>
            <li>
              <router-link to="/curators" class="dropdown-item">
                Curators
              </router-link>
            </li>
            <li>
              <router-link to="/download" class="dropdown-item">
                Downloads
              </router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item dropdown" v-if="panelData?.results?.length > 0">
          <a
            class="nav-link dropdown-toggle px-1 text-white fw-bold"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Browse panels
          </a>
          <ul class="dropdown-menu">
            <li v-for="item in panelData.results">
              <router-link
                :to="`/panel/${item.name}`"
                v-if="item.name"
                class="dropdown-item"
              >
                {{ item.description }} panel
              </router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item" v-else>
          <router-link to="/" class="nav-link px-1 text-white fw-bold">
            Browse panels
          </router-link>
        </li>
        <li class="nav-item dropdown" v-if="isLoggedIn()">
          <a
            class="nav-link dropdown-toggle px-1 text-white fw-bold"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Curate
          </a>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/lgd/add" class="dropdown-item">
                Add new G2P record
              </router-link>
            </li>
            <li>
              <router-link to="/curation/entries" class="dropdown-item">
                Saved drafts
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <ul class="nav nav-underline">
        <li class="nav-item" v-if="isLoggedIn() && !!getUsername()">
          <span class="nav-link text-white fw-bold">
            <i class="bi bi-person-fill"></i>
            <router-link
              to="/profile"
              class="text-white"
              style="text-decoration: none"
            >
              {{ getUsername() }}
            </router-link>
          </span>
        </li>
        <li class="nav-item" v-if="isLoggedIn()">
          <button class="nav-link text-white fw-bold" @click="logout">
            Log Out
          </button>
        </li>
        <li class="nav-item" v-else>
          <router-link to="/login" class="nav-link text-white fw-bold">
            Log In
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<style scoped>
.top-header {
  background-color: #286ece;
}
.filter-btn {
  background-color: #4d89dc;
  border-right: solid;
}
.search-btn {
  background-color: #4d89dc;
  -webkit-text-stroke: 1px;
}
.bottom-header {
  background-color: #4d89dc;
}
</style>
