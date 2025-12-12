const commonColumns = [
  { title: "Registration ID", key: "candidateId" },
  { title: "Full name", key: "fullName" },
  { title: "Sports", key: "sports" },
  { title: "Sub-Sports", key: "subSports" },
  { title: "State", key: "state" },
  { title: "Gender", key: "gender" },
  { title: "Status", key: "scuritnyStatus" },
  { title: "Actions", key: "action" },
];

const withDVRollNumber = (columns: any[]) => [
  { title: "DV Roll Number", key: "scrutinyRollNo" },
  ...columns,
];

const candidateLevelColumnDecider: any = {
  applicationsScrutinized: withDVRollNumber(commonColumns),
  candidatesRegisteredApplied: withDVRollNumber(commonColumns),
  applicantsFoundFit: withDVRollNumber(commonColumns),
  applicantsFoundUnfit: withDVRollNumber(commonColumns),
  admitCardRelease: withDVRollNumber(commonColumns),
  documentVerification: withDVRollNumber(commonColumns),
  candidatesEligibleTrial: withDVRollNumber(commonColumns),
  trialDate: withDVRollNumber(commonColumns),
  shortlistedCandidatesTrial: commonColumns,
  documentMarking: commonColumns,
  candidatesVerifiedAuthority: commonColumns,
  selectedCandidatesExam: commonColumns,
};

export { candidateLevelColumnDecider };
