"use server";
import DataService from "@/services/requestApi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./AuthOption";

async function generateServerAction(func, token, ...args) {
  const responseObj = {
    data: null,
    error: null,
    func: null,
  };

  try {
    responseObj.func = func.toString();
    let response;
    if (token) {
      const userAccessToken = await getServerSession(authOptions);
      const session = userAccessToken.user.token;

      if (session) {
        if (args.length) {
          response = await func(...args, session);
        } else {
          response = await func(session);
        }
      }
    } else {
      response = await func(...args);
    }

    if (response) {
      responseObj.data = response.data;
    }
  } catch (error) {
    responseObj.error = error.response?.data?.message || error.message;
  }
  return responseObj;
}

export const CallUpdateAdminPassword = (data) =>
  generateServerAction(DataService.UpdateAdminPassword, true, data);

export const CallFindAllAdmin = (data) =>
  generateServerAction(DataService.FindAllAdmin, true, data);
export const CallSendOtp = (data) =>
  generateServerAction(DataService.GetSendOtp, false, data);

export const CallVerifyOtp = (data) =>
  generateServerAction(DataService.VerifyOTP, false, data);

export const CallFindSubAdminByAdminId = () =>
  generateServerAction(DataService.FindSubAdminByAdminId, true);

// export const CallCreateAdmin = (formdata) =>
//   generateServerAction(DataService.CreateAdmin, true, formdata);

// export const CallUpdateAdmin = (id, formdata) =>
//   generateServerAction(DataService.UpdateAdmin, true, id, formdata);

export const CallUpdateApplication = (id, formdata) =>
  generateServerAction(DataService.UpdateApplication, true, id, formdata);

export const CallFilterAdmin = (data) =>
  generateServerAction(DataService.FilterAdmin, true, data);

export const CallCreateMaster = (data) =>
  generateServerAction(DataService.CreateMaster, true, data);

export const CallFindAllAdvertisement = (id) =>
  generateServerAction(DataService.FindAllAdvertisement, false, id);

export const CallFindMaterByType = (type) =>
  generateServerAction(DataService.FindMaterByType, true, type);

export const CallFindMastersByParentId = (id) =>
  generateServerAction(DataService.FindMastersByParentId, true, id);

export const CallFindAllPermissions = () =>
  generateServerAction(DataService.FindAllPermissions, true);

export const CallCreateAdminPermission = (data) =>
  generateServerAction(DataService.CreateAdminPermission, true, data);

export const CallAutoGenAdmitCard = (data) =>
  generateServerAction(DataService.AutoGenAdmitCard, true, data);

export const CallFindPermissionByPermissionType = (id) =>
  generateServerAction(DataService.FindPermissionByPermissionType, true, id);

export const CallFindMasterByPermissionType = (id) =>
  generateServerAction(DataService.FindMasterByPermissionType, true, id);

export const CallFindPermissionByAdminId = (id) =>
  generateServerAction(DataService.FindPermissionByAdminId, true, id);

export const CallFindAllSubAdminByDepartment = (id) =>
  generateServerAction(DataService.FindAllSubAdminByDepartment, true, id);

export const CallCreateSubAdmin = (data) =>
  generateServerAction(DataService.FindAllAdmin, true, data);

export const CallFindAllUsers = (data) =>
  generateServerAction(DataService.FindAllUsers, true, data);

export const CallFindAllApplications = (data) =>
  generateServerAction(DataService.FindAllApplications, true, data);

export const CallFindScrutinyData = (data) =>
  generateServerAction(DataService.FindScrutinyData, true, data);

export const CallFindVerificationDocumentList = (data) =>
  generateServerAction(DataService.FindVerificationDocumentList, true, data);

export const CallSocialMediaLogin = (data) =>
  generateServerAction(DataService.SocialMediaLogin, true, data);

export const CallCreateUser = (data) =>
  generateServerAction(DataService.CreateMaster, true, data);

export const CallDownloadExcels = (data) =>
  generateServerAction(DataService.GetDownloadApplicationExcel, true, data);

export const CallUpdateUser = (id, data) =>
  generateServerAction(DataService.FindMaterByType, true, id, data);

export const CallCreateQualificationExperience = (data) =>
  generateServerAction(DataService.CreateQualificationExperience, true, data);

export const CallGetUserByUserId = (id) =>
  generateServerAction(DataService.GetUserByUserId, true, id);

export const CallGetApplicationById = (id) =>
  generateServerAction(DataService.GetApplicationById, true, id);

export const CallFindSpecialityByAdvertisementId = (id) =>
  generateServerAction(DataService.FindSpecialityByAdvertisementId, true, id);

export const CallGetDepartmentbyPermissionType = (id) =>
  generateServerAction(DataService.GetDepartmentbyPermissionType, true, id);

export const CallGetPermissionsByPermissionType = (id) =>
  generateServerAction(DataService.GetPermissionsByPermissionType, true, id);

export const CallFindUserByDeparment = () =>
  generateServerAction(DataService.FindUserByDeparment, true);

export const CallFindUserApplication = (data) =>
  generateServerAction(DataService.FindUserApplication, true, data);

export const CallCreateQuestion = (data) =>
  generateServerAction(DataService.CreateQuestion, true, data);

export const CallFindAllQuestion = (data) =>
  generateServerAction(DataService.FindAllQuestion, true, data);

export const CallFindAllQuery = (data) =>
  generateServerAction(DataService.FindAllQuery, true, data);

export const CallFindQueryById = (id) =>
  generateServerAction(DataService.FindQueryById, true, id);

// Notification
export const CallGetAllNotification = () =>
  generateServerAction(DataService.GetAllNotification, true);

export const CallNotificationById = (id) =>
  generateServerAction(DataService.GetNotificationById, true, id);

export const CallCreateNotification = (data) =>
  generateServerAction(DataService.CreateNotification, true, data);
export const CallDeleteNotification = (data) =>
  generateServerAction(DataService.DeleteNotification, true, data);
// Inbox
export const CallGetAllInbox = () =>
  generateServerAction(DataService.GetAllInbox, true);
export const CallFindUserConversation = (data) =>
  generateServerAction(DataService.FindUserConversation, true, data);

// Ticket
export const CallGetAllTicket = () =>
  generateServerAction(DataService.GetAllTicket, true);

export const CallTicketById = (id) =>
  generateServerAction(DataService.GetTicketById, true, id);

export const CallUpdateTicket = (id) =>
  generateServerAction(DataService.PatchTicket, true, id);

// Queries

export const CallGetAllQueriesTicket = (data) =>
  generateServerAction(DataService.GetAllQueriesTicket, true, data);

export const CallFindAllQueryV2 = (data) =>
  generateServerAction(DataService.FindAllQueryV2, true, data);

export const CallQueriesById = (id) =>
  generateServerAction(DataService.GetQueryById, true, id);

export const CallUpdateQuery = (id) =>
  generateServerAction(DataService.PatchQuery, true, id);
// Advertisement

export const CallCreateAdvertisement = (data) =>
  generateServerAction(DataService.CreateAdvertisement, true, data);

// export const CallGetAllAdvertisement = () =>
//   generateServerAction(DataService.GetAllAdvertisement, true);

export const CallUpdateAdvertisement = (id, data) =>
  generateServerAction(DataService.UpdateAdvertisement, true, id, data);

export const CallGetSpecialityByAdvertisementId = (id) =>
  generateServerAction(DataService.GetSpecialityByAdvertisementId, true, id);

export const CallAssignSpecialityByAdvertisementId = (id, data) =>
  generateServerAction(
    DataService.AssignSpecialityByAdvertisementId,
    true,
    id,
    data,
  );

export const CallGetAllPostApplied = (idA, idD) =>
  generateServerAction(DataService.GetAllPostApplied, true, idA, idD);

export const CallPWBDList = () =>
  generateServerAction(DataService.GetPWBDList, true);

export const CallCreatePostApplied = (data) =>
  generateServerAction(DataService.CreatePostApplied, true, data);

export const CallGetPostAppliedById = (id) =>
  generateServerAction(DataService.GetPostAppliedById, true, id);

export const CallUpdatePostApplied = (id, data) =>
  generateServerAction(DataService.UpdatePostApplied, true, id, data);

// Departement

export const CallCreateDepartment = (data) =>
  generateServerAction(DataService.CreateDepartment, true, data);

export const CallGetAllDepartment = () =>
  generateServerAction(DataService.GetAllDepartment, true);

export const CallUpdateDepartment = (id, data) =>
  generateServerAction(DataService.UpdateDepartment, true, id, data);

// Global SuperSpeciality

export const CallCreateMasterSuperSpeciality = (data) =>
  generateServerAction(DataService.CreateMasterSuperSpeciality, true, data);

export const CallGetAllMasterSuperSpecialities = () =>
  generateServerAction(DataService.GetAllMasterSuperSpecialities, true);

export const CallUpdateMasterSuperSpeciality = (id, data) =>
  generateServerAction(DataService.UpdateMasterSuperSpeciality, true, id, data);

// Global Category

export const CallCreateMasterCategory = (data) =>
  generateServerAction(DataService.CreateMasterCategory, true, data);

export const CallGetAllMasterCategory = () =>
  generateServerAction(DataService.GetAllMasterCategory, true);

export const CallUpdateMasterCategory = (id, data) =>
  generateServerAction(DataService.UpdateMasterCategory, true, id, data);

// Topic

export const CallFindAllTopics = () =>
  generateServerAction(DataService.FindAllTopics, true);

export const CallCreateTopic = (data) =>
  generateServerAction(DataService.CreateTopic, true, data);

export const CallFindTopicsByPost = (id) =>
  generateServerAction(DataService.FindTopicsByPost, true, id);

export const CallUpdateTopic = (id, data) =>
  generateServerAction(DataService.UpdateTopic, true, id, data);

// ExamCenters

export const CallFindAllExamCenters = () =>
  generateServerAction(DataService.FindAllExamCenters, true);

export const CallCreateExamCenter = (data) =>
  generateServerAction(DataService.CreateExamCenter, true, data);

export const CallFindExamCenterById = (id) =>
  generateServerAction(DataService.FindExamCenterById, true, id);

export const CallUpdateExamCenters = (id, data) =>
  generateServerAction(DataService.UpdateExamCenters, true, id, data);

export const CallUploadExcelData = (data, id) =>
  generateServerAction(DataService.UploadExcelData, true, data, id);

export const CallUpdateScreeningDetail = (data, id) =>
  generateServerAction(DataService.UpdateScreeningDetail, true, data, id);

// Fee
export const CallCreateFeeStructure = (data) =>
  generateServerAction(DataService.CreateFeeStructure, true, data);

export const CallAllFeeStructure = () =>
  generateServerAction(DataService.AllFeeStructure, true);

export const CallUpdateFeeStructure = (data, id) =>
  generateServerAction(DataService.UpdateFeeStructure, true, data, id);

// Categories
export const CallGetAllCategories = () =>
  generateServerAction(DataService.GetAllCategories, true);

export const CallGetCategoriesId = (id) =>
  generateServerAction(DataService.GetCategoriesId, true, id);

export const CallCreateCategories = (data) =>
  generateServerAction(DataService.CreateCategories, true, data);

