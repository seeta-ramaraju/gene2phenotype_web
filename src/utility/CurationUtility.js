import {
  VariantTypesAttribs,
  VariantConsequencesAttribs,
  EvidenceTypesAttribs,
} from "./CurationConstants";
import cloneDeep from "lodash/cloneDeep";

export const getInitialInputForNewCuration = () => {
  let input = {
    locus: "",
    session_name: "",
    publications: {},
    phenotypes: {},
    allelic_requirement: "",
    cross_cutting_modifier: [],
    variant_types: {},
    variant_descriptions: {},
    variant_consequences: {},
    molecular_mechanism: {
      name: "",
      support: "inferred",
    },
    mechanism_synopsis: {
      name: "",
      support: "inferred",
    },
    mechanism_evidence: {},
    disease: { disease_name: "", cross_references: [] },
    panels: [],
    confidence: {
      justification: "",
      level: "",
    },
  };

  // initialize variant_types field of input with VariantTypesAttribs
  let variantTypesObj = {};
  for (const item of VariantTypesAttribs) {
    variantTypesObj[item.primaryType.inputKey] = {};
    for (const secondaryTypeObj of item.secondaryType) {
      variantTypesObj[item.primaryType.inputKey][secondaryTypeObj.inputKey] = {
        nmd_escape: false,
        de_novo: false,
        inherited: false,
        unknown_inheritance: false,
        supporting_papers: [],
        comment: "",
      };
    }
  }
  input.variant_types = variantTypesObj;

  // initialize variant_consequences field of input with VariantConsequencesAttribs
  let variantConsequencesObj = {};
  VariantConsequencesAttribs.forEach((item) => {
    variantConsequencesObj[item.inputKey] = "";
  });
  input.variant_consequences = variantConsequencesObj;

  return input;
};

export const updateInputWithPublicationsData = (input, publicationsData) => {
  let updatedInput = { ...input };

  // update publications, phenotypes, variant_descriptions, mechanism_evidence fields of input
  let updatedPublicationsObj = {};
  let updatedPhenotypesObj = {};
  let updatedVariantDescriptionsObj = {};
  let updatedMechanismEvidenceObj = {};

  publicationsData.results.forEach((item) => {
    updatedPublicationsObj[item.pmid] = {
      families: item.families,
      affectedIndividuals: item.affectedIndividuals,
      consanguineous: item.consanguineous,
      ancestries: item.ancestries,
      comment: item.comment,
      source: item.source,
      year: item.year,
      title: item.title,
      authors: item.authors,
    };

    updatedPhenotypesObj[item.pmid] = {
      summary: "",
    };

    updatedVariantDescriptionsObj[item.pmid] = {
      description: "",
    };

    let evidenceTypesObj = {};
    EvidenceTypesAttribs.forEach((item) => {
      evidenceTypesObj[item.primaryType] = [];
    });
    updatedMechanismEvidenceObj[item.pmid] = {
      description: "",
      evidence_types: evidenceTypesObj,
    };
  });

  updatedInput.publications = updatedPublicationsObj;
  updatedInput.phenotypes = updatedPhenotypesObj;
  updatedInput.variant_descriptions = updatedVariantDescriptionsObj;
  updatedInput.mechanism_evidence = updatedMechanismEvidenceObj;

  return updatedInput;
};

export const DeConstructJSONWithPublications = (arraydata) => {
  let publicationsObj = {};

  arraydata.forEach((publication) => {
    const {
      families,
      affectedIndividuals,
      consanguineous,
      ancestries,
      comment,
      source,
      year,
      title,
      authors,
      pmid,
    } = publication;
    publicationsObj[pmid] = {
      families,
      affectedIndividuals,
      consanguineous,
      ancestries,
      comment,
      source,
      year,
      title,
      authors,
      pmid,
    };
  });

  return publicationsObj;
};

