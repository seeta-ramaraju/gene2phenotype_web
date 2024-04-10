<script>
export default {
    data() {
        return {
            isDataLoading: false,
            CurationListData: null,
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
            this.errorMsg = this.CurationListData = null;
            this.isDataLoading = true;
            //not using promise.all because it is one endpoint 
            fetch(`/gene2phenotype/api/curations`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Unable to fetch Curation entries');
                    }
                })
                .then((responseJson) => {
                    this.CurationListData = responseJson;
                    this.isDataLoading = false;
                })
                .catch((error) => {
                    this.isDataLoading = false;
                    this.errorMsg = error.message;
                });



        },

    },
}
</script>
<template>
    <div class="container px-5 py-3">
        <div v-if="isDataLoading">Curation Entries is loading. Thank you for your patience</div>
        <h2 v-else>Curation Entries</h2>
        <div v-if="CurationListData">
            <table class="table table-hover table-bordered" v-if="CurationListData && CurationListData.count > 1">
                <thead>
                    <tr>
                        <th>Locus</th>
                        <th>Session Name</th>
                        <th>Date Created</th>
                        <th>Date Last Updated</th>
                        <th>G2P Stable ID</th>
                    </tr>
                </thead>
                <tbody v-for="item in CurationListData.results">
                    <tr>
                        <td>{{ item.locus }}</td>
                        <td>{{ item.session_name }}</td>
                        <td>{{ item.created_on }}</td>
                        <td>{{ item.last_updated }}</td>
                        <td> <router-link :to="`/lgd/${item.stable_id}`" style="text-decoration: none"
                                v-if="item.stable_id">{{ item.stable_id }}</router-link>
                        </td>
                    </tr>

                </tbody>

            </table>

        </div>



    </div>

</template>