// Data
export const CallGetAllCategoriesData = () =>
  generateServerAction(DataService.GetAllCategoriesData, true);

export const CallGetAllCategoriesDataId = (data) =>
  generateServerAction(DataService.GetAllCategoriesDataId, true, data);

export const CallCreateCategoriesData = (data) =>
  generateServerAction(DataService.CreateCategoriesData, true, data);

// Admin

export const CallGetAllUserType = () =>
  generateServerAction(DataService.GetAllUserType, true);

export const CallCreateAdmin = (data) =>
  generateServerAction(DataService.CreateAdmin, true, data);

export const CallUploadExcel = (data) =>
  generateServerAction(DataService.UploadExcel, true, data);

export const CallUpdateAdmin = (data, id) =>
  generateServerAction(DataService.UpdateAdmin, true, data, id);

export const CallUserByType = (id) =>
  generateServerAction(DataService.UserByType, true, id);

export const CallGetAllAdmin = () =>
  generateServerAction(DataService.GetAllAdmin, true);

export const CallGetSubAdmin = (id, type) =>
  generateServerAction(DataService.GetSubAdmin, true, id, type);

export const CallgetAllCategory = (id) =>
  generateServerAction(DataService.getAllCategory, true, id);

export const CallGetAllCategoryByType = (type) =>
  generateServerAction(DataService.getAllCategoryByType, true, type);

export const CallGetAllSpecialtiesId = (id) =>
  generateServerAction(DataService.GetAllSpecialtiesId, true, id);

export const CallGetOrgAdmins = () =>
  generateServerAction(DataService.GetOrgAdmins, true);

export const CallAssignApplication = (data) =>
  generateServerAction(DataService.AssignApplication, true, data);

export const CallCellMasterData = (cId, pId, val) =>
  generateServerAction(DataService.cellMasterData, true, cId, pId, val);

export const CallAllPositions = () =>
  generateServerAction(DataService.callPositions, true);

export const CallPlatformToken = (data) =>
  generateServerAction(DataService.PlatformToken, false, data);

export const CallGetAllSms = () =>
  generateServerAction(DataService.GetAllSms, true);

export const CallFindCategory = (aid, id, pwbd) =>
  generateServerAction(DataService.FindCategory, true, aid, id, pwbd);

export const CallGetAllState = () =>
  generateServerAction(DataService.GetAllState, true);

export const CallFindRequiredEducation = (aid, id) =>
  generateServerAction(DataService.FindRequiredEducation, true, aid, id);

export const CallGetAdvertisement = () =>
  generateServerAction(DataService.GetAdvertisement, true);

export const CallPostAppliedBySpecialityId = (id, advertisementId) =>
  generateServerAction(
    DataService.GetPostAppliedBySpecialityId,
    true,
    id,
    advertisementId,
  );
export const CallPreferredDepartementList = (id) =>
  generateServerAction(DataService.GetPreferredDepartementList, true, id);

export const CallAllTransition = (data) =>
  generateServerAction(DataService.AllTransition, true, data);

export const CallVerifyTransaction = (data) =>
  generateServerAction(DataService.VerifyTransaction, true, data);

export const CallUpdateVerificationStatus = (data) =>
  generateServerAction(DataService.UpdateVerificationStatus, true, data);

export const CallGetTransactionExcelHeaders = (data) =>
  generateServerAction(DataService.GetTransactionExcelHeaders, true, data);

export const CallCreateJobQueue = (data) =>
  generateServerAction(DataService.CreateJobQueue, true, data);

export const CallUpdateScrutinyStatus = (data) =>
  generateServerAction(DataService.UpdateScrutinyStatus, true, data);

export const CallCreateTempUserByExcel = (data) =>
  generateServerAction(DataService.CreateTempUserByExcel, true, data);

export const CallUploadAdmitCardExcel = (data) =>
  generateServerAction(DataService.UploadAdmitCardExcel, true, data);

export const CallGetAllCourses = (data) =>
  generateServerAction(DataService.GetAllCourses, true, data);
export const CallGetAdvByCourse = (data) =>
  generateServerAction(DataService.GetAdvByCourse, true, data);

export const CallGetAdmitCard = (data) =>
  generateServerAction(DataService.GetAdmitCard, true, data);
export const CallAdmitCardDownload = (data) =>
  generateServerAction(DataService.AdmitCardDownload, true, data);

export const CallGetAllotedCandidateData = (institute) =>
  generateServerAction(DataService.getAllotedCandidateData, true, institute);
export const CallUpdateInstituteAllotment = (id, data) =>
  generateServerAction(DataService.updateInstituteAllotment, true, id, data);

export const CallCountInstituteAllotmentByStatus = (data) =>
  generateServerAction(DataService.CountInstituteAllotmentByStatus, true, data);
export const CallFilterByAdvertisementAndStatus = (data) =>
  generateServerAction(DataService.FilterByAdvertisementAndStatus, true, data);

export const CallNotifyUserForAdmitCard = (data) =>
  generateServerAction(DataService.NotifyUserForAdmitCard, true, data);

export const CallAllInterviewPenal = (data) =>
  generateServerAction(DataService.AllInterviewPenal, true, data);

export const CallFindAllSubAdmin = (data) =>
  generateServerAction(DataService.FindAllSubAdmin, true, data);

export const CallCreateSubAdminCellHead = (data) =>
  generateServerAction(DataService.CreateSubAdminCellHead, true, data);

export const CallGetRoles = (data) =>
  generateServerAction(DataService.GetRoles, true, data);

export const CallCreateGroup = (data) =>
  generateServerAction(DataService.CreateGroup, true, data);

export const CallFindGroup = (id) =>
  generateServerAction(DataService.FindGroup, true, id);

export const CallFindAllInterviewPanel = () =>
  generateServerAction(DataService.findAllInterviewPanel, true);

export const CallFindApprovedApplications = (data) =>
  generateServerAction(DataService.FindApprovedApplications, true, data);

export const CallAllInterview = (data) =>
  generateServerAction(DataService.AllInterview, true, data);

export const CallAssignMultipleInterviews = (data) =>
  generateServerAction(DataService.AssignMultipleInterviews, true, data);

export const CallInterviewApplicationForMember = (params, data) =>
  generateServerAction(
    DataService.InterviewApplicationForMember,
    true,
    params,
    data,
  );

export const CallInterviewApplicationDataForMember = (id) =>
  generateServerAction(DataService.InterviewApplicationDataForMember, true, id);

export const CallUploadFile = (data) =>
  generateServerAction(DataService.UploadFile, true, data);
export const CallUpdateMasterData = (data) =>
  generateServerAction(DataService.UpdateMasterData, true, data);
export const CallCategoryByCode = (data) =>
  generateServerAction(DataService.MasterCategoryByCode, true, data);
export const CallCreateInterview = (data) =>
  generateServerAction(DataService.CreateInterview, true, data);

export const CallCreateMultipleInterview = (data) =>
  generateServerAction(DataService.CreateMultipleInterview, true, data);

export const CallInterviewForMember = (data) =>
  generateServerAction(DataService.InterviewForMember, true, data);

export const CallApplicationInterview = (data) =>
  generateServerAction(DataService.ApplicationInterview, true, data);

export const CallViewInterview = (data) =>
  generateServerAction(DataService.ViewInterview, true, data);

export const CallUpdateInterview = (data) =>
  generateServerAction(DataService.UpdateInterview, true, data);

export const CallUpdateInterviewStats = (data) =>
  generateServerAction(DataService.UpdateInterviewStats, true, data);

export const CallFindAllInterviewApplications = (data) =>
  generateServerAction(DataService.FindAllInterviewApplications, true, data);

export const CallCreateUserInterview = (data) =>
  generateServerAction(DataService.CreateUserInterview, true, data);

export const CallAllUserInterview = () =>
  generateServerAction(DataService.AllUserInterview, true);

export const CallAllUserInterviewById = (id) =>
  generateServerAction(DataService.AllUserInterviewById, true, id);

export const CallAllowInterviewStatesUpdate = (data) =>
  generateServerAction(DataService.AllowInterviewStatesUpdate, true, data);

export const CallAssignMultipleInterviewsUpdate = (data) =>
  generateServerAction(DataService.AssignMultipleInterviewsUpdate, true, data);

export const CallUpdateApplicationInterview = (data) =>
  generateServerAction(DataService.UpdateApplicationInterview, true, data);

export const CallAllScoreInterviewById = (id) =>
  generateServerAction(DataService.AllScoreInterviewById, true, id);
export const CallGetApplicationSummaryUrl = (id) =>
  generateServerAction(DataService.GetApplicationSummaryUrl, true, id);

export const CallRemoveInterviewMarks = (id) =>
  generateServerAction(DataService.RemoveInterviewMarks, true, id);

export const CallReAssignMultipleInterviews = (data) =>
  generateServerAction(DataService.ReAssignMultipleInterviews, true, data);

export const CallFindAllApplicationStats = (id) =>
  generateServerAction(DataService.FindAllApplicationStats, true, id);

export const CallFindTransactionsStats = (id) =>
  generateServerAction(DataService.FindTransactionsStats, true, id);

export const CallFindDocumentVerificationList = (id) =>
  generateServerAction(DataService.FindDocumentVerificationList, true, id);
export const CallFindDocumentVerificationById = (id) =>
  generateServerAction(DataService.FindDocumentVerificationById, true, id);
export const CallFindShortListingApplicationById = (id) =>
  generateServerAction(DataService.FindShortListingApplicationById, true, id);
export const CallUpdateDocumentRemarkAndStatus = (data) =>
  generateServerAction(DataService.UpdateDocumentRemarkAndStatus, true, data);
export const CallUpdateScreeningDetails = (data) =>
  generateServerAction(DataService.UpdateScreeningDetails, true, data);

export const CallFindAllSubmittedScoreInterviewById = (id) =>
  generateServerAction(
    DataService.FindAllSubmittedScoreInterviewById,
    true,
    id,
  );
export const CallFindScrutinyStats = (id) =>
  generateServerAction(DataService.FindScrutinyStats, true, id);

export const CallFindDepartmentListForInterview = (id) =>
  generateServerAction(DataService.FindDepartmentListForInterview, true, id);

export const CallLockAwardSheet = (data) =>
  generateServerAction(DataService.LockAwardSheet, true, data);

export const CallUnlockAwardSheet = (data) =>
  generateServerAction(DataService.UnlockAwardSheet, true, data);

export const CallScheduleMeeting = (data) =>
  generateServerAction(DataService.ScheduleMeeting, true, data);
export const CallChangeGroupIdInApplicationInterview = (data) =>
  generateServerAction(
    DataService.ChangeGroupIdInApplicationInterview,
    true,
    data,
  );

export const CallMasterData = (id) =>
  generateServerAction(DataService.MasterData, true, id);

export const CallCreAll = () => generateServerAction(DataService.CreAll, true);

export const CallCreCreate = (data) =>
  generateServerAction(DataService.CreCreate, true, data);

export const CallGetCreById = (id) =>
  generateServerAction(DataService.GetCreById, true, id);

export const CallUpdateCre = (id, data) =>
  generateServerAction(DataService.UpdateCre, true, id, data);

export const CallUpdateCreFinalSubmit = (id, data) =>
  generateServerAction(DataService.UpdateCreFinalSubmit, true, id, data);

