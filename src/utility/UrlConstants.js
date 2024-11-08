// G2P API URLS
export const G2P_API_BASE_URL = "/gene2phenotype/api";
export const LOGIN_URL = `${G2P_API_BASE_URL}/login/`;
export const ALL_PANELS_URL = `${G2P_API_BASE_URL}/panels/`;
export const PANEL_URL = `${G2P_API_BASE_URL}/panel/:panelname/`;
export const PANEL_SUMMARY_URL = `${G2P_API_BASE_URL}/panel/:panelname/summary/`;
export const USER_PANELS_URL = `${G2P_API_BASE_URL}/user/panels/`;
export const DOWNLOAD_PANEL_URL = `${G2P_API_BASE_URL}/panel/:panelname/download`;
export const SEARCH_URL = `${G2P_API_BASE_URL}/search/`;
export const GENE_URL = `${G2P_API_BASE_URL}/gene/:locus/`;
export const GENE_SUMMARY_URL = `${G2P_API_BASE_URL}/gene/:locus/summary/`;
export const GENE_FUNCTION_URL = `${G2P_API_BASE_URL}/gene/:locus/function/`;
export const GENE_DISEASE_URL = `${G2P_API_BASE_URL}/gene/:locus/disease`;
export const ATTRIBS_URL = `${G2P_API_BASE_URL}/attribs/`;
export const ATTRIBS_DESCRIPTION_URL = `${G2P_API_BASE_URL}/attribs/description`;
export const PUBLICATIONS_URL = `${G2P_API_BASE_URL}/publication/:pmids/`;
export const PHENOTYPES_URL = `${G2P_API_BASE_URL}/phenotype/:hpoterms/`;
export const MECHANISMS_URL = `${G2P_API_BASE_URL}/molecular_mechanisms/`;
export const VARIANT_TYPES_URL = `${G2P_API_BASE_URL}/ontology_terms/variant_types/`;
export const SAVE_DRAFT_URL = `${G2P_API_BASE_URL}/add/curation/`;
export const SAVED_DRAFT_DATA_URL = `${G2P_API_BASE_URL}/curation/:stableid`;
export const UPDATE_SAVED_DRAFT_URL = `${G2P_API_BASE_URL}/curation/:stableid/update/`;
export const ALL_SAVED_DRAFTS_URL = `${G2P_API_BASE_URL}/curations`;
export const PUBLISH_URL = `${G2P_API_BASE_URL}/curation/publish/:stableid/`;
export const DISEASE_URL = `${G2P_API_BASE_URL}/disease/:diseasename`;
export const DISEASE_SUMMARY_URL = `${G2P_API_BASE_URL}/disease/:diseasename/summary`;
export const LGD_RECORD_URL = `${G2P_API_BASE_URL}/lgd/:stableid/`;
export const ADD_PANEL_URL = `${G2P_API_BASE_URL}/lgd/:stableid/panel/`;
export const UPDATE_CONFIDENCE_URL = `${G2P_API_BASE_URL}/lgd/:stableid/update_confidence/`;
export const UPDATE_MECHANISM_URL = `${G2P_API_BASE_URL}/lgd/:stableid/update_mechanism/`;

//External API URLS
export const HPO_SEARCH_API_URL = "https://ontology.jax.org/api/hp/search";
