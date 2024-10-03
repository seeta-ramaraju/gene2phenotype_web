export const getEvidenceTypes = (evidenceObj) => {
  let evidenceTypes = [];
  Object.values(evidenceObj).forEach((value) => {
    evidenceTypes = evidenceTypes.concat(value);
  });
  return evidenceTypes;
};