export const CallFindShortListingApplication = (data) =>
  generateServerAction(DataService.FindShortListingApplication, true, data);

export const CallUpdateDocumentFinalStatus = (data) =>
  generateServerAction(DataService.updateDocumentFinalStatus, true, data);
export const CallUpdateScreeningFinalStatusByAdmin = (data) =>
  generateServerAction(
    DataService.updateScreeningFinalStatusByAdmin,
    true,
    data,
  );

export const CallUpdateInterviewDocumentStatus = (data) =>
  generateServerAction(DataService.updateInterviewDocumentStatus, true, data);

export const CallUpdateScreeningFinalStatus = (data) =>
  generateServerAction(DataService.updateScreeningFinalStatus, true, data);

export const CallUpdateInterviewApplicationStatus = (data) =>
  generateServerAction(
    DataService.updateInterviewApplicationStatus,
    true,
    data,
  );

export const CallFindApplicationScreeningList = (data) =>
  generateServerAction(DataService.findApplicationScreeningList, true, data);

export const CallFindApplicationScreeningById = (data) =>
  generateServerAction(DataService.findApplicationScreeningById, true, data);

export const CallUpdateDocumentScreening = (data) =>
  generateServerAction(DataService.updateDocumentScreening, true, data);

export const CallUpdateObjectiveScreening = (data) =>
  generateServerAction(DataService.updateObjectiveScreening, true, data);

export const CallUpdateObjectiveFinalStatus = (data) =>
  generateServerAction(DataService.updateObjectiveFinalStatus, true, data);

export const CallupdateScreeningFinalStatusByAdminFinal = (data) =>
  generateServerAction(
    DataService.updateScreeningFinalStatusByAdminFinal,
    true,
    data,
  );

export const CallFindAllMeetings = (id) =>
  generateServerAction(DataService.FindAllMeetings, true, id);

export const CallFindApplicationScreening = (data) =>
  generateServerAction(DataService.FindApplicationScreeningList, true, data);

export const CallCreateMeeting = (data) =>
  generateServerAction(DataService.CreateMeeting, true, data);

export const CallAssignMeeting = (data) =>
  generateServerAction(DataService.AssignMeeting, true, data);
export const CallfinalSubmissionList = (data) =>
  generateServerAction(DataService.FinalSubmissionList, true, data);
export const CallUpdatefinalSubmission = (data) =>
  generateServerAction(DataService.UpdateFinalSubmission, true, data);
export const CallSendOTP = () =>
  generateServerAction(DataService.SendOTP, true);

export const CallfindAllCommittee = (data) =>
  generateServerAction(DataService.FindAllCommittee, true, data);

export const CallFindApplicationScreeningStats = (data) =>
  generateServerAction(DataService.findApplicationScreeningStats, true, data);

export const CallFindAllDepartmentForHOD = (data) =>
  generateServerAction(DataService.findAllDepartmentForHOD, true, data);
export const CallFindAllDepartmentForCellHead = (data) =>
  generateServerAction(DataService.findAllDepartmentForCellHead, true, data);
export const CallUploadInstituteData = (data) =>
  generateServerAction(DataService.uploadInstituteData, true, data);
export const CallUploadApplicationData = (data) =>
  generateServerAction(DataService.uploadApplicationData, true, data);

export const CallFindMeetingById = (id) =>
  generateServerAction(DataService.findMeetingById, true, id);

export const CallCandidateListByMeetingId = (params) =>
  generateServerAction(DataService.candidateListByMeetingId, true, params);

export const CallUpdateMeeting = (data) =>
  generateServerAction(DataService.updateMeeting, true, data);

export const CallNeedClarificationCandidateList = (params) =>
  generateServerAction(
    DataService.needClarificationCandidateList,
    true,
    params,
  );
export const CallSendCommitteeNoticeOtp = () =>
  generateServerAction(DataService.SendCommitteeNoticeOtp, true);

export const CallCreateCommittee = (data) =>
  generateServerAction(DataService.CreateCommittee, true, data);

export const CallFindCommitteeById = (data) =>
  generateServerAction(DataService.FindCommitteeById, true, data);

export const CallUploadHODeSignPdf = (data) =>
  generateServerAction(DataService.UploadHODeSignPdf, true, data);

export const CallSendScreeningOTP = (data) =>
  generateServerAction(DataService.SendScreeningOTP, true, data);

export const CallVerifyFinalSubmissionOtp = (data) =>
  generateServerAction(DataService.verifyFinalSubmissionOtp, true, data);

export const CallGetCommitteeMembers = (data) =>
  generateServerAction(DataService.getCommitteeMembers, true, data);

export const CallUpdateMeetingData = (data) =>
  generateServerAction(DataService.UpdateMeeting, true, data);

export const CallFinalSummaryCounts = (data) =>
  generateServerAction(DataService.FinalSummaryCounts, true, data);

export const CallFindCommitteeMembersList = (data) =>
  generateServerAction(DataService.FindCommitteeMembersList, true, data);

export const CallFindApplicationScreeningStatsByAdvertisementId = (data) =>
  generateServerAction(
    DataService.FindApplicationScreeningStatsByAdvertisementId,
    true,
    data,
  );

export const CallAllowDocumnetToReupload = (data) =>
  generateServerAction(DataService.allowDocumnetToReupload, true, data);

export const CallAllowObjectiveDocToReupload = (data) =>
  generateServerAction(DataService.allowObjectiveDocToReupload, true, data);

export const CallGetDocumentScreeningConditions = (id) =>
  generateServerAction(DataService.getDocumentScreeningConditions, true, id);

export const CallUploadInterviewHODExcel = (data) =>
  generateServerAction(DataService.UploadInterviewHODExcel, true, data);

export const CallUploadApplicationExcelForInterview = (data) =>
  generateServerAction(
    DataService.UploadApplicationExcelForInterview,
    true,
    data,
  );

export const CallUploadInterviewExcel = (data) =>
  generateServerAction(DataService.UploadInterviewExcel, true, data);

export const CallGetUserMeetingByUserId = () =>
  generateServerAction(DataService.GetUserMeetingByUserId, true);

export const CallGetScreeningTrailByAppId = (data) =>
  generateServerAction(DataService.GetScreeningTrailByAppId, true, data);

export const CallGetAllQueriesTicketRFQ = (data) =>
  generateServerAction(DataService.GetAllQueriesTicketRFQ, true, data);

export const CallQueriesByIdRFQ = (id) =>
  generateServerAction(DataService.GetQueryByIdRFQ, true, id);

export const CallUpdateQueryRFQ = (id) =>
  generateServerAction(DataService.PatchQueryRFQ, true, id);

export const CallScheduleRFQ = (id) =>
  generateServerAction(DataService.ScheduleRFQ, true, id);

export const CallGetScheduledRFQList = () =>
  generateServerAction(DataService.GetScheduledRFQList, true);

export const CallGetQueryCategoryList = () =>
  generateServerAction(DataService.getQueryCategoryList, true);

export const CallUpdateTempPass = (data) =>
  generateServerAction(DataService.UpdateTempPass, true, data);

export const CallAddInstituteAdmin = (data) =>
  generateServerAction(DataService.AddInstituteAdmin, true, data);

export const CallGetAllCounsellingInstitutes = () =>
  generateServerAction(DataService.getAllCounsellingInstitutes, true);

export const CallGetAllNotificationCandidate = (data) =>
  generateServerAction(DataService.GetAllNotificationCandidate, true, data);

export const CallAddNotification = (data) =>
  generateServerAction(DataService.AddNotification, true, data);

export const CallGetIdNotification = (data) =>
  generateServerAction(DataService.GetIdNotification, true, data);

export const CallUpdateNotification = (data) =>
  generateServerAction(DataService.UpdateNotification, true, data);

export const CallFindAdvertisementForHOD = (data) =>
  generateServerAction(DataService.findAdvertisementForHOD, true, data);

export const CallFindAllScoreCardStageOne = (data) =>
  generateServerAction(DataService.FindAllScoreCardStageOne, true, data);

export const CallCreateCommitteeByAdmin = (data) =>
  generateServerAction(DataService.CreateCommitteeByAdmin, true, data);

export const CallFindAllSubAdminAndHod = (data) =>
  generateServerAction(DataService.FindAllSubAdminAndHod, true, data);

export const CallCreateCounsellingByAdmin = (data) =>
  generateServerAction(DataService.CreateCounsellingByAdmin, true, data);

export const CallFindAllCounselling = () =>
  generateServerAction(DataService.FindAllCounselling, true);

export const CallDeleteCounselling = (data) =>
  generateServerAction(DataService.DeleteCounselling, true, data);

export const CallFindCounsellingbyId = (data) =>
  generateServerAction(DataService.FindCounsellingbyId, true, data);

export const CallGetStudentAllotmentStats = (data) =>
  generateServerAction(DataService.GetStudentAllotmentStats, true, data);

export const CallGetStudentAllotmentUsers = (data) =>
  generateServerAction(DataService.GetStudentAllotmentUsers, true, data);

export const CallGetAllotmentUserDetails = (data) =>
  generateServerAction(DataService.GetAllotmentUserDetails, true, data);

export const CallGetCounsellingApplicationData = (data) =>
  generateServerAction(DataService.GetCounsellingApplicationData, true, data);

export const CallGetInstituteWisePreference = (data) =>
  generateServerAction(DataService.GetInstituteWisePreference, true, data);

export const CallUpdateCounselling = (id, data) =>
  generateServerAction(DataService.UpdateCounselling, true, id, data);

export const CallUploadCounsellingInstitute = (id, data) =>
  generateServerAction(DataService.UploadCounsellingInstitute, true, id, data);

export const CallCreateInstituteAllotment = (data) =>
  generateServerAction(DataService.CreateInstituteAllotment, true, data);

export const CallGetOptionalChoice = (data) =>
  generateServerAction(DataService.GetOptionalChoice, true, data);

export const CallGetInstituteLastRound = (data) =>
  generateServerAction(DataService.GetInstituteLastRound, true, data);

export const CallGetInstituteAllotment = (data) =>
  generateServerAction(DataService.GetInstituteAllotment, true, data);

export const CallGetExcelTemplate = (data) =>
  generateServerAction(DataService.GetExcelTemplate, true, data);

export const CallCreateOptionalExercise = (id, data) =>
  generateServerAction(DataService.CreateOptionalExercise, true, id, data);

export const CallUploadCounsellingCandidate = (id, data) =>
  generateServerAction(DataService.UploadCounsellingCandidate, true, id, data);

export const CallAddMembersToCommittee = (data) =>
  generateServerAction(DataService.AddMembersToCommittee, true, data);

export const CallGetScreeningHeads = (data) =>
  generateServerAction(DataService.GetScreeningHeads, true, data);

export const CallGetFinalMembers = (data) =>
  generateServerAction(DataService.GetFinalMembers, true, data);

export const CallGetFindOneGroup = (data) =>
  generateServerAction(DataService.GetFindOneGroup, true, data);

export const CallUpdateCommitteeByAdmin = (data) =>
  generateServerAction(DataService.UpdateCommitteeByAdmin, true, data);

export const CallDetailedScreeningReport = (data) =>
  generateServerAction(DataService.DetailedScreeningReport, true, data);

