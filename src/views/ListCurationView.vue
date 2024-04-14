<script>
export default {
  data() {
    return {
      isDataLoading: false,
      curationListData: null,
      errorMsg: null,
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
      this.errorMsg = this.curationListData = null;
      this.isDataLoading = true;
      //not using promise.all because it is one endpoint
      fetch(`/gene2phenotype/api/curations`)
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
  <div class="container px-5 py-3">
    <div v-if="isDataLoading">
      Curation Entries is loading. Thank you for your patience
    </div>
    <div v-if="curationListData">
      <table
        class="table table-hover table-bordered"
        v-if="curationListData && curationListData.count > 1"
      >
        <thead>
          <tr>
            <th>Locus</th>
            <th>Session Name</th>
            <th>Date Created</th>
            <th>Date Last Updated</th>
            <th>Stable ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in curationListData.results">
            <td>{{ item.locus }}</td>
            <td>{{ item.session_name }}</td>
            <td>{{ item.created_on }}</td>
            <td>{{ item.last_updated }}</td>
            <td>
              <router-link
                :to="`/lgd/${item.stable_id}`"
                style="text-decoration: none"
                v-if="item.stable_id"
                >{{ item.stable_id }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-danger" v-else>
        You do not have any saved drafts at this moment.
      </p>
    </div>
  </div>
</template>
