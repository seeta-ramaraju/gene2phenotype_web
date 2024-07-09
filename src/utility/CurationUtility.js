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
      support: "",
    },
    mechanism_synopsis: {
      name: "",
      support: "",
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

const DeConstructJSONWithVariantCon = (arraydata) => {
  let variantConsequenceObj = {};

  VariantConsequencesAttribs.forEach((item) => {
    variantConsequenceObj[item.inputKey] = "";
  });

  arraydata.forEach((variantCon) => {
    const { name, support } = variantCon;

    if (variantConsequenceObj[name]) {
      variantConsequenceObj[name] = support;
    }
  });
  return variantConsequenceObj;
};

export const prepareInputForDataSubmission = (input) => {
  let preparedInput = cloneDeep(input);

  // convert publications from object to array of objects and remove some keys and trim some key values
  let publicationsArray = [];
  for (const [pmidKey, valueObj] of Object.entries(
    preparedInput.publications
  )) {
    let publicationObj = { pmid: pmidKey };
    const keysToRemove = [];
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

export const prepareInputForUpdating = (previousInput) => {
  //preparing the input to be used to clean
  let deprepare_input = cloneDeep(previousInput);

  //publicationsObj needs to be empty because the publication array needs to be deconstructed to become Object of keys
  let publicationsObj = {};
  let publications = deprepare_input.publications;

  publications.forEach((publication) => {
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

  //deconstructing the phenotype array to be an Object of keys using the publicationObj keys
  let phenotypesObj = {};
  let phenotypes = deprepare_input.phenotypes;

  for (const key of Object.keys(publicationsObj)) {
    phenotypesObj[key] = {
      summary: "",
    };
  }

  phenotypes.forEach((phenotype) => {
    const { pmid, summary } = phenotype;

    if (phenotypesObj[pmid]) {
      phenotypesObj[pmid] = {
        summary,
      };
    }
  });

  let variantDescObj = {};
  let variantDesc = deprepare_input.variant_descriptions;

  for (const key of Object.keys(publicationsObj)) {
    variantDescObj[key] = {
      description: "",
    };
  }

  variantDesc.forEach((variant) => {
    const { description, pmid } = variant;

    if (variantDescObj[pmid]) {
      variantDescObj[pmid] = {
        description,
      };
    }
  });

  let variantTypesObj = {};
  let variantTypes = deprepare_input.variant_types;
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

  variantTypes.forEach((varianttype) => {
    const {
      comment,
      de_novo,
      inherited,
      nmd_escape,
      primary_type,
      secondary_type,
      supporting_papers,
      unknown_inheritance,
    } = varianttype;

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

  let MechanismNameObj = {
    name: deprepare_input.molecular_mechanism.name,
    support: deprepare_input.molecular_mechanism.support,
  };

  let MechanismSynopsisObj = {
    name: deprepare_input.mechanism_synopsis.name,
    support: deprepare_input.mechanism_synopsis.support,
  };

  let MechanismEvidenceObj = {};
  let MechanismEvidence = deprepare_input.mechanism_evidence;

  for (const key of Object.keys(publicationsObj)) {
    MechanismEvidenceObj[key] = {
      description: "",
      evidence_types: {},
    };
  }

  // Populate the evidence_types for each key
  for (const key of Object.keys(MechanismEvidenceObj)) {
    for (const item of EvidenceTypesAttribs) {
      if (!MechanismEvidenceObj[key].evidence_types[item.primaryType]) {
        MechanismEvidenceObj[key].evidence_types[item.primaryType] = [];
      }
      MechanismEvidenceObj[key].evidence_types[item.primaryType].push(
        item.secondaryType
      );
    }
  }

  if (MechanismEvidence) {
    MechanismEvidence.forEach((evidence) => {
      const pmid = evidence.pmid;

      if (pmid) {
        // Initialize the entry for the given pmid if it doesn't exist
        if (!MechanismEvidenceObj[pmid]) {
          MechanismEvidenceObj[pmid] = {
            description: evidence.description,
            evidence_types: {},
          };
        }

        // Iterate over the evidence_types array
        evidence.evidence_types.forEach((evidenceType) => {
          const primaryType = evidenceType.primary_type;
          const secondaryTypes = evidenceType.secondary_type;

          if (!MechanismEvidenceObj[pmid].evidence_types[primaryType]) {
            MechanismEvidenceObj[pmid].evidence_types[primaryType] = [];
          }

          // Add the secondary types to the array
          MechanismEvidenceObj[pmid].evidence_types[primaryType].push(
            ...secondaryTypes
          );
        });
      }
    });
  }

  //cleaning the disease name
  let prefix_to_remove = deprepare_input.locus + "-related";
  let disease_name = deprepare_input.disease.disease_name.replace(
    prefix_to_remove,
    ""
  );

  return {
    locus: deprepare_input.locus,
    publications: publicationsObj,
    phenotypes: phenotypesObj,
    allelic_requirement: deprepare_input.allelic_requirement,
    cross_cutting_modifier: deprepare_input.cross_cutting_modifier,
    session_name: deprepare_input.session_name,
    variant_types: variantTypesObj,
    variant_descriptions: variantDescObj,
    variant_consequences: DeConstructJSONWithVariantCon(
      deprepare_input.variant_consequences
    ),
    molecular_mechanism: MechanismNameObj,
    mechanism_synopsis: MechanismSynopsisObj,
    mechanism_evidence: MechanismEvidenceObj,
    disease: {
      disease_name: disease_name,
      cross_references: deprepare_input.disease.cross_references,
    },
    panels: deprepare_input.panels,
    confidence: {
      justification: deprepare_input.confidence.justification,
      level: deprepare_input.confidence.level,
    },
  };
};
