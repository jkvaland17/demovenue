export interface AdvertisementFormData {
  // General Information
  course: string;
  newAdhiyaachanIds: string[];
  advertisementNumberInEnglish: string;
  advertisementNumberInHindi: string;
  documentVerificationStartDate: string;
  documentVerificationEndDate: string;
  titleInHindi: string;
  titleInEnglish: string;
  startDate: string;
  endDate: string;
  description: string;
  helpNumber: string;
  helpEmail: string;
  contactHours: string;
  releaseDate: string;
  updatedFiles?: File[];

  // File uploads
  pdfFileInHindi: File[];
  pdfFileInEnglish: File[];
  
  // Main Information
  mainInformation: MainInformation;
  
  // Important Dates
  importantDates: ImportantDates;
  
  // Application Fees
  applicationFees: ApplicationFee[];
  
  // Age Relaxation
  ageRelaxation: AgeRelaxation[];
}

export interface MainInformation {
  shortSummary: string;
  shortSummaryInHindi: string;
  extraNotes: string;
  extraNotesInHindi: string;
}

export interface ImportantDates {
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  lastDateForSubmissionOfApplicationFee: string;
  lastDateForSubmissionOfApplicationForm: string;
  extraNotes: string;
  extraNotesInHindi: string;
  writtenExamImportantDates: string;
  documentVerificationImportantDates: string;
  physicalEfficiencyTestImportantDates: string;
  typingTestImportantDates: string;
  admitCardReleaseDate: string;
}

export interface ApplicationFee {
  category: string;
  amount: number;
}

export interface AgeRelaxation {
  category: string;
  age: number;
}

// API Response Types
export interface AdvertisementApiResponse {
  data: AdvertisementData;
  message: string;
  error?: string;
}

export interface AdvertisementData {
  _id: string;
  course: string;
  newAdhiyaachanIds: string[];
  advertisementNumberInEnglish: string;
  advertisementNumberInHindi: string;
  documentVerificationStartDate: string;
  documentVerificationEndDate: string;
  titleInHindi: string;
  titleInEnglish: string;
  startDate: string;
  endDate: string;
  description: string;
  helpNumber: string;
  helpEmail: string;
  contactHours: string;
  releaseDate: string;
  pdfFileInHindi?: File;
  pdfFileInEnglish?: File;
  mainInformation?: MainInformation;
  importantDates?: ImportantDates;
  applicationFees: ApplicationFee[];
  ageRelaxation: AgeRelaxation[];
  createdAt: string;
  updatedAt: string;
}

// Vacancy Table Types - Updated to match VacancyTable component expectations
export interface VacancyItem {
  key: string;
  name: string;
  sports?: string;
  subsports?: string;
  position?: string;
  totalVacancy: number;
}

export interface VacancyTableData {
  total: number;
  result: VacancyItem[];
}

// Legacy interface for backward compatibility
export interface VacancyResult {
  _id: string;
  title: string;
  totalSeats: number;
  reservedSeats: number;
  generalSeats: number;
  category: string;
}

// Adhiyaachan Types
export interface AdhiyaachanItem {
  _id: string;
  title: string;
  course: string;
  description?: string;
  status?: string;
}

export interface AdhiyaachanListResponse {
  data: AdhiyaachanItem[];
  message: string;
  error?: string;
}

// Form Methods Type
export interface FormMethods {
  control: any;
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  reset: any;
  formState: {
    errors: any;
  };
}

// Component Props Types
export interface GeneralInfoProps {
  formMethods: FormMethods;
  uploadHindi: File[];
  setUploadHindi: (files: File[]) => void;
  setUploadEnglish: (files: File[]) => void;
  uploadEnglish: File[];
  handleChangeEnglish: (e: any) => void;
  handleChangeHindi: (e: any) => void;
}

export interface ImportantDatesProps {
  formMethods: FormMethods;
  validateHindi: (value: string | undefined) => boolean | string;
}

export interface ApplicationFeesProps {
  formMethods: FormMethods;
}

export interface AgeRelaxationDataProps {
  formMethods: FormMethods;
}

// Validation Types
export interface ValidationRules {
  required?: string | boolean;
  validate?: (value: any) => boolean | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
}

// File Upload Types
export interface FileUploadState {
  files: File[];
  previews: string[];
  loading: boolean;
  error: string | null;
}

// Master Data Types
export interface MasterDataItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
}

export interface MasterCode {
  Course: string;
  Categories: string;
  [key: string]: string;
}

// Error Handling Types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Loading States
export interface LoadingState {
  update: boolean;
  form: boolean;
  [key: string]: boolean;
} 