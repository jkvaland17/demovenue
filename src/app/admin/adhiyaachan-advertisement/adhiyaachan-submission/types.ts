interface HorizontalWiseVacancy {
  category: string;
  numberOfVacancy: number;
  gender: string;
}

interface SeatDetailsCategoryWise {
  category: string;
  numberOfVacancy: number;
  gender: string;
}

interface ProfessionalEducation {
  isPGDCARequired: boolean;
  isOLevelRequired: boolean;
  isBCertificateRequired: boolean;
  isNationArmyRequired: boolean;
}

interface CategoryWiseVacancy {
  category: string;
  numberOfVacancy: number;
  gender: "";
}

export interface Sport {
  sportIds: string;
  subsport: string;
  position: string;
  isCategoryWise: boolean;
  categoryWiseVacancy: CategoryWiseVacancy[];
  isHorizontalCategoryWise: boolean;
  horizontalWiseVacancy: HorizontalWiseVacancy[];
  sportsLevel: number;
}

export interface PostData {
  post: string;
  cadre: string;
  payScale: string;
  groupClassification: string;
  recruitmentYear: string;
  pensionable: boolean;
  typingTest: boolean;
  pst: boolean;
  writtenExamAndInterview: boolean;
  onlyWrittenExam: boolean;
  onlyInterview: boolean;

  ageRelaxation: {
    category: string;
    age: string;
    gender: string;
  }[];
  qualification: string;
  gender: string;
  course: string;
  isSportsWiseCategory: boolean;
  isHorizontalCategoryWise: boolean;
  horizontalWiseVacancy: HorizontalWiseVacancy[];
  seatDetailsCategoryWise: SeatDetailsCategoryWise[];
  professionalEducation: ProfessionalEducation;
  minimumMaleAge: string;
  maximumMaleAge: string;
  minimumFeMaleAge: string;
  maximumFeMaleAge: string;

  sports: Sport[];
  categoryWiseSeats?: {
    isCategoryWiseVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
  };
  sportWiseSeats?: {
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isSportsWiseVacncy: boolean;
  };
}

interface PostDetails {
  [key: string]: {
    male: number;
    female: number;
    total: number;
  };
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface AdhiyaanchanFormValues {
  postData: PostData[];
  postDataIds: string[];
  title: string;
  referenceNumber: string;
  description: string;
  dateOfReceived: string;
  stage: string;
  status: string;
  course?: string;
  cadre?: string;
  post?: string;
  file?: FileMetadata[];
  attachments?: FileMetadata[];
  minimum?: string;
  minimumAge?: string;
  maximumAge?: string;
  professionalEducation?: ProfessionalEducation;
  applicationBeginDate?: string;
  lastDateForApplyOnline?: string;
  lastDatePayExamFee?: string;
  correctionModifiedFormDate?: string;
  examDate?: string;
  admitCardAvailableDate?: string;
  departments_To_Sent?: string;
  postDetails?: PostDetails;
  dateOfRecevied?: string;

  // New keys added
  type: string;
  payScale: string;
  appointingAuthorityName: string;
  serviceCategory: string;
  onlyInterview: boolean;
  onlyWrittenExam: boolean;
  writtenExamAndInterview: boolean;
  pst: boolean;
  typingTest: boolean;
  pensionable: boolean;
  probationPeriod: string;
}

export interface PostDataType {
  post: string;
  cadre: string;
  qualification: string;
  gender: string;
  course: string;
  isSportsWiseCategory: boolean;
  isHorizontalCategoryWise: boolean;
  horizontalWiseVacancy: {
    category: string;
    numberOfVacancy: number;
    gender?: string;
  }[];
  seatDetailsCategoryWise: {
    category: string;
    numberOfVacancy: number;
    gender: string;
  }[];
  professionalEducation: {
    isPGDCARequired: boolean;
    isOLevelRequired: boolean;
    isBCertificateRequired: boolean;
    isNationArmyRequired: boolean;
  };
  minimumAge: string;
  maximumAge: string;
  sports: {
    sportIds: string;
    isCategoryWise: boolean;
    categoryWiseVacancy: {
      category: string;
      numberOfVacancy: number;
      gender: string;
    }[];
    isHorizontalCategoryWise: boolean;
    horizontalWiseVacancy: { category: string; numberOfVacancy: number }[];
    sportsLevel: number;
  }[];
}

export type SportWiseSeatsType = {
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isSportsWiseVacncy: boolean;
};

export type CategoryWiseSeatsType = {
  isCategoryWiseVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
};

export enum MasterCode {
  Categories = "categories",
  HorizontalCategory = "Horizontal-Category",
  Gender = "gender",
  Education = "education",
  Post = "post",
  Cader = "Cader",
  Course = "Course",
  Sport = "sport",
  SubSports = "subSports",
  Position = "position",
  Advertisement = "Advertisement",
  ExamType = "ExamType",
  GroupClassification = "GroupClassification",
  Zone = "zone",
}

export interface ExistingFile {
  name: string;
  url: string;
  type: string;
  size: number;
  lastModified: number;
}
