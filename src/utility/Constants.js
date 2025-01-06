export const CONFIDENCE_COLOR_MAP = {
  definitive: "#276749",
  strong: "#38a169",
  moderate: "#68d391",
  limited: "#fc8181",
  disputed: "#e53e3e",
  refuted: "#9b2c2c",
};

export const MAX_CHARACTERS = 800;

export const HELP_TEXT = {
  ALLELIC_REQUIREMENT:
    "Required genotype. G2P uses synonyms of the HPO mode of inheritance terminology, as many of the disorders described are de novo.",
  VARIANT_CONSEQUENCE:
    "The consequence of the reported variants on the protein (for protein-coding genes) or the RNA (for non-protein coding genes), per allele.",
  VARIANT_TYPE:
    "The types of variants associated with the curated gene-disease pair reported in the publication",
  MECHANISM:
    "The molecular mechanisms underlying gene-disease association  Derived from Badonyi & Marsh.",
  CONFIDENCE: "Confidence the association is real, based on available evidence",
  CROSS_CUTTING_MODIFIER:
    "Additional information reported in the publication that is relevant to the gene-disease inheritance",
  CATEGORIZATION:
    "More detailed synopsis of molecular mechanism, where available",
  PHENOTYPIC_FEATURE: "Phenotypic features reported in the publication",
  G2P_ID: "The unique stable identifier for this record in G2P",
  EXTERNAL_LINKS: "Information for this gene in other resources",
  CROSS_REFERENCES: "Ontology/ OMIM terms related to this disease record",
};