export const DeConstructJSONWithVariantTypes = (arraydata) => {
  let variantTypesObj = {};

  for (const item of VariantTypesAttribs) {
    variantTypesObj[item.primaryType.inputKey] = {};
    for (const secondaryTypeObj of item.secondaryType) {
      variantTypesObj[item.primaryType.inputKey][secondaryTypeObj.inputKey] = {
        nmd_escape: false,
        de_novo: false,
        inherited: false,
        unknown_inheritance: false,
        supporting_papers: [],
        comment: "",
      };
    }
  }

  arraydata.forEach((varianttypes) => {
    const {
      comment,
      de_novo,
      inherited,
      nmd_escape,
      primary_type,
      secondary_type,
      supporting_papers,
      unknown_inheritance,
    } = varianttypes;

    // Ensure the primary_type key exists
    if (variantTypesObj[primary_type][secondary_type]) {
      variantTypesObj[primary_type][secondary_type] = {
        comment,
        de_novo,
        inherited,
        nmd_escape,
        supporting_papers,
        unknown_inheritance,
      };
    }
  });

  return variantTypesObj;
};

// export const DeConstructJSONwithVariantDesc = (arraydata) => {
//   let variantDescription = {};

//   arraydata.forEach((variantDes) => {
//     const { description, pmid } = variantDes;
//     variantDescription[pmid] = description;
//   });

//   return variantDescription;
// };

export const DeConstructJSONWithVariantCon = (arraydata) => {
  let variantConObj = {};

  VariantConsequencesAttribs.forEach((item) => {
    variantConObj[item.inputKey] = "";
  });
  return variantConObj;
};

export const prepareInputForDataSubmission = (input) => {
  let preparedInput = cloneDeep(input);

  // convert publications from object to array of objects and remove some keys and trim some key values
  let publicationsArray = [];
  for (const [pmidKey, valueObj] of Object.entries(
    preparedInput.publications
  )) {
    let publicationObj = { pmid: pmidKey };
    const keysToRemove = ["authors", "year", "title"];
    const keysToTrimValues = ["ancestries", "comment"];
    for (const [key, value] of Object.entries(valueObj)) {
      if (!keysToRemove.includes(key)) {
        if (keysToTrimValues.includes(key)) {
          publicationObj[key] = value.trim();
        } else {
          publicationObj[key] = value;
        }
      }
    }
    publicationsArray.push(publicationObj);
  }
  preparedInput.publications = publicationsArray;

  // convert phenotypes from object to array of objects and include phenotypes that have non empty summary
  let phenotypesArray = [];
  for (const [pmidKey, valueObj] of Object.entries(preparedInput.phenotypes)) {
    if (valueObj.summary.trim() !== "") {
      let phenotypeObj = {
        ...valueObj,
        pmid: pmidKey,
        summary: valueObj.summary.trim(), // trim summary value
      };
      phenotypesArray.push(phenotypeObj);
    }
  }
  preparedInput.phenotypes = phenotypesArray;

  // convert mechanism evidence from object to array of objects and include evidence that have non empty description or non empty evidence types
  let mechanismEvidenceArray = [];
  for (const [publicationPmid, valueObj] of Object.entries(
    preparedInput.mechanism_evidence
  )) {
    let evidenceTypesArray = [];
    for (const [primaryType, secondaryTypesArray] of Object.entries(
      valueObj.evidence_types
    )) {
      if (secondaryTypesArray.length > 0) {
        let evidenceTypeObj = {
          primary_type: primaryType,
          secondary_type: secondaryTypesArray,
        };
        evidenceTypesArray.push(evidenceTypeObj);
      }
    }
    if (valueObj.description.trim() !== "" || evidenceTypesArray.length > 0) {
      let mechanismEvidenceObj = {
        pmid: publicationPmid,
        description: valueObj.description.trim(), // trim description value
        evidence_types: evidenceTypesArray,
      };
      mechanismEvidenceArray.push(mechanismEvidenceObj);
    }
  }
  preparedInput.mechanism_evidence = mechanismEvidenceArray;

  // convert variant types from object to array of objects and include variant types that have any non empty field data
  let variantTypesArray = [];
  for (const [primaryType, primaryTypeValueObj] of Object.entries(
    preparedInput.variant_types
  )) {
    for (const [secondaryType, secondaryTypeValueObj] of Object.entries(
      primaryTypeValueObj
    )) {
      if (
        secondaryTypeValueObj.de_novo ||
        secondaryTypeValueObj.inherited ||
        secondaryTypeValueObj.nmd_escape ||
        secondaryTypeValueObj.unknown_inheritance ||
        secondaryTypeValueObj.comment.trim() !== "" ||
        secondaryTypeValueObj.supporting_papers.length > 0
      ) {
        let variantTypesObj = {
          ...secondaryTypeValueObj,
          primary_type: primaryType,
          secondary_type: secondaryType,
          comment: secondaryTypeValueObj.comment.trim(), // trim comment value
        };
        variantTypesArray.push(variantTypesObj);
      }
    }
  }
  preparedInput.variant_types = variantTypesArray;

  // convert variant descriptions from object to array of objects and include variant descriptions that have non empty description
  let variantDescriptionsArray = [];
  for (const [pmidKey, valueObj] of Object.entries(
    preparedInput.variant_descriptions
  )) {
    if (valueObj.description.trim() !== "") {
      let variantDescriptionObj = {
        ...valueObj,
        pmid: pmidKey,
        description: valueObj.description.trim(), // trim description value
      };
      variantDescriptionsArray.push(variantDescriptionObj);
    }
  }
  preparedInput.variant_descriptions = variantDescriptionsArray;

  // convert variant consequences from object to array of objects and include variant consequence that have non empty support
  let variantConsequencesArray = [];
  for (const [key, value] of Object.entries(
    preparedInput.variant_consequences
  )) {
    if (value !== "") {
      let variantConsequencesObj = {
        name: key,
        support: value,
      };
      variantConsequencesArray.push(variantConsequencesObj);
    }
  }
  preparedInput.variant_consequences = variantConsequencesArray;

  // trim disease name
  preparedInput.disease.disease_name =
    preparedInput.disease.disease_name.trim();

  // if disease name is not empty then prefix locus to disease name
  if (preparedInput.disease.disease_name !== "") {
    preparedInput.disease.disease_name = `${preparedInput.locus.toUpperCase()}-related ${
      preparedInput.disease.disease_name
    }`;
  }

  // trim session name
  preparedInput.session_name = preparedInput.session_name.trim();

  // trim confidence justification
  preparedInput.confidence.justification =
    preparedInput.confidence.justification.trim();

  return preparedInput;
};

