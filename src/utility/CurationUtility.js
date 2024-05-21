export const filterPhenotypes = (input) => {
  let filteredInput = { ...input };
  filteredInput.phenotypes = filteredInput.phenotypes.filter(
    (inputItem) => inputItem.summary !== ""
  );
  return filteredInput;
};

export const filterMechanismEvidence = (input) => {
  let filteredInput = { ...input };
  for (
    let index = 0;
    index < filteredInput.mechanism_evidence.length;
    index++
  ) {
    filteredInput.mechanism_evidence[index].evidence_types =
      filteredInput.mechanism_evidence[index].evidence_types.filter(
        (evidenceTypeItem) => evidenceTypeItem.secondary_type.length > 0
      );
  }
  filteredInput.mechanism_evidence = filteredInput.mechanism_evidence.filter(
    (inputItem) =>
      inputItem.description !== "" || inputItem.evidence_types.length > 0
  );
  return filteredInput;
};
