export interface FormType {
  userType: string;
  parentId?: string;
  orgId?: string;
  orgUserId?: string;
  candidateId: number;
  name: string;
  regNo: string;
  phone: number;
  email: string;
  dob?: string;
  profileImage?: string;
  city?: string;
  gender?: string;
  presentAddress?: string;
  permanentAddress?: string;
  postalCode?: number;
  country?: string;
  password: string;
  isMainAdmin: boolean;
  otpStatus: boolean;
  status: boolean;
}