export const CallSendScreeningHODMail = (data) =>
  generateServerAction(DataService.SendScreeningHODMail, true, data);

export const CallAdminLockScreening = (data) =>
  generateServerAction(DataService.adminLockScreening, true, data);

export const CallAdminUnlockScreening = (data) =>
  generateServerAction(DataService.adminUnlockScreening, true, data);

export const CallAddHeadsToCommittee = (data) =>
  generateServerAction(DataService.AddHeadsToCommittee, true, data);
export const CallFindGroupsByAdv = (data) =>
  generateServerAction(DataService.FindGroupsByAdv, true, data);
export const CallCheckTwoFactorStatus = (data) =>
  generateServerAction(DataService.CheckTwoFactorStatus, false, data);
export const CallVerifyTwoFactorStatus = (data) =>
  generateServerAction(DataService.VerifyTwoFactorStatus, false, data);

export const CallFindInterviewPanelOfAdmin = (params) =>
  generateServerAction(DataService.FindInterviewPanelOfAdmin, true, params);

export const CallFindApplicationInterviewByGroup = (params) =>
  generateServerAction(
    DataService.FindApplicationInterviewByGroup,
    true,
    params,
  );

export const CallFindApplicationInterviewById = (params) =>
  generateServerAction(DataService.findApplicationInterviewById, true, params);

export const CallCreateCommitteeInterview = (data) =>
  generateServerAction(DataService.CreateCommitteeInterview, true, data);

export const CallUpdateCommitteeInterview = (data) =>
  generateServerAction(DataService.UpdateCommitteeInterview, true, data);

export const CallSendAwardSheetOTP = (data) =>
  generateServerAction(DataService.SendAwardSheetOTP, true, data);

export const CallGetInterviewResult = (query) =>
  generateServerAction(DataService.GetInterviewResult, true, query);

export const CallCalculateInterviewResult = (data) =>
  generateServerAction(DataService.CalculateInterviewResult, true, data);
export const CallChairPersonSendOtpToMember = (data) =>
  generateServerAction(DataService.ChairPersonSendOtpToMember, true, data);
export const CallLockFinalAwardSheet = (data) =>
  generateServerAction(DataService.LockFinalAwardSheet, true, data);
export const CallGetAwardsheetStatus = (data) =>
  generateServerAction(DataService.GetAwardsheetStatus, true, data);

export const CallFindSeatsOfAdvertisements = (data) =>
  generateServerAction(DataService.FindSeatsOfAdvertisements, true, data);

export const CallUpdateWaitingList = (data) =>
  generateServerAction(DataService.UpdateWaitingList, true, data);

export const CallResendFinalAwardSheetOTP = (data) =>
  generateServerAction(DataService.ResendFinalAwardSheetOTP, true, data);

export const CallFindPositionByDepartment = (data) =>
  generateServerAction(DataService.FindPositionByDepartment, true, data);

export const CallGetCounsellingApplicationStatusSummary = (data) =>
  generateServerAction(
    DataService.GetCounsellingApplicationStatusSummary,
    true,
    data,
  );

export const CallGetUploadInstituteExcelErrors = (id, data) =>
  generateServerAction(
    DataService.GetUploadInstituteExcelErrors,
    true,
    id,
    data,
  );

export const CallGetUploadCandidatesExcelErrors = (id, data) =>
  generateServerAction(
    DataService.GetUploadCandidatesExcelErrors,
    true,
    id,
    data,
  );

export const CallAddSubjectExpert = (data) =>
  generateServerAction(DataService.AddSubjectExpert, true, data);

export const CallGetInterviewStatistics = (data) =>
  generateServerAction(DataService.GetInterviewStatistics, true, data);

export const CallGetInterviewStatsDepartmentWise = (data) =>
  generateServerAction(DataService.GetInterviewStatsDepartmentWise, true, data);

export const CallSend2FAOtp = (data) =>
  generateServerAction(DataService.Send2FAOtp, true, data);

export const CallUpdateInterviewGrade = (data) =>
  generateServerAction(DataService.UpdateInterviewGrade, true, data);

export const CallFindUpdatedGradeList = (data) =>
  generateServerAction(DataService.FindUpdatedGradeList, true, data);
export const CallUpdateMemberDetails = (data) =>
  generateServerAction(DataService.UpdateMemberDetails, true, data);
export const CallUpdateApplicationInterviewReports = (data) =>
  generateServerAction(
    DataService.UpdateApplicationInterviewReports,
    true,
    data,
  );
export const CallEnrollFace = (data) =>
  generateServerAction(DataService.EnrollFace, false, data);
export const CallFaceAuthenticate = (data) =>
  generateServerAction(DataService.FaceAuthenticate, false, data);

export const CallGetInstituteAllotmentData = (data) =>
  generateServerAction(DataService.GetInstituteAllotmentData, true, data);

export const CallGetAllInstituteAllotmentStats = (param) =>
  generateServerAction(DataService.GetAllInstituteAllotmentStats, true, param);

export const CallGetAdminById = (adminId) =>
  generateServerAction(DataService.GetAdminById, true, adminId);

export const CallFindAllInstitutesForNORCET = () =>
  generateServerAction(DataService.FindAllInstitutesForNORCET, true);

export const CallGetAllInstituteRoles = (param) =>
  generateServerAction(DataService.GetAllInstituteRoles, true, param);

export const CallCreateInstituteMembers = (data) =>
  generateServerAction(DataService.CreateInstituteMembers, true, data);

export const CallGetInstituteMembers = (data) =>
  generateServerAction(DataService.GetInstituteMembers, true, data);

export const CallGetDocumentsByInstituteAllotmentId = (id) =>
  generateServerAction(
    DataService.GetDocumentsByInstituteAllotmentId,
    true,
    id,
  );

export const CallMapCandidateDocuments = (data) =>
  generateServerAction(DataService.MapCandidateDocuments, true, data);

export const CallGetCandidateForMapping = (params) =>
  generateServerAction(DataService.GetCandidateForMapping, true, params);
export const CallCreateFaceSession = () =>
  generateServerAction(DataService.CreateFaceSession, false);
export const CallGetFaceSessionResult = (data) =>
  generateServerAction(DataService.GetFaceSessionResult, false, data);
export const CallUpdateInstituteDocStatus = (data) =>
  generateServerAction(DataService.UpdateInstituteDocStatus, true, data);
export const CallUpdateInstituteScreeningStatus = (data) =>
  generateServerAction(DataService.UpdateInstituteScreeningStatus, true, data);
export const CallSendInterviewCredentialMail = (data) =>
  generateServerAction(DataService.SendInterviewCredentialMail, true, data);
export const CallCreateInstituteScreeningSchedule = (data) =>
  generateServerAction(
    DataService.CreateInstituteScreeningSchedule,
    true,
    data,
  );

export const CallGetInstituteScreeningSchedule = () =>
  generateServerAction(DataService.GetInstituteScreeningSchedule, true);

export const CallRemoveGroupMember = (data) =>
  generateServerAction(DataService.RemoveGroupMember, true, data);

export const CallUpdateMemberAttendance = (data) =>
  generateServerAction(DataService.UpdateMemberAttendance, true, data);

export const CallFindInstituteById = (instituteId) =>
  generateServerAction(DataService.FindInstituteById, true, instituteId);
export const CallAddScrutinyData = (data) =>
  generateServerAction(DataService.AddScrutinyData, true, data);
export const CallDeleteCommittee = (data) =>
  generateServerAction(DataService.DeleteCommittee, true, data);
export const CallGetCommitteeCount = (data) =>
  generateServerAction(DataService.GetCommitteeCount, true, data);
export const CallSendScreeningCredentialMail = (data) =>
  generateServerAction(DataService.SendScreeningCredentialMail, true, data);
export const CallConvertRejectedScrutinyToPending = (data) =>
  generateServerAction(
    DataService.ConvertRejectedScrutinyToPending,
    true,
    data,
  );
export const CallGetPermissionByUserId = (id) =>
  generateServerAction(DataService.GetPermissionByUserId, true, id);
export const CallCreatePermission = (date) =>
  generateServerAction(DataService.CreatePermission, true, date);
export const CallUpdatePermission = (date) =>
  generateServerAction(DataService.UpdatePermission, true, date);
export const CallSendInterviewResultToCellAdmin = (data) =>
  generateServerAction(DataService.SendInterviewResultToCellAdmin, true, data);

// upprb-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
export const CallSubmitAdhiyaachan = (data) =>
  generateServerAction(DataService.SubmitAdhiyaachan, true, data);
export const CallGetAllAdhiyaachanList = (data) =>
  generateServerAction(DataService.GetAllAdhiyaachanList, true, data);
export const CallUpdateAdhiyaachan = (data) =>
  generateServerAction(DataService.UpdateAdhiyaachan, true, data);
export const CallSubmitAdvertisementRelease = (data) =>
  generateServerAction(DataService.SubmitAdvertisementRelease, true, data);
export const CallGetAdhiyaachanWorkflow = () =>
  generateServerAction(DataService.GetAdhiyaachanWorkflow, true);
export const CallGetDashboardStat = () =>
  generateServerAction(DataService.GetDashboardStat, true);
export const CallGetAllAdvertisement = (data) =>
  generateServerAction(DataService.GetAllAdvertisement, true, data);
export const CallGetAdhiyaachanById = (data) =>
  generateServerAction(DataService.GetAdhiyaachanById, true, data);
export const CallSubmitDetailsOfAdvertisement = (data) =>
  generateServerAction(DataService.SubmitDetailsOfAdvertisement, true, data);
export const CallSendMessageAdhiyaachan = (data) =>
  generateServerAction(DataService.SendMessageAdhiyaachan, true, data);
export const CallUpdateAdhiyaachanAdvertisement = (data) =>
  generateServerAction(DataService.UpdateAdhiyaachanAdvertisement, true, data);
export const CallGetAdhiyaachanAllMessages = (data) =>
  generateServerAction(DataService.GetAdhiyaachanAllMessages, true, data);

export const CallGetKuhsalAdvertisements = (data) =>
  generateServerAction(DataService.GetKuhsalAdvertisements, true, data);
export const CallGetSportsStatistics = (data) =>
  generateServerAction(DataService.GetSportsStatistics, true, data);
export const CallGetSportsbyTeams = (data) =>
  generateServerAction(DataService.GetSportsbyTeams, false, data);
export const CallGetPieCharData = (query) =>
  generateServerAction(DataService.GetPieCharData, false, query);
export const CallGetAllAdvertisementWithoutToken = (query) =>
  generateServerAction(
    DataService.GetAllAdvertisementWithoutToken,
    false,
    query,
  );
export const CallGetAllSports = (query) =>
  generateServerAction(DataService.GetAllSports, true, query);
export const CallGetVenueBySportId = (query) =>
  generateServerAction(DataService.GetVenueBySportId, true, query);

export const CallGetAllApplications = (data) =>
  generateServerAction(DataService.GetAllApplications, true, data);
export const CallGetDocumentVerificationData = (data) =>
  generateServerAction(DataService.GetDocumentVerificationData, true, data);
export const CallGetKuhsalApplicationsById = (data) =>
  generateServerAction(DataService.GetKuhsalApplicationsById, false, data);
export const CallGetAdvertisementPost = () =>
  generateServerAction(DataService.GetAdvertisementPost, true);
