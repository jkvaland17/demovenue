export interface ApiItem {
    _id: string;
    labelId: string;
    code: string;
    name: string;
    description: string;
    isHOD: boolean;
    status: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
    __v: number;
  }
  
  export interface QuickAccessCard {
    id: number;
    iconColor: string;
    icon: string;
    title: string;
    description: string;
    link: string;
}
  
export interface Advertisement {
  _id: string;
  value: string;
  description: string;
  startDate: string;
  endDate: string;
  advertisementLink?: string;
  prospectusLink?: string;
  status: boolean;
  interviewStatus: boolean;
  screeningStatus: boolean;
  advertisement?: string;
  question?: string;
  answer?: string;
}

export interface ApiResponse<T> {
  data?: T | null;
  error?: any;
  func?: null;
}

export interface CategoryData {
  _id: string;
}

export interface formData {
  value: string;
  description: string;
  startDate?: string;
  endDate?: string;
  prospectusLink?: string;
  masterCategoryId: string;
  advertisementLink?: string;
  parentMasterId?: string;
  formTemplate?: string;
  courseId?: string;
  status: boolean;
  name?: string;

}

export interface CombinedProps {
  title: string;
  apiCode: string;
  route: string;
}

export interface LoadingState {
  advertisementLink: boolean;
  prospectusLink: boolean;
}