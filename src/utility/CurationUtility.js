import {
  VariantTypesAttribs,
  VariantConsequencesAttribs,
  EvidenceTypesAttribs,
} from "./CurationConstants";
import cloneDeep from "lodash/cloneDeep";

const convertObjectWithPmidToArrayOfObjects = (inputObj) => {
  let outputArray = [];
  for (const [key, value] of Object.entries(inputObj)) {
    let outputObject = { ...value };
    outputObject.pmid = key;
    outputArray.push(outputObject);
  }
  return outputArray;
};

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
      name: "undetermined",
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
      families: null,
      affectedIndividuals: null,
      consanguineous: "unknown",
      ancestries: "",
      comment: "",
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

export const prepareInputForDataSubmission = (input) => {
  let preparedInput = cloneDeep(input);

  // convert publications from object to array of objects
  preparedInput.publications = convertObjectWithPmidToArrayOfObjects(
    preparedInput.publications
  );

  // remove keys from publication object
  const keysToRemove = ["authors", "year", "title"];
  for (let index = 0; index < preparedInput.publications.length; index++) {
    let updatedPublicationObj = {};
    for (const [key, value] of Object.entries(
      preparedInput.publications[index]
    )) {
      if (!keysToRemove.includes(key)) {
        updatedPublicationObj[key] = value;
      }
    }
    preparedInput.publications[index] = updatedPublicationObj;
  }

  // convert phenotypes from object to array of objects and include phenotypes that have non empty summary
  preparedInput.phenotypes = convertObjectWithPmidToArrayOfObjects(
    preparedInput.phenotypes
  ).filter((item) => item.summary !== "");

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
    if (valueObj.description !== "" || evidenceTypesArray.length > 0) {
      let mechanismEvidenceObj = {
        pmid: publicationPmid,
        description: valueObj.description,
        evidence_types: evidenceTypesArray,
      };
      mechanismEvidenceArray.push(mechanismEvidenceObj);
    }
  }
  preparedInput.mechanism_evidence = mechanismEvidenceArray;

  // convert variant types from object to array of objects and include variant types that have any non empty field data
  let variantTypesArray = [];
  for (const [primaryType, primaryTypeValue] of Object.entries(
    preparedInput.variant_types
  )) {
    for (const [secondaryType, secondaryTypeValue] of Object.entries(
      primaryTypeValue
    )) {
      if (
        secondaryTypeValue.de_novo ||
        secondaryTypeValue.inherited ||
        secondaryTypeValue.nmd_escape ||
        secondaryTypeValue.unknown_inheritance ||
        secondaryTypeValue.comment !== "" ||
        secondaryTypeValue.supporting_papers.length > 0
      ) {
        let variantTypesObj = { ...secondaryTypeValue };
        variantTypesObj.primary_type = primaryType;
        variantTypesObj.secondary_type = secondaryType;
        variantTypesArray.push(variantTypesObj);
      }
    }
  }
  preparedInput.variant_types = variantTypesArray;

  // convert variant descriptions from object to array of objects and include variant descriptions that have non empty description
  preparedInput.variant_descriptions = convertObjectWithPmidToArrayOfObjects(
    preparedInput.variant_descriptions
  ).filter((item) => item.description !== "");

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

  // if disease name is not empty then prefix locus to disease name
  if (preparedInput.disease.disease_name !== "") {
    preparedInput.disease.disease_name = `${preparedInput.locus.toUpperCase()}-related ${
      preparedInput.disease.disease_name
    }`;
  }

  return preparedInput;
};