export const CallGetAllStates = () =>
  generateServerAction(DataService.GetAllStates, true);
export const CallGetAllKushalFilters = () =>
  generateServerAction(DataService.GetAllKushalFilters, true);
export const CallGetKushalVenuesByEventID = (data) =>
  generateServerAction(DataService.GetKushalVenuesByEventID, true, data);
export const CallDeleteKushalVenues = (data) =>
  generateServerAction(DataService.DeleteKushalVenues, true, data);
export const CallGetKushalExaminationStatistics = () =>
  generateServerAction(DataService.GetKushalExaminationStatistics, true);
export const CallGetKushalAddVenues = (data) =>
  generateServerAction(DataService.GetKushalAddVenues, true, data);
export const CallUpdateKushalAddVenues = (data) =>
  generateServerAction(DataService.UpdateKushalAddVenues, true, data);

export const CallGetAllTrialMarks = (query) =>
  generateServerAction(DataService.GetAllTrialMarks, true, query);

export const CallUpdateTrialMarks = (data) =>
  generateServerAction(DataService.UpdateTrialMarks, true, data);
export const CallUploadRefreeMarks = (data) =>
  generateServerAction(DataService.UploadRefreeMarks, true, data);
export const CallUploadCommitteeMarks = (data) =>
  generateServerAction(DataService.UploadCommitteeMarks, true, data);
export const CallUpload20Marks = (data) =>
  generateServerAction(DataService.Upload20Marks, true, data);

export const CallGetAllMarksCommittee = (query) =>
  generateServerAction(DataService.GetAllMarksCommittee, true, query);
export const CallUpdateMarksCommittee = (data) =>
  generateServerAction(DataService.UpdateMarksCommittee, true, data);

// Kushal Master Data
export const CallGetAllKushalAdvertisement = () =>
  generateServerAction(DataService.GetAllKushalAdvertisement, true);
export const CallGetKushalAdvertisementSelect = (query) =>
  generateServerAction(DataService.GetKushalAdvertisementSelect, true, query);
export const CallGetKuhsalTeams = (data) =>
  generateServerAction(DataService.GetKuhsalTeams, true, data);
export const CallGetKuhsalTeamsByID = (id) =>
  generateServerAction(DataService.GetKuhsalTeamsByID, true, id);
export const CallCreateMember = (data) =>
  generateServerAction(DataService.CreateMember, true, data);
export const CallUpdateMember = (data) =>
  generateServerAction(DataService.UpdateMember, true, data);
export const CallDeleteMember = (data) =>
  generateServerAction(DataService.DeleteMember, true, data);
export const CallGetAllMembers = (data) =>
  generateServerAction(DataService.GetAllMembers, true, data);
export const CallGetMemberRole = () =>
  generateServerAction(DataService.GetMemberRole, true);
export const CallCreateTeam = (data) =>
  generateServerAction(DataService.CreateTeam, true, data);
export const CallUpdateGroup = (data) =>
  generateServerAction(DataService.UpdateGroup, true, data);
export const CallGetMarksIntegrationData = (data) =>
  generateServerAction(DataService.GetMarksIntegrationData, true, data);
export const CallGetMarksIntegrationFilters = () =>
  generateServerAction(DataService.GetMarksIntegrationFilters, true);
export const CallUpdateApplicationScreening = (data) =>
  generateServerAction(DataService.UpdateApplicationScreening, true, data);
export const CallUpdateScreeningApplicationStatus = (data) =>
  generateServerAction(
    DataService.UpdateScreeningApplicationStatus,
    true,
    data,
  );
export const CallUpdateAppllicationScreeningDocumentStatus = (data) =>
  generateServerAction(
    DataService.UpdateAppllicationScreeningDocumentStatus,
    true,
    data,
  );
export const CallGetApplicationScrutinyDetails = (data) =>
  generateServerAction(DataService.GetApplicationScrutinyDetails, true, data);

export const CallGetApplicationsScrutiny = (data) =>
  generateServerAction(DataService.GetApplicationsScrutiny, true, data);
export const CallGetCardWiseUserDetails = (data) =>
  generateServerAction(DataService.GetCardWiseUserDetails, true, data);

export const CallGetVendorByAdvertisement = (data) =>
  generateServerAction(DataService.GetVendorByAdvertisement, true, data);

export const CallUpdateApplicationScrutinyStatus = (data) =>
  generateServerAction(DataService.UpdateApplicationScrutinyStatus, true, data);
export const CallGetShortlistedCandidates = (query) =>
  generateServerAction(DataService.GetShortlistedCandidates, true, query);
export const CallUpdateCertificateVerification = (data) =>
  generateServerAction(DataService.UpdateCertificateVerification, true, data);

export const CallGetAllCandidateVerification = (query) =>
  generateServerAction(DataService.GetAllCandidateVerification, true, query);
export const CallAuthoritiesCertificateVerification = (data) =>
  generateServerAction(
    DataService.AuthoritiesCertificateVerification,
    true,
    data,
  );
export const CallBoardCertificateVerification = (data) =>
  generateServerAction(DataService.BoardCertificateVerification, true, data);

export const CallGetFinalResult = (query) =>
  generateServerAction(DataService.GetFinalResult, true, query);

export const CallGetCertificateMarking = () =>
  generateServerAction(DataService.GetCertificateMarking, true);

export const CallDownloadFinalResult = (query) =>
  generateServerAction(DataService.DownloadFinalResult, true, query);

export const CallFetchApplicationScreeningDetails = (data) =>
  generateServerAction(
    DataService.FetchApplicationScreeningDetails,
    true,
    data,
  );

export const CallUpdateAppllicationScreeningDetailsStatus = (data) =>
  generateServerAction(
    DataService.UpdateAppllicationScreeningDetailsStatus,
    true,
    data,
  );
export const CallGetVenueDetails = (data) =>
  generateServerAction(DataService.GetVenueDetails, true, data);
export const CallGetAdmitCardCandidateDetails = (data) =>
  generateServerAction(DataService.GetAdmitCardCandidateDetails, true, data);
export const CallAddCandidateToVenue = (data) =>
  generateServerAction(DataService.AddCandidateToVenue, true, data);
export const CallReleaseAdmitCard = (data) =>
  generateServerAction(DataService.ReleaseAdmitCard, true, data);
export const CallGetReleaseAdmitCardDetails = (data) =>
  generateServerAction(DataService.GetReleaseAdmitCardDetails, true, data);

export const CallSeniorityForPromotion = (params) =>
  generateServerAction(DataService.SeniorityForPromotion, true, params);
export const CallUpdateDVstep = (data) =>
  generateServerAction(DataService.UpdateDVstep, true, data);

export const CallCreateSeniority = (data) =>
  generateServerAction(DataService.CreateSeniority, true, data);

export const CallUpdateSeniorityForPromotion = (data) =>
  generateServerAction(DataService.UpdateSeniorityForPromotion, true, data);

export const CallDeleteSeniority = (data) =>
  generateServerAction(DataService.DeleteSeniority, true, data);

export const CallUploadSeniorityPromotionData = (data) =>
  generateServerAction(DataService.UploadSeniorityPromotionData, true, data);

export const CallEligibilityForPromotion = (params) =>
  generateServerAction(DataService.EligibilityForPromotion, true, params);

export const CallCreateEligibility = (data) =>
  generateServerAction(DataService.CreateEligibility, true, data);

export const CallUpdateEligibilityForPromotion = (data) =>
  generateServerAction(DataService.UpdateEligibilityForPromotion, true, data);

export const CallDeleteEligibility = (data) =>
  generateServerAction(DataService.DeleteEligibility, true, data);

export const CallUploadEligibilityPromotionData = (data) =>
  generateServerAction(DataService.UploadEligibilityPromotionData, true, data);

export const CallDPCPromotionList = (data) =>
  generateServerAction(DataService.DPCPromotionList, true, data);

export const CallPromotionMeritList = (data) =>
  generateServerAction(DataService.PromotionMeritList, true, data);

export const CallPromotionQualifiedCandidates = (data) =>
  generateServerAction(DataService.PromotionQualifiedCandidates, true, data);

export const CallUpdateDcpPromotion = (data) =>
  generateServerAction(DataService.UpdateDcpPromotion, true, data);

export const CallUpdatePhysicalQualification = (data) =>
  generateServerAction(DataService.UpdatePhysicalQualification, true, data);

export const CallGetVendorTypes = () =>
  generateServerAction(DataService.GetVendorTypes, true);

export const CallFindMasterByCode = () =>
  generateServerAction(DataService.FindMasterByCode, false);

export const CallUserFindAllAdvertisement = (params) =>
  generateServerAction(DataService.UserFindAllAdvertisement, false, params);

export const CallGetAllWorkScope = (params) =>
  generateServerAction(DataService.GetAllWorkScope, true, params);

export const CallSaveVendorDetail = (data) =>
  generateServerAction(DataService.SaveVendorDetail, true, data);

export const CallGetVendorByWorkScope = (params) =>
  generateServerAction(DataService.GetVendorByWorkScope, true, params);

export const CallGetAllMOU = (params) =>
  generateServerAction(DataService.GetAllMOU, true, params);

export const CallUpdateVendorAgreement = (data) =>
  generateServerAction(DataService.UpdateVendorAgreement, true, data);

export const CallGetAllVendors = (params) =>
  generateServerAction(DataService.GetAllVendors, true, params);

export const CallVendorWorkOrderReleased = (data) =>
  generateServerAction(DataService.VendorWorkOrderReleased, true, data);

export const CallUpdateVendorStatus = (data) =>
  generateServerAction(DataService.UpdateVendorStatus, true, data);

export const CallSaveUpdateVendorWorkCompletion = (data) =>
  generateServerAction(DataService.SaveUpdateVendorWorkCompletion, true, data);

export const CallGetAllVendorWorkCompletions = (params) =>
  generateServerAction(DataService.GetAllVendorWorkCompletions, true, params);

export const CallSaveUpdateVendorPaymentDetails = (data) =>
  generateServerAction(DataService.SaveUpdateVendorPaymentDetails, true, data);

export const CallGetVendorPaymentDetails = (params) =>
  generateServerAction(DataService.GetVendorPaymentDetails, true, params);

export const CallAddMou = (data) =>
  generateServerAction(DataService.AddMou, true, data);

export const CallAddWorkScope = (data) =>
  generateServerAction(DataService.AddWorkScope, true, data);

export const CallGetAllDVPSTApplications = (data) =>
  generateServerAction(DataService.GetAllDVPSTApplications, true, data);
export const CallUpdateDVPSTScreening = (data) =>
  generateServerAction(DataService.UpdateDVPSTScreening, true, data);

export const CallFetchDVPSTScreeningDetails = (data) =>
  generateServerAction(DataService.FetchDVPSTScreeningDetails, true, data);
export const CallFetchDVPSTPrintDetails = (data) =>
  generateServerAction(DataService.FetchDVPSTPrintDetails, true, data);

export const CallUpdateDVPSTScreeningDetailsStatus = (data) =>
  generateServerAction(
    DataService.UpdateDVPSTScreeningDetailsStatus,
    true,
    data,
  );

export const CallUpdateDVPSTApplicationStatus = (data) =>
  generateServerAction(DataService.UpdateDVPSTApplicationStatus, true, data);

