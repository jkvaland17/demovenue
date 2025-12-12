export const columns1 = [
  { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
  { title: "Eligibility List Serial No.", key: "eligibilityListSerialNo" },
  { title: "Rank", key: "rank" },
  { title: "Employee Name", key: "employeeName1" },
  { title: "Father's Name", key: "fatherName1" },
  { title: "PNO No.", key: "pnoNumber" },
  { title: "Current Posting", key: "currentPosting1" },
  { title: "Date of Birth", key: "dateOfBirth" },
  {
    title: "Date of Promotion to the Post of Head Constable",
    key: "promotionDate",
  },
  { title: "Date of Recruitment", key: "recruitmentDate" },
  {
    title: "Physical Efficiency Test Qualified/No Qualified",
    key: "physicalQualification",
  },
];

export const columns2 = [
  { title: "Serial No.", key: "serialNumber" },
  { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
  { title: "Employee Name", key: "employeeName" },
  { title: "Father's Name", key: "fatherName" },
  { title: "PNO No.", key: "pnoNumber" },
  { title: "Current Posting", key: "currentPosting" },
  { title: "Date of Birth", key: "dateOfBirth" },
  {
    title: "Date of Promotion to the Post of Head Constable",
    key: "promotionDate",
  },
  { title: "Date of Recruitment", key: "recruitmentDate" },
];

export const getColumns = (slug0: string) => {
  switch (slug0) {
    case "crRecieved":
      return columns2;
    default:
      return columns1;
  }
};
