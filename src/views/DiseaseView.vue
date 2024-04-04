<script>
export default {
    data() {
        return {
            isDataLoading: false,
            diseaseSummaryData: null,
            diseaseData: null,
            errorMsg: null,
        };
    },
    created() {
        //watch the params of the route to fetch the data again 
        this.$watch(
            () => this.$route.params,
            () => {
                this.fetchData();
            },
            // fetch this data when the view is created and the data is already being observed
            { immediate: true }
        );
    },
    //adding methods
    methods: {
        fetchData() {
            this.errorMsg = this.diseaseSummaryData = this.diseaseData = null; // initializing all the values to null
            this.isDataLoading = true;
            const diseaseID = this.$route.params.id;
            console.log(diseaseID);
            Promise.all([
                fetch(`/gene2phenotype/api/disease/${this.$route.params.id}/summary`),
                fetch(`/gene2phenotype/api/disease/${this.$route.params.id}`),
            ])
                .then((responseArr) => {
                    return Promise.all(
                        responseArr.map((response) => {
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                return Promise.reject(new Error("Unable to fetch Disease information ${diseaseID} "));
                            }
                        })
                    );
                })
                .then((responseJsonArr) => {
                    const [diseaseSummaryData, diseaseData] = responseJsonArr;
                    this.isDataLoading = false;
                    this.diseaseData = diseaseData;
                    this.diseaseSummaryData = diseaseSummaryData;
                })
                .catch((error) => {
                    this.isDataLoading = false;
                    this.errorMsg = error.message;
                    console.log(error);
                });
        },
    },
}
</script>
<template>
    <div class="container px-5 py-3">
        <div v-if="isDataLoading">Data is Loading.....Thank you for your patience....</div>
        <!-- v.if is a directive to check the if the value is true or False -->
        <div v-if="errorMsg" class="text-danger">{{ errorMsg }}</div>
        <div v-if="diseaseData && diseaseSummaryData">
            <h2 v-if="diseaseData.name">{{ diseaseData.name }} </h2>
            <h2 v-else class="text-muted">Not Available</h2>
            <h3 v-for="item in diseaseData.ontology_terms">{{ item.description }}</h3>
            <!-- v.else is a directive to do if v-if is  not True -->
            <h4 v-if="diseaseData.mim">
                <a :href=`https://omim.org/entry/${diseaseData.mim}` target="_blank">{{ diseaseData.mim }}</a>
            </h4>
            <div class="container px-5 py-3">
                <h4 class="py-3">Records associated with this disease</h4>
                <div class="row mx-1">
                    <table class="table table-hover table-bordered"
                        v-if="diseaseSummaryData.records_summary && diseaseSummaryData.records_summary.length > 0">
                        <thead>
                            <tr>
                                <th>G2P stable ID</th>
                                <th>Genotype</th>
                                <th>Variant Consequence</th>
                                <th>Variant Type</th>
                                <th>Mechanism</th>
                                <th>Panels</th>
                            </tr>
                        </thead>
                        <tbody style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                            v-for="item in diseaseSummaryData.records_summary">
                            <a :href="'#' + item.stable_id">{{ item.stable_id }}</a>
                            <!-- This needs to be changed to route to the G2P stable id (LGD) page -->
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"> {{ item.genotype
                                }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                                v-if="Array.isArray(item.variant_consequence)">
                                {{ item.variant_consequence.join(",") }}
                            </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" v-else> {{
            item.variant_consequence }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                                v-if="Array.isArray(item.variant_type)"> {{ item.variant_type.join(",") }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" v-else> {{
            item.variant_type }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                                v-if="Array.isArray(item.molecular_mehanism)"> {{ item.molecular_mehanism.join(',') }}
                            </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" v-else> {{
            item.molecular_mehanism }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                                v-if="Array.isArray(item.panels)"> {{ item.panels.join(",") }} </td>
                            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" v-else> {{
            item.panels }} </td>
                        </tbody>
                    </table>
                    <p v-else>No Records found</p>
                </div>
            </div>
            <div class="container px-5 py-3">
                <h4 v-if="diseaseData.ontology_terms">Disease Ontology terms</h4>
                <p v-for="item in diseaseData.ontology_terms">
                    <a :href="'http://purl.obolibrary.org/obo/' + item.accession.replace(/:/g, '_')" target="_blank">{{
            item.accession }}</a>
                </p>
                <h4 v-if="diseaseData.publications && diseaseData.publications.length > 0">Publications</h4>
                <ul v-for="item in diseaseData.publications">
                    <li> <a :href="'https://pubmed.ncbi.nlm.nih.gov/' + item.pmid" target="_blank"> {{ item.title }}
                        </a>
                    </li>
                </ul>
                <p v-if="diseaseData.last_updated && diseaseData.last_updated != ''"> Date updated: {{
                    diseaseData.last_updated }} </p>
            </div>

        </div>

    </div>
</template>