export const CallUpdateDVPSTScreeningDocumentStatus = (data) =>
  generateServerAction(
    DataService.UpdateDVPSTScreeningDocumentStatus,
    true,
    data,
  );
export const CallUploadDVPSTSignature = (data) =>
  generateServerAction(DataService.UploadDVPSTSignature, true, data);

export const CallUpdateDVPSTPhysicalStanderdTest = (data) =>
  generateServerAction(DataService.UpdateDVPSTPhysicalStanderdTest, true, data);
export const CallUpdateDVPSTBoardDecision = (data) =>
  generateServerAction(DataService.UpdateDVPSTBoardDecision, true, data);
export const CallFetchDVPSTPrintPageDetails = (data) =>
  generateServerAction(DataService.FetchDVPSTPrintPageDetails, true, data);

export const CallGetKushalSubSportDetails = (data) =>
  generateServerAction(DataService.GetKushalSubSportDetails, true, data);
export const CallGetKushalSubSportCategoriesDetails = (data) =>
  generateServerAction(
    DataService.GetKushalSubSportCategoriesDetails,
    true,
    data,
  );
export const CallUploadCertificateMarks = (data) =>
  generateServerAction(DataService.UploadCertificateMarks, true, data);
export const CallUploadCertificateStatus = (data) =>
  generateServerAction(DataService.UploadCertificateStatus, true, data);
export const CallUpdateDVPSTstep = (data) =>
  generateServerAction(DataService.UpdateDVPSTstep, true, data);

export const CallSaveVendorSelection = (data) =>
  generateServerAction(DataService.SaveVendorSelection, true, data);
export const CallGetVendorById = (data) =>
  generateServerAction(DataService.GetVendorById, true, data);
export const CallGetCandidatePerformance = (data) =>
  generateServerAction(DataService.GetCandidatePerformance, true, data);
export const CallGetCardModuleInformation = (data) =>
  generateServerAction(DataService.GetCardModuleInformation, true, data);

export const CallGetVenueDynamicAccordians = (data) =>
  generateServerAction(DataService.GetVenueDynamicAccordians, true, data);
export const CallGetCenters = (data) =>
  generateServerAction(DataService.GetCenters, true, data);
export const CallGetCBTCenterVerificationData = (data) =>
  generateServerAction(DataService.GetCBTCenterVerificationData, true, data);
export const CallDownloadKushalExcel = (data) =>
  generateServerAction(DataService.DownloadKushalExcel, true, data);
export const CallDownloadKushalPdf = (data) =>
  generateServerAction(DataService.DownloadKushalPdf, true, data);

export const CallGetAllOrder = (params) =>
  generateServerAction(DataService.GetAllOrder, true, params);

export const CallAddOrder = (data) =>
  generateServerAction(DataService.AddOrder, true, data);

export const CallVendorByWorkScopeData = (params) =>
  generateServerAction(DataService.VendorByWorkScopeData, true, params);

export const CallOtherWorkList = (params) =>
  generateServerAction(DataService.OtherWorkList, true, params);

export const CallAddOtherWork = (params) =>
  generateServerAction(DataService.AddOtherWork, true, params);

export const CallGetVendorByIdHistory = (params) =>
  generateServerAction(DataService.GetVendorByIdHistory, true, params);

export const CallGetWorkScopeByAdvId = (params) =>
  generateServerAction(DataService.GetWorkScopeByAdvId, true, params);
export const CallGetAllDistrict = (data) =>
  generateServerAction(DataService.GetAllDistrict, true, data);
export const CallGetCenterByDistrict = (data) =>
  generateServerAction(DataService.GetCenterByDistrict, true, data);
export const CallCreateVenueUser = (data) =>
  generateServerAction(DataService.CreateVenueUser, true, data);
export const CallUpdateVenueUser = (data) =>
  generateServerAction(DataService.UpdateVenueUser, true, data);
export const CallGetAllUserRoles = (data) =>
  generateServerAction(DataService.GetAllUserRoles, true, data);
export const CallGetAllUsers = (data) =>
  generateServerAction(DataService.GetAllUsers, true, data);
export const CallGetStates = () =>
  generateServerAction(DataService.GetStates, true);
export const CallGetAllZone = (data) =>
  generateServerAction(DataService.GetAllZone, true, data);
export const CallGetAllDistricts = (data) =>
  generateServerAction(DataService.GetAllDistricts, true, data);
export const CallGetAllCenters = (data) =>
  generateServerAction(DataService.GetAllCenters, true, data);
export const CallGetModuleWiseUsers = (data) =>
  generateServerAction(DataService.GetModuleWiseUsers, true, data);
export const CallCreateZone = (data) =>
  generateServerAction(DataService.CreateZone, true, data);
export const CallCreateDistrict = (data) =>
  generateServerAction(DataService.CreateDistrict, true, data);
export const CallCreateCenter = (data) =>
  generateServerAction(DataService.CreateCenter, true, data);
export const CallGetUsersByCenter = (data) =>
  generateServerAction(DataService.GetUsersByCenter, true, data);
export const CallGetAllRoles = (data) =>
  generateServerAction(DataService.GetAllRoles, true, data);
export const CallCreateRole = (data) =>
  generateServerAction(DataService.CreateRole, true, data);
export const CallGetAllManpower = (data) =>
  generateServerAction(DataService.GetAllManpower, true, data);
export const CallCreateManpower = (data) =>
  generateServerAction(DataService.CreateManpower, true, data);
export const CallGetAdmitCardStats = (data) =>
  generateServerAction(DataService.GetAdmitCardStats, true, data);
export const CallDownloadSampleAdmitExcel = () =>
  generateServerAction(DataService.DownloadSampleAdmitExcel, true);
export const CallGetPublishDates = (data) =>
  generateServerAction(DataService.GetPublishDates, true, data);
export const CallPublishAdmitCard = (data) =>
  generateServerAction(DataService.PublishAdmitCard, true, data);
export const CallUploadCandidateExam = (data) =>
  generateServerAction(DataService.UploadCandidateExam, true, data);
export const CallGetWorkScopeByVendorId = (data) =>
  generateServerAction(DataService.GetWorkScopeByVendorId, true, data);
export const CallDownloadCandidateMarks = (data) =>
  generateServerAction(DataService.DownloadCandidateMarks, true, data);
export const CallUpdateAdmitCardStatus = (data) =>
  generateServerAction(DataService.UpdateAdmitCardStatus, true, data);
export const CallUpdateAdmitCardStatusKushal = (data) =>
  generateServerAction(DataService.UpdateAdmitCardStatusKushal, true, data);
export const CallRescheduleAdmitCard = (data) =>
  generateServerAction(DataService.RescheduleAdmitCard, true, data);
export const CallGetAllObservers = (data) =>
  generateServerAction(DataService.GetAllObservers, true, data);
export const CallCreateObserver = (data) =>
  generateServerAction(DataService.CreateObserver, true, data);
export const CallGetPhysicalByAdvertisement = (data) =>
  generateServerAction(DataService.GetPhysicalByAdvertisement, true, data);
export const CallGetPhysicalWorkScope = (params) =>
  generateServerAction(DataService.GetPhysicalWorkScope, true, params);
export const CallGetPhysicalById = (data) =>
  generateServerAction(DataService.GetPhysicalById, true, data);
export const CallSavePhysicalSelection = (data) =>
  generateServerAction(DataService.SavePhysicalSelection, true, data);
export const CallGetAllPhysicalWorkScope = (params) =>
  generateServerAction(DataService.GetAllPhysicalWorkScope, true, params);
export const CallPhysicalDownloadCandidateMarks = (data) =>
  generateServerAction(DataService.DownloadPhysicalCandidateMarks, true, data);
export const CallPhysicalUploadCandidateExam = (data) =>
  generateServerAction(DataService.PhysicalUploadCandidateExam, true, data);
export const CallGetPhysicalWorkScopeByVendorId = (data) =>
  generateServerAction(DataService.GetWorkPhysicalScopeByVendorId, true, data);
// typing test section
export const CallGetTypingById = (data) =>
  generateServerAction(DataService.GetTypingById, true, data);
export const CallSaveTypingSelection = (data) =>
  generateServerAction(DataService.SaveTypingSelection, true, data);
export const CallTypingUploadCandidateExam = (data) =>
  generateServerAction(DataService.TypingUploadCandidateExam, true, data);
export const CallGetTypingByAdvertisement = (data) =>
  generateServerAction(DataService.GetTypingByAdvertisement, true, data);
export const CallGetTypingWorkScopeByVendorId = (data) =>
  generateServerAction(DataService.GetWorkTypingScopeByVendorId, true, data);
export const CallTypingDownloadCandidateMarks = (data) =>
  generateServerAction(DataService.DownloadTypingCandidateMarks, true, data);
//final result section
export const CallGetFinalResultById = (data) =>
  generateServerAction(DataService.GetFinalResultById, true, data);
export const CallSaveFinalResultSelection = (data) =>
  generateServerAction(DataService.SaveFinalResultSelection, true, data);
export const CallGetFinalResultByAdvertisement = (data) =>
  generateServerAction(DataService.GetFinalResultByAdvertisement, true, data);
export const CallFinalResultUploadCandidateExam = (data) =>
  generateServerAction(DataService.FinalResultUploadCandidateExam, true, data);
export const CallFinalResultDownloadCandidateMarks = (data) =>
  generateServerAction(
    DataService.DownloadFinalResultCandidateMarks,
    true,
    data,
  );
export const CallGetFinalResultWorkScopeByVendorId = (data) =>
  generateServerAction(
    DataService.GetWorkFinalResultScopeByVendorId,
    true,
    data,
  );
export const CallGetFinalByAdvertisement = (data) =>
  generateServerAction(DataService.GetFinalResultByAdvertisement, true, data);
// Venue Management Master Data Excel Download
export const CallDownloadZoneExcel = () =>
  generateServerAction(DataService.DownloadZoneExcel, true);
export const CallDownloadDistrictExcel = () =>
  generateServerAction(DataService.DownloadDistrictExcel, true);
export const CallDownloadCenterExcel = () =>
  generateServerAction(DataService.DownloadCenterExcel, true);
export const CallDownloadManpowerExcel = () =>
  generateServerAction(DataService.DownloadManpowerExcel, true);
export const CallDownloadObserverExcel = () =>
  generateServerAction(DataService.DownloadObserverExcel, true);
// Venue Management Master Data Excel Upload
export const CallUploadZone = (data) =>
  generateServerAction(DataService.UploadZone, true, data);
export const CallUploadDistrict = (data) =>
  generateServerAction(DataService.UploadDistrict, true, data);
export const CallUploadCenter = (data) =>
  generateServerAction(DataService.UploadCenter, true, data);
export const CallUploadManpower = (data) =>
  generateServerAction(DataService.UploadManpower, true, data);
export const CallUploadObserver = (data) =>
  generateServerAction(DataService.UploadObserver, true, data);
export const CallGetDatesByCenter = (data) =>
  generateServerAction(DataService.GetDatesByCenter, true, data);
// Venue Management Master Data Update
export const CallUpdateZone = (data) =>
  generateServerAction(DataService.UpdateZone, true, data);
