const commonColumns = [
  { title: "Sr. No.", key: "srNo" },
  { title: "Name of the Sports", key: "sportsName" },
  { title: "Sports Code", key: "sportsCode" },
  { title: "No of Vacancies", key: "noOfVacancies" },
];

const candidateRegisterdAppliedColumn = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  { title: "Application Scrutinized", key: "totalScrutiny" },
  { title: "Found Fit", key: "foundFit" },
  { title: "Found Unfit", key: "foundUnfit" },
  { title: "Scrutiny Pending", key: "pendingScrutinyCount" },
  { title: "Admit Card Release", key: "admitCardRelease" },
  { title: "Document Verification", key: "documentVerification" },
  { title: "Eligible for Trial", key: "eligibleForTrial" },
  {
    title: "Shortlisted Candidates After Trial",
    key: "shortlistedCount",
  },
  {
    title: "Sports Certificate Marking",
    key: "markCommitteeCount",
  },
  { title: "Selected Candidates", key: "selectedCandidatesCount" },
  { title: "Verified Candidate", key: "sportCertificatesVerifiedCount" },
  { title: "Action", key: "action" },
];

const scrutinyColumns = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  { title: "Application Scrutinized", key: "totalScrutiny" },
  { title: "Found Fit", key: "foundFit" },
  { title: "Found Unfit", key: "foundUnfit" },
  { title: "Scrutiny Pending", key: "pendingScrutinyCount" },
];

const applicantsFoundFitColumns = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  { title: "Application Scrutinized", key: "totalScrutiny" },
  { title: "Found Fit", key: "foundFit" },
];

const applicantsFoundUnfitColumns = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  { title: "Application Scrutinized", key: "totalScrutiny" },
  { title: "Found Unfit", key: "foundUnfit" },
];

const admitCardRelease = [
  ...commonColumns,
  { title: "Found Fit", key: "foundFit" },
  { title: "Venue Name", key: "venueName" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "Admit Card Released", key: "admitCardReleased" },
  { title: "Pending Count", key: "pendingCount" },
  { title: "Status", key: "admitCardReleasedStatus" },
  { title: "Action", key: "action" },
];

const documentVerification = [
  ...commonColumns,
  { title: "Admit Card Release Count", key: "admitCardReleased" },
  { title: "Eligible Candidates", key: "eligibleCandidates" },
  { title: "Ineligible Candidates", key: "inEligibleCandidates" },
  { title: "Document Verification Pending", key: "pendingDvCandidates" },
  { title: "Action", key: "action" },
];

const totalCandidateEligibleForTrial = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  { title: "Male Candidate", key: "maleCandidate" },
  { title: "Female Candidate", key: "femaleCandidate" },
  { title: "Venue Name", key: "venueName" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "Admit Card Released", key: "admitCardRelease" },
  { title: "Pending Count", key: "pendingCount" },
  { title: "Status", key: "status" },
  { title: "Application Scrutinized", key: "totalScrutiny" },
  { title: "Found Unfit", key: "foundUnfit" },
];

const trialDate = [
  ...commonColumns,
  {
    title: "Eligible candidate Count in Document Verification",
    key: "eligibleCandidates",
  },
  { title: "Venue Name", key: "venueName" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "Trial Completed Count", key: "trialCompletedCount" },
  { title: "Trial Pending Count", key: "trialPendingCount" },
];

const shortlistedCandidateAfterTrial = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  {
    title: "Shortlisted Candidates after trial(More than 50 Marks)",
    key: "shortlistedCount",
  },
];

const markingOnSportsCertificate = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  {
    title: "Final Count of 20 Mark Committee",
    key: "markCommitteeCount",
  },
];

const totalCandidateVerifiedbyCertifiedIssuingAuthority = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  {
    title: "Final Count of Sports Certificates Verified Candidates",
    key: "sportCertificatesVerifiedCount",
  },
];

const SelectedCandidateInExamination = [
  ...commonColumns,
  { title: "No of Applicants", key: "totalApplicants" },
  {
    title: "Final Count of Selected Candidates",
    key: "selectedCandidatesCount",
  },
];

const ColumnDecider: any = {
  applicationsScrutinized: scrutinyColumns,
  candidatesRegisteredApplied: candidateRegisterdAppliedColumn,
  applicantsFoundFit: applicantsFoundFitColumns,
  applicantsFoundUnfit: applicantsFoundUnfitColumns,
  admitCardRelease: admitCardRelease,
  documentVerification: documentVerification,
  candidatesEligibleTrial: totalCandidateEligibleForTrial,
  trialDate: trialDate,
  shortlistedCandidatesTrial: shortlistedCandidateAfterTrial,
  documentMarking: markingOnSportsCertificate,
  candidatesVerifiedAuthority:
    totalCandidateVerifiedbyCertifiedIssuingAuthority,
  selectedCandidatesExam: SelectedCandidateInExamination,
};

export { ColumnDecider };