export const prepareInputForUpdating = (input) => {
  let deprepare_input = cloneDeep(input);

  return {
    locus: deprepare_input.locus,
    publications: DeConstructJSONWithPublications(deprepare_input.publications),
    phenotypes: deprepare_input.phenotypes,
    allelic_requirement: deprepare_input.allelic_requirement,
    cross_cutting_modifier: deprepare_input.cross_cutting_modifier,
    session_name: deprepare_input.session_name,
    variant_types: DeConstructJSONWithVariantTypes(
      deprepare_input.variant_types
    ),
    variant_descriptions: deprepare_input.variant_descriptions,
    variant_consequences: DeConstructJSONWithVariantCon(
      deprepare_input.variant_consequences
    ),
    //molecular_mechanism: deprepare_input.molecular_mechanism, // is it always inferred except if evidence is given
    //mechanism_synopsis: deprepare_input.mechanism_synopsis,
    //mechanism_evidence: deprepare_input.mechanism_evidence,
    //mechanism_evidence: deprepare_input.mechanism_evidence,
    disease: {
      disease_name: deprepare_input.disease.disease_name,
      cross_references: deprepare_input.disease.cross_references,
    },
    panels: deprepare_input.panels,
    confidence: {
      justification: deprepare_input.confidence.justification,
      level: deprepare_input.confidence.level,
    },
  };
};

// this function is to turn array of objects to objects so it can be displayed on the website for updating
export const appendObjectToPublications = (publications, pubDict) => {
  // Initialize a new array to hold the combined objects
  let combinedArray = [];

  // Check if publications.results is an array
  let new_publications = publications.results;

  // Iterate through the new publications
  new_publications.forEach((pub) => {
    const {
      families = null,
      affectedIndividuals = null,
      consanguineous = "unknown",
      ancestries = "",
      comment = "",
      source,
      year,
      title,
      authors,
      pmid,
    } = pub;
    if (pubDict[pmid]) {
      console.log(`Publication with pmid ${pmid} already exists`);
    } else {
      // Append the new publication to the pubDict
      pubDict[pmid] = {
        families,
        affectedIndividuals,
        consanguineous,
        ancestries,
        comment,
        source,
        year,
        title,
        authors,
        year,
        pmid,
      };
    }
  });

  // Convert pubDict to an array of its values
  combinedArray = Object.values(pubDict);

  // Return the combined array within an object that contains the results key
  return { results: combinedArray, count: combinedArray.length };
};