export const CallUpdateDistrict = (data) =>
  generateServerAction(DataService.UpdateDistrict, true, data);
export const CallUpdateCenter = (data) =>
  generateServerAction(DataService.UpdateCenter, true, data);
export const CallUpdateRole = (data) =>
  generateServerAction(DataService.UpdateRole, true, data);
export const CallUpdateManpower = (data) =>
  generateServerAction(DataService.UpdateManpower, true, data);
export const CallUpdateObserver = (data) =>
  generateServerAction(DataService.UpdateObserver, true, data);

export const CallGetExamInspection = (data) =>
  generateServerAction(DataService.GetExamInspection, true, data);
export const CallGetObserverFeedback = (data) =>
  generateServerAction(DataService.GetObserverFeedback, true, data);

export const CallWorkOrderDelete = (data) =>
  generateServerAction(DataService.WorkOrderDelete, true, data);

export const CallUpdateOtherWork = (data) =>
  generateServerAction(DataService.UpdateOtherWork, true, data);

export const CallWorkScopeDelete = (data) =>
  generateServerAction(DataService.WorkScopeDelete, true, data);

export const CallUpdateEditWorkScope = (data) =>
  generateServerAction(DataService.UpdateEditWorkScope, true, data);

export const CallDeleteMOU = (data) =>
  generateServerAction(DataService.DeleteMOU, true, data);

export const CallUpdateMou = (data) =>
  generateServerAction(DataService.UpdateMou, true, data);

export const CallVendorDashboard = (data) =>
  generateServerAction(DataService.VendorDashboard, true, data);
export const CallGetCandidateVenueAllocationDetails = (data) =>
  generateServerAction(
    DataService.GetCandidateVenueAllocationDetails,
    true,
    data,
  );
export const CallGetAdmitCardReleaseApplications = (data) =>
  generateServerAction(DataService.GetAdmitCardReleaseApplications, true, data);
export const CallEligibilityForDPCPromotion = (data) =>
  generateServerAction(DataService.EligibilityForDPCPromotion, true, data);

export const CallSeniorityForPromotionById = (data) =>
  generateServerAction(DataService.SeniorityForPromotionById, true, data);

export const CallSubmitDCP = (data) =>
  generateServerAction(DataService.SubmitDCP, true, data);

export const CallGetAllPromotion = (data) =>
  generateServerAction(DataService.GetAllPromotion, true, data);
export const CallGetAllGroup = (query) =>
  generateServerAction(DataService.GetAllGroup, true, query);
export const CallGetAllPromotionList = (query) =>
  generateServerAction(DataService.PromotionbasislistbyId, true, query);
export const CallCreateCommitte = (data) =>
  generateServerAction(DataService.AddCreateCommittee, true, data);
export const CallGetpromotioncommitteebyID = (id) =>
  generateServerAction(DataService.GetPromotioncommitteebyId, true, id);
export const CallUpdateCommittee = (data) =>
  generateServerAction(DataService.UpdateCommittee, true, data);
export const CallRemoveCommitteeMember = (data) =>
  generateServerAction(DataService.RemoveCommiteMember, true, data);
export const CallGetCenterDashboard = (data) =>
  generateServerAction(DataService.GetCenterDashboard, true, data);
export const CallGetCenterDashboardTable = (data) =>
  generateServerAction(DataService.GetCenterDashboardTable, true, data);
export const CallGetTODashboard = (query) =>  
  generateServerAction(DataService.GetTODashboard, true, query);

export const CallGetDistrictDashboardTable = (data) =>
  generateServerAction(DataService.GetDistrictDashboardTable, true, data);
export const CallValidateVenueDates = (data) =>
  generateServerAction(DataService.ValidateVenueDates, true, data);
export const CallGetAllFormTemplates = () =>
  generateServerAction(DataService.GetAllFormTemplates, true);
export const CallGetFormByTemplateId = (data) =>
  generateServerAction(DataService.GetFormByTemplateId, true, data);
export const CallUpdateFormByTemplateId = (data) =>
  generateServerAction(DataService.UpdateFormByTemplateId, true, data);

export const CallSubmitHCMT = (data) =>
  generateServerAction(DataService.SubmitHCMT, true, data);
export const CallHTCMotionList = (data) =>
  generateServerAction(DataService.HCTCMmotionList, true, data);
export const CallSubmitG2 = (data) =>
  generateServerAction(DataService.SubmitG2, true, data);
export const CallDashbordList = (data) =>
  generateServerAction(DataService.DashbordList, true, data);
export const CallUpdateHtcpPromotion = (data) =>
  generateServerAction(DataService.UpdateHTCPPromotion, true, data);
export const CallG2otionList = (data) =>
  generateServerAction(DataService.G2MmotionList, true, data);
export const CallUpdatG2Promotion = (data) =>
  generateServerAction(DataService.UpdateG2Promotion, true, data);

export const CallUploadSportsCertificate = (data) =>
  generateServerAction(DataService.UploadSportsCertificate, true, data);

export const CallGetCenterVerificationOfficers = (data) =>
  generateServerAction(DataService.GetCenterVerificationOfficers, true, data);
export const CallGetCenterVerificationOfficers2 = (data) =>
  generateServerAction(DataService.GetCenterVerificationOfficers2, true, data);
export const CallUpdateCenterVerificationOfficers = (data) =>
  generateServerAction(
    DataService.UpdateCenterVerificationOfficers,
    true,
    data,
  );
export const CallPromotionFinalResult = (data) =>
  generateServerAction(DataService.PromotionFinalResult, true, data);

export const CallUploadDCPPromotionData = (data) =>
  generateServerAction(DataService.UploadDCPPromotionData, true, data);
export const CallUploadHCMPPromotionData = (data) =>
  generateServerAction(DataService.UploadHCMPPromotionData, true, data);
export const CallUploadG2PromotionData = (data) =>
  generateServerAction(DataService.UploadG2PromotionData, true, data);
export const CallDCPotionList = (data) =>
  generateServerAction(DataService.DCPMmotionList, true, data);
// Otr, Application and transaction api

export const CallGetOtrCandidateDetail = (query) =>
  generateServerAction(DataService.GetOtrCandidateDetail, true, query);

export const CallFindAllTransactionsForAdmin = (query) =>
  generateServerAction(DataService.FindAllTransactionsForAdmin, true, query);

export const CallFindcandidateOtrDetailsStats = (params) =>
  generateServerAction(DataService.FindcandidateOtrDetailsStats, true, params);

export const CallFindApplicationStats = (id) =>
  generateServerAction(DataService.FindApplicationStats, true, id);
export const CallFileCheck = (data) =>
  generateServerAction(DataService.FileCheck, true, data);
export const CallVendorCredential = (data) =>
  generateServerAction(DataService.VendorCredential, true, data);
export const CallGetVendorByIdUpload = (data) =>
  generateServerAction(DataService.GetVendorByIdUpload, true, data);
export const CallGetPhysicalByAdvertisementUpload = (data) =>
  generateServerAction(
    DataService.GetPhysicalByAdvertisementUpload,
    true,
    data,
  );
export const CallGetFinalResultByAdvertisementUpload = (data) =>
  generateServerAction(
    DataService.GetFinalResultByAdvertisementUpload,
    true,
    data,
  );
export const CallGetTypingByAdvertisementUpload = (data) =>
  generateServerAction(DataService.GetTypingByAdvertisementUpload, true, data);
export const CallFindMasterByCodePromotion = () =>
  generateServerAction(DataService.FindMasterByCodePromotion, false);
export const CallGetVenueDistrictById = (data) =>
  generateServerAction(DataService.GetVenueDistrictById, true, data);
export const CallGetTreasuryVerificationByDistrictId = (data) =>
  generateServerAction(
    DataService.GetTreasuryVerificationByDistrictId,
    true,
    data,
  );
export const CallGetCenterMapData = (query) =>
  generateServerAction(DataService.GetCenterMapData, true, query);
export const CallGetTreasuryMapData = () =>
  generateServerAction(DataService.GetTreasuryMapData, true);
export const CallResetPassword = (data) =>
  generateServerAction(DataService.ResetPassword, false, data);
export const CallGetCenterExcel = () =>
  generateServerAction(DataService.GetCenterExcel, true);
export const CallGetDistrictExcel = (query) =>
  generateServerAction(DataService.GetDistrictExcel, true, query);
export const CallGetTreasuryMaterialVerification = (data) =>
  generateServerAction(DataService.GetTreasuryMaterialVerification, true, data);
export const CallGetMaterialReceipt = () =>
  generateServerAction(DataService.GetMaterialReceipt, true);
export const CallGetTreasuryMaterialUser = (data) =>
  generateServerAction(DataService.GetTreasuryMaterialUser, true, data);
export const CallGetTreasuryCenters = (data) =>
  generateServerAction(DataService.GetTreasuryCenters, true, data);
export const CallGetCentersToTreasury = (data) =>
  generateServerAction(DataService.GetCentersToTreasury, true, data);
export const CallGetAllCandidateDetails = (data) =>
  generateServerAction(DataService.GetAllCandidateDetails, true, data);
export const CallCreateDvpst = (data) =>
  generateServerAction(DataService.CreateuserDvpst, true, data);
export const CallGetAdvByCourseDvpst = (data) =>
  generateServerAction(DataService.GetAdvByCourseDvpst, true, data);
export const CallGetDvpstAllMembers = (data) =>
  generateServerAction(DataService.GetAllDvpstMembers, true, data);
export const CallGetAllOfficer = (params) =>
  generateServerAction(DataService.GetAllOfficer, true, params);
export const CallCreateAllOfficer = (data) =>
  generateServerAction(DataService.createOfficer, true, data);
export const CallGetUserDetails = (data) =>
  generateServerAction(DataService.GetUserDetails, true, data);
export const CallGetModuleList = (data) =>
  generateServerAction(DataService.GetModuleList, true, data);
export const CallUpdateAllOfficer = (data) =>
  generateServerAction(DataService.updateOfficer, true, data);
export const CallGetPhaseData = (data) =>
  generateServerAction(DataService.GetPhaseData, true, data);
export const CallGetCenterAuditStats = (data) =>
  generateServerAction(DataService.GetCenterAuditStats, true, data);
export const CallGetCenterMockStats = (data) =>
  generateServerAction(DataService.GetCenterMockStats, true, data);
export const CallGetCenterManpowerStats = (data) =>
  generateServerAction(DataService.GetCenterManpowerStats, true, data);
export const CallUpdateDvpstMember = (data) =>
  generateServerAction(DataService.UpdateDvpstMember, true, data);
export const CallCreateDvpstTeam = (data) =>
  generateServerAction(DataService.CreateDvpstTeam, true, data);
export const CallUpdateDvpstGroup = (data) =>
  generateServerAction(DataService.UpdateDvpstGroup, true, data);
export const CallDownloadDVPSTApplications = (data) =>
  generateServerAction(DataService.DownloadDVPSTApplications, true, data);
export const CallGetDvpstAllZone = (data) =>
  generateServerAction(DataService.GetAllDvpstZone, true, data);
export const CallGetDvpstMandal = (data) =>
  generateServerAction(DataService.GetAllDvpstMandal, true, data);
export const CallGetAllDvpstDistricts = (data) =>
  generateServerAction(DataService.GetAllDvpstDistricts, true, data);
export const CallDvpstDashboard = (data) =>
  generateServerAction(DataService.DvpstDashboard, true, data);
export const CallVendorPaymentDetails = (params) =>
  generateServerAction(DataService.GetFindVendorPaymentDetails, true, params);
export const CallGetAllPromotionData = (params) =>
  generateServerAction(DataService.GetAllPromotionData, true, params);
export const CallGetAllMasterCader = (params) =>
  generateServerAction(DataService.GetAllMasterCader, true, params);
export const CallGetAllGenderPost = (query) =>
  generateServerAction(DataService.GetAllMasterGender, true, query);
export const CallCreateAdhiyaachan = (data) =>
  generateServerAction(DataService.CreateAdhiyaachan, true, data);
export const CallGetAllSportsData = (query) =>
  generateServerAction(DataService.GetAllAllSportsData, true, query);
export const CallGetAdhiyaachanDataById = (query) =>
  generateServerAction(DataService.GetAdhiyaachanDataById, true, query);
export const CallUpdateNewAdhiyaachan = (data) =>
  generateServerAction(DataService.UpdateNewAdhiyaachan, true, data);
export const CallGetAllMasterData = (query) =>
  generateServerAction(DataService.GetAllMasterGender, true, query);
export const CallGetAllNewAdhiyaachanList = (data) =>
  generateServerAction(DataService.GetAllNewAdhiyaachanList, true, data);
export const CallCreateAdvertisementRelease = (data) =>
  generateServerAction(DataService.CreateAdvertisementRelease, true, data);
export const CallVacancySeatsOfAdhiyachan = (data) =>
  generateServerAction(DataService.GetVacancySeatsOfAdhiyachan, true, data);
export const CallGetAdvertisementById = (query) =>
  generateServerAction(DataService.GetAdvertisementById, true, query);
export const CallUpdateNewAdvertisement = (data) =>
  generateServerAction(DataService.UpdateNewAdvertisement, true, data);
export const CallGetAdhiyaachanByAdvertisement = (data) =>
  generateServerAction(DataService.GetAdhiyaachanByAdvertisement, true, data);
export const CallGetAllMasterCourses = (params) =>
  generateServerAction(DataService.GetAllMasterCourses, true, params);
export const CallGetAllMasterCourseById = (params) =>
  generateServerAction(DataService.GetAllMasterCourseById, true, params);
export const CallCreateCourses = (data) =>
  generateServerAction(DataService.CreateCourses, true, data);
export const CallUpdateMasterCourses = (data) =>
  generateServerAction(DataService.UpdateMasterCourses, true, data);
export const CallGetAllMasterPost = (params) =>
  generateServerAction(DataService.GetAllMasterPost, true, params);
export const CallCreatePost = (data) =>
  generateServerAction(DataService.CreatePost, true, data);
export const CallGetAllMasterZoneById = (params) =>
  generateServerAction(DataService.GetAllMasterZoneById, true, params);
export const CallUpdateMasterZone = (data) =>
  generateServerAction(DataService.UpdateMasterZone, true, data);
export const CallGetRange = (data) =>
  generateServerAction(DataService.GetAllRange, true, data);
export const CallCreateZoneRange = (data) =>
  generateServerAction(DataService.CreateZoneRange, true, data);
export const CallUpdateMasterRange = (data) =>
  generateServerAction(DataService.UpdateMasterRange, true, data);
export const CallGetAllMasterDistrict = (params) =>
  generateServerAction(DataService.GetAllMasterDistrict, true, params);
export const CallCreateDistricts = (data) =>
  generateServerAction(DataService.CreateDistricts, true, data);
export const CallUpdateMasterDistrict = (data) =>
  generateServerAction(DataService.UpdateMasterDistrict, true, data);
export const CallGetAllMasterPostById = (params) =>
  generateServerAction(DataService.GetAllMasterPostById, true, params);
export const CallUpdateMasterPost = (data) =>
  generateServerAction(DataService.UpdateMasterPost, true, data);
export const CallCreateMainSport = (data) =>
  generateServerAction(DataService.CreateMainSport, true, data);
export const CallGetMainSportById = (params) =>
  generateServerAction(DataService.GetAllMainSportById, true, params);
export const CallUpdateMainSport = (data) =>
  generateServerAction(DataService.UpdateMainSport, true, data);
export const CallGetAllSubSports = (query) =>
  generateServerAction(DataService.GetAllSubSports, true, query);
export const CallCreateSubSport = (data) =>
  generateServerAction(DataService.CreateSubSport, true, data);
export const CallGetSubSportById = (params) =>
  generateServerAction(DataService.GetAllSubSportById, true, params);
export const CallUpdateSubSport = (data) =>
  generateServerAction(DataService.UpdateSubSport, true, data);
export const CallGetAllPromotionCardList = (query) =>
  generateServerAction(DataService.GetAllPromotionCardList, true, query);
export const CallGetAllAdvertisementData = (query) =>
  generateServerAction(DataService.GetAllAdvertisementData, true, query);
export const CallGetAllExamType = (params) =>
  generateServerAction(DataService.GetAllExamType, true, params);
export const CallGetAllVenue = (data) =>
  generateServerAction(DataService.GetAllVenue, true, data);
export const CallGetSWPDistrict = (data) =>
  generateServerAction(DataService.GetSWPDistrict, true, data);
export const CallGetCenterVerificationShiftData = (data) =>
  generateServerAction(DataService.GetCenterVerificationShiftData, true, data);
export const CallCreateAdhiyaachanAdmitCard = (data) =>
  generateServerAction(DataService.CreateAdhiyaachanAdmitCard, true, data);
export const CallGetAllAdhiyaachanAdmitCard = (data) =>
  generateServerAction(DataService.GetAllAdhiyaachanAdmitCard, true, data);
export const CallAdhiyaachanAdmitCardGetById = (data) =>
  generateServerAction(DataService.AdhiyaachanAdmitCardGetById, true, data);
export const CallUpdateAdhiyaachanAdmitCard = (data) =>
  generateServerAction(DataService.UpdateAdhiyaachanAdmitCard, true, data);
export const CallGetAllExamTypeData = (query) =>
  generateServerAction(DataService.GetAllExamTypeData, true, query);
export const CallGetAllVenueTable = (data) =>
  generateServerAction(DataService.GetAllVenueTable, true, data);
export const CallAddScheduleForExam = (data) =>
  generateServerAction(DataService.AddScheduleForExam, true, data);
export const CallGetAllCentersAdmitCard = (data) =>
  generateServerAction(DataService.GetAllCentersAdmitCard, true, data);
export const CallRemoveCommitteeMemberDvpst = (data) =>
  generateServerAction(DataService.RemoveCommiteMemberDvpst, true, data);
export const CallUpdateDVPSTuploadUnmatchedDocuments = (data) =>
  generateServerAction(
    DataService.UpdateDVPSTuploadUnmatchedDocuments,
    true,
    data,
  );
export const CallGetcenterUsersWithSubmitStatus = (query) =>
  generateServerAction(DataService.centerUsersWithSubmitStatus, true, query);
export const CallGetcenterVerificationParsedFields = (query) =>
  generateServerAction(DataService.centerVerificationParsedFields, true, query);
export const CallGetcenterVerificationDashboard = (query) =>
  generateServerAction(DataService.centerVerificationDashboard, true, query);
export const CallGetAllInfraData = (query) =>
  generateServerAction(DataService.AllInfraData, true, query);
export const CallUploadDVPSTData = (data) =>
  generateServerAction(DataService.UploadDVPSTData, true, data);
export const CallCandidatesAbsent = (data) =>
  generateServerAction(DataService.CandidatesAbsent, true, data);
export const CallDownloadTemplate = (data) =>
  generateServerAction(DataService.DownloadTemplate, true, data);
export const CallDownloadTemplateFinal = (data) =>
  generateServerAction(DataService.DownloadTemplateFinal, true, data);
export const CallDownloadTemplateTypingTest = (data) =>
  generateServerAction(DataService.DownloadTemplateTypingTest, true, data);
export const CallDownloadTemplatephysicalEfficiency = (data) =>
  generateServerAction(DataService.DownloadTemplatephysicalEfficiencyTest, true, data);
export const CallWrittenExamUpload = (data) =>
  generateServerAction(DataService.WrittenExamUpload, true, data);
export const CallPhysicalTestUpload = (data) =>
  generateServerAction(DataService.PhysicalTestUpload, true, data);
export const CallTypingTestUpload = (data) =>
  generateServerAction(DataService.TypingTestUpload, true, data);
export const CallFinalResultUpload = (data) =>
  generateServerAction(DataService.FinalResultUpload, true, data);
export const CallDownloadDataByBoard = (data) =>
  generateServerAction(DataService.DownloadDataByBoard, true, data);
export const CallGetVendor = () =>
  generateServerAction(DataService.GetVendor, true);
export const CallAddHistory = (data) =>
  generateServerAction(DataService.AddHistory, true, data);
export const CallGetAllHistory = (query) =>
  generateServerAction(DataService.GetAllHistory, true, query);
export const CallUpdateHistory = (data) =>
  generateServerAction(DataService.UpdateHistory, true, data);
export const CallHistoryGetById = (query) =>
  generateServerAction(DataService.HistoryGetById, true, query);
export const CallHistoryData = (query) =>
  generateServerAction(DataService.HistoryData, true, query);
export const CallAddHistoryData = (data) =>
  generateServerAction(DataService.AddHistoryData, true, data);
export const CallGetHistoryStatus = (query) =>
  generateServerAction(DataService.GetHistoryStatus, true, query);
export const CallDownloadDataByBoardTypingTest = (data) =>
  generateServerAction(DataService.DownloadDataByBoardTypingTest, true, data);
export const CallDownloadDataByBoardPhysicalTest = (data) =>
  generateServerAction(DataService.DownloadDataByBoardPhysicalTest, true, data);
export const CallDownloadDataByBoardFinalResult = (data) =>
  generateServerAction(DataService.DownloadDataByBoardFinalResult, true, data);
export const CallGetcenterUsersShiftWise = (query) =>
  generateServerAction(DataService.centerUsersWithShiftWise, true, query);
export const CallGetShiftWiseParsedFields = (query) =>
  generateServerAction(DataService.shiftWiseParsedFields, true, query);
export const CallGetUsersByShiftWise = (data) =>
  generateServerAction(DataService.GetUsersByShiftWise, true, data);
export const CallUserListingUpload = (data) =>
  generateServerAction(DataService.UserListingUpload, true, data);
export const CallDeleteVenueUser = (data) =>
  generateServerAction(DataService.DeleteVenueUser, true, data);
export const CallDeleteVenueCenter = (data) =>
  generateServerAction(DataService.DeleteVenueCenter, true, data);
export const CallDownloadInfraExcel = (query) =>
  generateServerAction(DataService.DownloadInfraExcel, true, query);
export const CallDownloadInfraPDF = (query) =>
  generateServerAction(DataService.DownloadInfraPDF, true, query);
export const CallGetCenterShiftDashboard = (data) =>
  generateServerAction(DataService.GetCenterShiftDashboard, true, data);
export const CallDistrictJsonExcel = (query) =>
  generateServerAction(DataService.DistrictJsonExcel, true, query);
