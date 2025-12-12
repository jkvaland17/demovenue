import http from "./http-common";

class DataService {
  GetExcelDownload() {
    throw new Error("Method not implemented.");
  }
  // Login Services
  Login(data) {
    return http.post(`v1/admin/login`, data);
  }

  UpdateAdminPassword(data, token) {
    return http.post(`v1/admin/forgotCreateNewPassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  VerifyOTP(data) {
    return http.post(`v1/admin/forgotPasswordVerifyOtp`, data);
  }
  GetSendOtp(data, token) {
    return http.post(`v1/admin/forgotPasswordSendOtp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Admin
  FindAllAdmin(data, token) {
    return http.get(
      `admin/findAllAdmins?page=${data.pageNo}&limit=${data.limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FindSubAdminByAdminId(token) {
    return http.get("admin/findSubAdminByAdminId", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FilterAdmin(data, token) {
    return http.get(
      `/admin/findAllAdminsByQuery?name=${data.name}&email=${data.email}&state=${data.state}&permissionId=${data.permissionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  // Topic

  FindAllTopics(token) {
    return http.get(`admin/findAllTopics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateTopic(data, token) {
    return http.post("/admin/createTopic", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindTopicsByPost(id, token) {
    return http.get(`admin/findTopicsByPost/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateTopic(id, data, token) {
    return http.patch(`/admin/updateTopic?admin_id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Master

  CreateMaster(data, token) {
    return http.post("/admin/createMaster", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindMaterByType(type, token) {
    return http.get(`/admin/findMastersByMasterType?masterType=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllAdvertisement(token) {
    return http.get(`v1/advertisement/findAllAdv`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindSpecialityByAdvertisementId(id, token) {
    return http.get(`admin/findSpecialityByAdvertisementId?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindMastersByParentId(id, token) {
    return http.get(`user/FindMastersByParentId?masterParentId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Permission
  FindAllPermissions(token) {
    return http.get("/admin/findAllPermissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindPermissionByPermissionType(id, token) {
    return http.get(
      `/admin/findPermissionByPermissionType?permissionTypeId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FindMasterByPermissionType(id, token) {
    return http.get(
      `/admin/findMasterByPermissionType?permissionTypeId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FindPermissionByAdminId(id, token) {
    return http.get(`/admin/findPermissionByAdminId?adminId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateAdminPermission(data, token) {
    return http.post("/admin/createAdminPermission", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // SubAdmin

  FindAllSubAdminByDepartment(id, token) {
    return http.get(`admin/findAdminByDeparment?permissionId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateSubAdmin(data, token) {
    return http.post("/admin/createAdmin", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDownloadExcel(token, data, api) {
    return http.post(`/admin/${api}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set Content-Type to application/json
      },
      responseType: "blob",
    });
  }

  GetDownloadExcelScreening(token, data, api) {
    return http.get(`/admin/${api}?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set Content-Type to application/json
      },
      responseType: "blob",
    });
  }
  // User
  FindAllUsers(data, token) {
    return http.get(`user/findAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllApplications(data, token) {
    return http.get(`admin/findAllApplications?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindVerificationDocumentList(data, token) {
    return http.get(`admin/findVerificationDocumentList?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindUserApplication(data, token) {
    return http.get(
      `admin/findUserApplication?userId=${data.id}&page=${data.pageNo}&limit=${data.limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  SocialMediaLogin(data, token) {
    return http.post("admin/loginSocialMedia", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AutoGenAdmitCard(data, token) {
    return http.post("v1/admin/autoGenerateAdmitCard", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateUser(data, token) {
    return http.post("/admin/createUser", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateUser(id, data, token) {
    return http.patch(`/admin/createUser${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateQualificationExperience(data, token) {
    return http.post("admin/createQualificationExperience", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetUserByUserId(id, token) {
    return http.get(`user/findUserByUserId?admin_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetApplicationById(id, token) {
    return http.get(`admin/findApplicationById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateApplication(id, data, token) {
    return http.patch(`admin/updateApplicationByAdmin?_id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindUserByDeparment(token) {
    return http.get("admin/findUserByDeparment", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  //Notification
  GetAllNotification(token) {
    return http.get("admin/findAllNotifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetNotificationById(id, token) {
    return http.get(`admin/findNotificationById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateNotification(data, token) {
    return http.post("/admin/createNotification", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DeleteNotification(data, token) {
    return http.delete(`/admin/deleteNotification?id=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  //Inbox
  GetAllInbox(token) {
    return http.get("admin/findAllConversation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindUserConversation(data, token) {
    return http.get(`admin/findConversationById?userId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Queries
  GetAllQueriesTicket(data, token) {
    return http.get(`admin/findAllQuery?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllQueryV2(data, token) {
    return http.get(`admin/findAllQueryV2?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetQueryById(id, token) {
    return http.get(`admin/findQueryById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PatchQuery(data, token) {
    return http.patch("/admin/updateQuery", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  //Ticket
  GetAllTicket(token) {
    return http.get("admin/findAllTickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTicketById(id, token) {
    return http.get(`admin/findTicketById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PatchTicket(data, token) {
    return http.patch("/admin/updateTicket", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Advertisement
  CreateAdvertisement(data, token) {
    return http.post("admin/createAdvertisement", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateAdvertisement(id, data, token) {
    return http.patch(`admin/updateAdvertisement?advertisementId=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetSpecialityByAdvertisementId(id, token) {
    return http.get(`admin/findSpecialityByAdvertisementId?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPWBDList(token) {
    return http.get(`admin/findPWBDCategory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AssignSpecialityByAdvertisementId(id, data, token) {
    return http.post(`admin/createSuperSpeciality?advertisement=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllPostApplied(idA, idD, token) {
    return http.get(
      `admin/findPostAppliedBySuperSpecialityId?id=${idA}&superSpeciality=${idD}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  CreatePostApplied(data, token) {
    return http.post("admin/createPostApplied", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPostAppliedById(id, token) {
    return http.get(`admin/findPostAppliedById?postApplied_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdatePostApplied(id, data, token) {
    return http.patch(`admin/updatePostApplied?postApplied_id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Department
  GetAllDepartment(token) {
    return http.get("admin/findAllDepartments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateDepartment(data, token) {
    return http.post("admin/createDepartment", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDepartment(id, data, token) {
    return http.patch(`admin/updateDepartment/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Global SuperSpeciality
  CreateMasterSuperSpeciality(data, token) {
    return http.post("admin/createMasterSuperSpeciality", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterSuperSpeciality(id, data, token) {
    return http.patch(
      `admin/updateMasterSuperSpeciality?superSpecialityId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetAllMasterSuperSpecialities(token) {
    return http.get("admin/findMasterSuperSpecialities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Global Categories
  CreateMasterCategory(data, token) {
    return http.post("admin/createMasterCategory", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterCategory(id, data, token) {
    return http.patch("admin/updateMasterCategory?categoryId=", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterCategory(token) {
    return http.get("admin/findMasterCategories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetDepartmentbyPermissionType(id, token) {
    return http.get(
      `admin/findMastersByPermissionType?permissionTypeId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetPermissionsByPermissionType(id, token) {
    return http.get(
      `admin/findPermissionsByPermissionType?permissionTypeId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  // ExamCenter

  FindAllExamCenters(token) {
    return http.get(`admin/getExamCenters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateExamCenter(data, token) {
    return http.post("/admin/createExamCenter", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindExamCenterById(id, token) {
    return http.get(`admin/getExamCenterById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateExamCenters(id, data, token) {
    return http.patch(`/admin/updateExamCenter/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Question
  FindAllQuestion(data, token) {
    return http.get(
      `admin/findAllQuestions?advertisement=${data.advertisement}&post_applied=${data.post_applied}&superSpeciality=${data.superSpeciality}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  CreateQuestion(data, token) {
    return http.post("admin/createQuestion", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllQuery(data, token) {
    return http.get(`admin/findAllQuery?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindQueryById(id, token) {
    return http.get(`admin/findQueryById?_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateQuery(id, data, token) {
    return http.patch(`/admin/updateQuery?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UploadExcelData(data, id, token) {
    return http.post(`admin/uploadExcelData?advertisement=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateScreeningDetail(data, id, token) {
    return http.patch(
      `admin/updateScreeningDetailOfApplication?_id=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  CreateFeeStructure(data, token) {
    return http.post(`admin/createFeeStructure${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllFeeStructure(token) {
    return http.get("admin/findAllFeeStructures", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTransactionDownload(id, type, iType, printOnly, token) {
    return http.get(`admin/${type}?${iType}=${id}`, {
      responseType: printOnly === "printOnly" ? "json" : "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateFeeStructure(data, id, token) {
    return http.patch(`admin/updateFeeStructure?_id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Admin
  GetAllUserType(token) {
    return http.get("user/userType/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateAdmin(data, token) {
    return http.post("user/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UploadExcel(data, token) {
    return http.post("admin/uploadExcelData", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateAdmin(data, id, token) {
    return http.patch(`admin/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Categories
  GetAllCategories(token) {
    return http.get("v1/master/masterCategory/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCategoriesId(id, token) {
    return http.get(`v1/master/getMasterDataById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCategories(data, token) {
    return http.post("v1/master/masterCategory/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCreById(id, token) {
    return http.get(`admin/cre/getById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Data
  GetAllCategoriesData(token) {
    return http.get("master/masterData/all?", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllCategoriesDataId(data, token) {
    return http.get(`master/masterData/all?categoryId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCategoriesData(data, token) {
    return http.post("v1/master/masterData/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UserByType(id, token) {
    return http.get(`/user/userByType?userTypeId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllAdmin(token) {
    return http.get("/admin/getAdminUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetSubAdmin(type, id, token) {
    return http.get(`/admin/getAdminUsersById?${type}=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetExcelDownload(id, token) {
    return http.get(`/admin/getAdminUsersById?adminId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getAllCategory(data, token) {
    return http.get(`master/getAllCategory?isHOD=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllCategoryByType(data, token) {
    return http.get(`master/getAllCategory?type=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllSpecialtiesId(id, token) {
    return http.get(`v1/master/masterData/all?categoryId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetOrgAdmins(token) {
    return http.get(`admin/getOrgAdmins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AssignApplication(data, token) {
    return http.patch(`admin/assignApplication`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  cellMasterData(cId, pId, val, token) {
    return http.get(
      `user/userByType?userTypeId=${cId}&parentId=${pId}&positionValue=${val}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  callPositions(token) {
    return http.get(`master/positions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  PlatformToken(data) {
    return http.get(`v1/master/platform?name=${data}`);
  }

  GetAllSms(token) {
    return http.get("admin/findAllSms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindCategory(aid, id, pwbd, token) {
    return http.get(
      `user/findCategoryList?advertisement=${aid}&id=${id}&pwbd=${pwbd}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAllState(token) {
    return http.get("/user/findStateCity", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindRequiredEducation(aid, id, token) {
    return http.get(
      `user/findRequiredEducation?advertisement=${aid}&id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAdvertisement(token) {
    return http.get("admin/findAllAdvertisement", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPostAppliedBySpecialityId(id, advertisementId, token) {
    return http.get(
      `user/findPostByAdvertisementAndSpecialityId/?id=${advertisementId}&superSpeciality=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetPreferredDepartementList(id, token) {
    return http.get(`user/findDepartmentDetails/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllTransition(data, token) {
    return http.get(`admin/findAllTransactions?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  VerifyTransaction(data, token) {
    return http.post(`user/verifySbiPayment`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDownloadChat(token, data) {
    return http.post(`/admin/downloadQueryChatsExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set Content-Type to application/json
      },
      responseType: "blob",
    });
  }
  FindScrutinyData(data, token) {
    return http.get(`v1/admin/findScrutinyData?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateVerificationStatus(data, token) {
    return http.patch(`v1/admin/updateScrutinyData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTransactionExcelHeaders(data, token) {
    return http.get(
      `v1/admin/getTransactionExcelHeaders?advertisementId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  CreateJobQueue(data, token) {
    return http.post(`v1/admin/createJobQueue`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateScrutinyStatus(data, token) {
    return http.patch(`admin/updateScrutinyStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateTempUserByExcel(data, token) {
    return http.post(`admin/createTempUserByExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadAdmitCardExcel(data, token) {
    return http.post(`v1/admin/uploadAdmitCardScehduleExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdmitCard(data, token) {
    return http.get(`v1/admin/getAllAdmitCard?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getAllotedCandidateData(instituteId, token) {
    return http.get(
      `admin/findInstituteAllotmentById?instituteAllotmentId=${instituteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  updateInstituteAllotment(id, data, token) {
    return http.patch(
      `admin/updateInstituteAllotmentByAdmin?instituteAllotmentId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  CountInstituteAllotmentByStatus(data, token) {
    return http.get(`admin/countInstituteAllotmentByStatus?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FilterByAdvertisementAndStatus(data, token) {
    return http.get(`admin/findAllcounsellingAllotment?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  NotifyUserForAdmitCard(data, token) {
    return http.post(`v1/admin/notifyUserForAdmitCard`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  AdmitCardDownload(data, token) {
    return http.post("v1/admin/downloadAdmitCard", data, {
      // responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadScoreCard(data, token) {
    return http.get(`v1/admin/downloadScoreCard?applicationId=${data}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterData(data, token) {
    return http.patch(`v1/master/updateMasterData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadFile(data, token) {
    return http.post(`user/uploadFile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  MasterCategoryByCode(data, token) {
    return http.get(`v1/master/masterCategoryByCode?code=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllInterviewPenal(data, token) {
    return http.get(`admin/findAllGroup?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindAllSubAdmin(data, token) {
    return http.get(`admin/findAllSubAdmin?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateSubAdminCellHead(data, token) {
    return http.post(`admin/createAdminMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetRoles(data, token) {
    return http.get(`master/getRoles?code=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateGroup(data, token) {
    return http.post(`admin/createGroup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindGroup(id, token) {
    return http.get(`admin/findGroup?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findAllInterviewPanel(token) {
    return http.get(`/admin/findAllGroup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindApprovedApplications(data, token) {
    return http.get(`admin/findAllApplicationInterview?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllInterview(data, token) {
    return http.get(`admin/findAllInterview?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AssignMultipleInterviews(data, token) {
    return http.post(`admin/assignMultipleInterviews`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateInterview(data, token) {
    return http.post(`admin/createInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateMultipleInterview(data, token) {
    return http.post(`admin/createMultipleInterviews`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  InterviewApplicationForMember(params, data, token) {
    return http.get(
      `admin/findAllApplicationInterviewForMember?${params}&${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  InterviewApplicationDataForMember(id, token) {
    return http.get(`admin/findApplicationInterviewForMember?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  InterviewForMember(data, token) {
    return http.get(`admin/findAllInterviewForMember?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ApplicationInterview(data, token) {
    return http.get(`admin/findApplicationInterview?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ViewInterview(id, token) {
    return http.get(`admin/findInterview?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateInterview(data, token) {
    return http.patch(`admin/updateInterview?id=${data?._id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateInterviewStats(data, token) {
    return http.patch(`admin/updateInterviewStats?id=${data?._id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllInterviewApplications(data, token) {
    return http.get(`admin/findApprovedApplications?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateUserInterview(data, token) {
    return http.post(`admin/createUserInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllUserInterview(token) {
    return http.get(`admin/findAllUserInterview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllUserInterviewById(id, token) {
    return http.get(`admin/findUserInterview?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Enable Interview Edit
  AllowInterviewStatesUpdate(data, token) {
    return http.patch(`admin/allowInterviewStatesUpdate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AssignMultipleInterviewsUpdate(data, token) {
    return http.patch(`admin/transferApplicationInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateApplicationInterview(data, token) {
    return http.patch(`admin/updateApplicationInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AllScoreInterviewById(id, token) {
    return http.get(`admin/findSubmittedInterviewForMember?interview=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetApplicationSummaryUrl(id, token) {
    return http.get(`admin/getApplicationSummaryUrl?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  RemoveInterviewMarks(id, token) {
    return http.patch(
      `admin/removeInterviewMarks?id=${id}`,
      { data: null },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  ReAssignMultipleInterviews(data, token) {
    return http.post(`admin/assignGroupToApplicationInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllApplicationStats(data, token) {
    return http.get(`admin/findAllApplicationStats?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindTransactionsStats(id, token) {
    return http.get(`v1/admin/findTransactionsStats?advertisementId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindDocumentVerificationList(id, token) {
    return http.get(
      `admin/findDocumentVerificationList?advertisementId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FindDocumentVerificationById(id, token) {
    return http.get(`admin/findDocumentVerificationById?applicationId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindShortListingApplicationById(id, token) {
    return http.get(
      `admin/findShortListingApplicationById?applicationId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateDocumentRemarkAndStatus(data, token) {
    return http.patch(`admin/updateDocumentRemarkAndStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindAllSubmittedScoreInterviewById(id, token) {
    return http.get(`admin/findSubmittedInterview?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindScrutinyStats(data, token) {
    return http.get(`v1/admin/findScrutinyStats?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindDepartmentListForInterview(id, token) {
    return http.get(`admin/findDepartmentListForInterview?interviewId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  LockAwardSheet(data, token) {
    return http.post(`admin/lockAwardSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UnlockAwardSheet(data, token) {
    return http.post(`admin/unlockAwardSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ScheduleMeeting(data, token) {
    return http.post(`admin/scheduleMeeting`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateScreeningDetails(data, token) {
    return http.patch(`admin/updateScreeningDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ChangeGroupIdInApplicationInterview(data, token) {
    return http.post(`admin/changeGroupIdInApplicationInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  //CRE

  MasterData(code, token) {
    return http.get(`master/masterData/new/all?code=${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreAll(token) {
    return http.get(`admin/cre/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreCreate(data, token) {
    return http.post(`admin/cre/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  UpdateCre(id, data, token) {
    return http.patch(`admin/cre/update?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  UpdateCreFinalSubmit(id, data, token) {
    return http.post(`admin/cre/finalSubmit?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  FindShortListingApplication(id, token) {
    return http.get(`admin/findShortListingApplication?advertisementId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateDocumentFinalStatus(data, token) {
    return http.patch(`admin/updateDocumentFinalStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateScreeningFinalStatusByAdmin(data, token) {
    return http.patch(`admin/updateScreeningDocumentFinalStatusByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateInterviewDocumentStatus(data, token) {
    return http.patch(`admin/updateInterviewDocumentStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateScreeningFinalStatus(data, token) {
    return http.patch(`admin/updateScreeningFinalStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateInterviewApplicationStatus(data, token) {
    return http.patch(`admin/updateInterviewApplicationStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findApplicationScreeningList(id, token) {
    return http.get(`admin/findApplicationScreeningList?${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findApplicationScreeningById(id, token) {
    return http.get(`admin/findApplicationScreeningById?applicationId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateDocumentScreening(data, token) {
    return http.patch(`admin/updateDocumentScreening`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateObjectiveScreening(data, token) {
    return http.patch(`admin/updateObjectiveScreening`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateObjectiveFinalStatus(data, token) {
    return http.patch(`admin/updateObjectiveFinalStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateScreeningFinalStatusByAdminFinal(data, token) {
    return http.patch(`admin/updateScreeningFinalStatusByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllMeetings(data, token) {
    return http.get(`admin/findAllMeetings?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindApplicationScreeningList(data, token) {
    return http.get(`admin/findApplicationScreeningList?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateMeeting(data, token) {
    return http.post(`admin/createMeeting`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AssignMeeting(data, token) {
    return http.post(`admin/assignMeeting`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FinalSubmissionList(data, token) {
    return http.get(`admin/finalSubmissionList?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateFinalSubmission(data, token) {
    return http.patch(`admin/updateFinalSubmissionStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SendOTP(token) {
    return http.get(`admin/sendfinalSubmissionOtp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllCommittee(data, token) {
    return http.get(`admin/findAllCommittee?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findApplicationScreeningStats(id, token) {
    return http.get(`admin/findApplicationScreeningStats?${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findAllDepartmentForHOD(id, token) {
    return http.get(`admin/findAllDepartmentForHOD?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getExcelFormateLinkByType(data, token) {
    return http.get(
      `admin/getExcelFormateLinkByType?excelFormateLinkType=UploadInsitute`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      },
    );
  }

  uploadApplicationData(data, token) {
    return http.post(`admin/counsellingId`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  uploadInstituteData(data, token) {
    return http.post(`admin/uploadCounsellingInstituteData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findAllDepartmentForCellHead(id, token) {
    return http.get(
      `admin/findAllDepartmentForCellHead?advertisementId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  SendCommitteeNoticeOtp(token) {
    return http.get(`admin/sendCommitteeNoticeOtp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  findMeetingById(id, token) {
    return http.get(`admin/findMeetingById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCommittee(data, token) {
    return http.post(`admin/createCommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  candidateListByMeetingId(params, token) {
    return http.get(`admin/candidateListByMeetingId?meetingId=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMeeting(data, token) {
    return http.patch(`admin/updateCommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateMeeting(data, token) {
    return http.patch(`admin/updateMeeting`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindCommitteeById(id, token) {
    return http.get(`admin/findCommitteeById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadHODeSignPdf(id, token) {
    return http.get(`admin/downloadHODeSignPdf?groupId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
  }
  UploadHODeSignPdf(data, token) {
    return http.post(`admin/uploadHODeSignPdf`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  needClarificationCandidateList(params, token) {
    return http.get(`admin/needClarificationCandidateList?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SendScreeningOTP(data, token) {
    return http.post(`admin/sendfinalSubmissionOtp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  verifyFinalSubmissionOtp(data, token) {
    return http.post(`admin/verifyFinalSubmissionOtp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getCommitteeMembers(params, token) {
    return http.get(`admin/getCommitteeMembers?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FinalSummaryCounts(params, token) {
    return http.get(`admin/finalSummaryCounts?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindCommitteeMembersList(params, token) {
    return http.get(`admin/findCommitteeMembersList?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindApplicationScreeningStatsByAdvertisementId(data, token) {
    return http.get(
      `admin/findApplicationScreeningStatsByAdvertisementId${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  allowDocumnetToReupload(data, token) {
    return http.patch(`admin/allowDocumnetToReupload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  allowObjectiveDocToReupload(data, token) {
    return http.patch(`admin/allowObjectiveDocToReupload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetScreeningReport(params, token) {
    return http.get(`admin/getScreeningReport?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
  }
  getDocumentScreeningConditions(id, token) {
    return http.get(
      `admin/getDocumentScreeningConditions?applicationId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UploadInterviewHODExcel(data, token) {
    return http.post(`admin/uploadInterviewHODExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadApplicationExcelForInterview(data, token) {
    return http.post(`admin/uploadApplicationExcelForInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadInterviewExcel(data, token) {
    return http.post(`admin/uploadInterviewExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetUserMeetingByUserId(token) {
    return http.get(`admin/getUserMeetingByUserId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetScreeningTrailByAppId(data, token) {
    return http.get(`admin/getScreeningTrailByAppId?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllQueriesTicketRFQ(data, token) {
    return http.get(`admin/findAllExamQuery?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetQueryByIdRFQ(id, token) {
    return http.get(`admin/findExamQueryById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  PatchQueryRFQ(data, token) {
    return http.patch("admin/updateExamQuery", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ScheduleRFQ(data, token) {
    return http.post("admin/scheduleRFQ", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetScheduledRFQList(token) {
    return http.get("admin/getScheduledRFQList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getQueryCategoryList(token) {
    return http.get(`user/getQueryCategoryList`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateTempPass(data, token) {
    return http.post(`admin/updateTempPass`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddInstituteAdmin(data, token) {
    return http.post(`admin/addInstituteAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getAllCounsellingInstitutes(token) {
    return http.get(`admin/findAllInstitutes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllNotificationCandidate(data, token) {
    return http.get(`admin/getAllNotification?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddNotification(data, token) {
    return http.post(`admin/addNotification`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetIdNotification(data, token) {
    return http.get(`admin/getIdNotification?id=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateNotification(data, token) {
    return http.patch(`admin/updateNotification?id=${data?.id}`, data?.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findAdvertisementForHOD(data, token) {
    return http.get(`/admin/findAdvertisementByRole?loginType=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindAllScoreCardStageOne(data, token) {
    return http.get(`admin/findAllScoreCard?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCommitteeByAdmin(data, token) {
    return http.post(`admin/createCommitteeByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllSubAdminAndHod(data, token) {
    return http.get(`admin/findAllSubAdminAndHod?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCounsellingByAdmin(data, token) {
    return http.post(`admin/createCounselling`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllCounselling(token) {
    return http.get(`admin/findAllCounsellings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DeleteCounselling(data, token) {
    return http.delete(`admin/deleteCounselling?counsellingId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindCounsellingbyId(data, token) {
    return http.get(`admin/findCounsellingById?counsellingId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetStudentAllotmentStats(data, token) {
    return http.get(`admin/getCandidateStats?counsellingId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetStudentAllotmentUsers(data, token) {
    return http.get(
      `admin/getStudentAllotmentStatsFromCounsellingApplication?counsellingId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAllotmentUserDetails(data, token) {
    return http.get(`admin/getInstituteAllotmentByRound?roundNumber=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCounsellingApplicationData(data, token) {
    return http.get(
      `admin/getCounsellingApplicationsDataByCounsellingId?_id=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetExcelTemplate(data, token) {
    return http.get(
      `admin/getExcelFormateLinkByType?excelFormateLinkType=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetInstituteWisePreference(data, token) {
    return http.get(
      `admin/getInstituteWisePreferenceCount?counsellingId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetInstituteLastRound(data, token) {
    return http.get(
      `admin/getInstituteAllotmentLastRound?counsellingId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  UpdateCounselling(id, data, token) {
    return http.patch(`admin/updateCounselling?counsellingId=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadCounsellingInstitute(id, data, token) {
    return http.post(
      `admin/uploadCounsellingInstituteData?counsellingId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetInstituteAllotment(data, token) {
    return http.get(`admin/getInstituteAllotmentByRound?roundNumber=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetOptionalChoice(data, token) {
    return http.get(
      `admin/findOptionalchoiceByCounsellingId?counsellingId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  CreateInstituteAllotment(data, token) {
    return http.post(`admin/createInstituteAllotments`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  exportApplicationsByAdvertisement(data, token) {
    return http.get(
      `admin/exportApplicationsByAdvertisement?advertisement_noId=665d918b6a81a8605fd292e5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      },
    );
  }

  CreateOptionalExercise(id, data, token) {
    return http.patch(
      `admin/updateAllotmentExerciseDate?counsellingId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UploadCounsellingCandidate(id, data, token) {
    return http.post(
      `admin/uploadCounsellingApplication?counsellingId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  AddMembersToCommittee(data, token) {
    return http.post(`admin/addMembersToCommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetScreeningHeads(data, token) {
    return http.get(`admin/getScreeningHeads?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFinalMembers(data, token) {
    return http.get(`admin/getFinalMembers?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFindOneGroup(data, token) {
    return http.get(`admin/findOneGroup?groupId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateCommitteeByAdmin(data, token) {
    return http.post(`admin/updateCommitteeByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getExcelFinalSubmissionList(params, token) {
    return http.get(`admin/getExcelFinalSubmissionList?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
  }
  DetailedScreeningReport(data, token) {
    return http.post(`admin/detailedScreeningReport`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
  }
  SendScreeningHODMail(data, token) {
    return http.post(`admin/sendScreeningHODMail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  adminLockScreening(data, token) {
    return http.post(`admin/lockScreening`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  adminUnlockScreening(data, token) {
    return http.post(`admin/unlockScreening`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindGroupsByAdv(data, token) {
    return http.get(`admin/findGroupsByAdv?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CheckTwoFactorStatus(data, token) {
    return http.post(`admin/check2FARequiredStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  VerifyTwoFactorStatus(data, token) {
    return http.post(`admin/verify2FA`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindInterviewPanelOfAdmin(id, token) {
    return http.get(`admin/findInterviewPanelOfAdmin?interviewId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindApplicationInterviewByGroup(params, token) {
    return http.get(`admin/findApplicationInterviewByGroup?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findApplicationInterviewById(id, token) {
    return http.get(`admin/findApplicationInterviewById?_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddHeadsToCommittee(data, token) {
    return http.post(`admin/addHeadsToCommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCommitteeInterview(data, token) {
    return http.post(`admin/createCommitteeForHrSubCommitteeByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateCommitteeInterview(data, token) {
    return http.post(`admin/updateCommitteeForHrSubCommitteeByAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SendAwardSheetOTP(type, token) {
    return http.post(`admin/sendAwardSheetOTP`, type, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetInterviewResult(query, token) {
    return http.get(`admin/getInterviewResult?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CalculateInterviewResult(data, token) {
    return http.post(`admin/calculateInterviewResult`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ChairPersonSendOtpToMember(data, token) {
    return http.post(`admin/sendFinalAwardSheetOTP`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  LockFinalAwardSheet(data, token) {
    return http.post(`admin/lockFinalAwardSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAwardsheetStatus(query, token) {
    return http.get(`admin/getAwardsheetStatus?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindSeatsOfAdvertisements(query, token) {
    return http.get(`admin/findSeatsOfAdvertisement?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateWaitingList(data, token) {
    return http.patch(`admin/updateWaitingList`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ResendFinalAwardSheetOTP(data, token) {
    return http.post(`admin/resendFinalAwardSheetOTP`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FinalSelectionListDownload(data, token) {
    return http.get(`admin/getFinalAwardSheetSummary?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCounsellingApplicationStatusSummary(data, token) {
    return http.get(
      `admin/fetchCounsellingApplicationStatusSummary?counsellingId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FindPositionByDepartment(id, token) {
    return http.get(`admin/findPositionByDepartment?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  AddSubjectExpert(data, token) {
    return http.post(`admin/addSubjectExpert`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetInterviewStatistics(data, token) {
    return http.get(`admin/getInterviewStatistics?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetInterviewStatsDepartmentWise(data, token) {
    return http.get(`admin/getInterviewStatsDepartmentWise?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  Send2FAOtp(data, token) {
    return http.post(`admin/send2FAOtp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  Send2FAOtp(data, token) {
    return http.post(`admin/send2FAOtp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateInterviewGrade(data, token) {
    return http.post(`admin/updateInterviewGrade`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindUpdatedGradeList(data, token) {
    return http.get(`admin/findUpdatedGradeList?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMemberDetails(data, token) {
    return http.patch(`admin/updateMemberDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateApplicationInterviewReports(data, token) {
    return http.patch(`admin/updateApplicationInterviewReports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetUploadInstituteExcelErrors(id, data, token) {
    return http.post(
      `admin/uploadCounsellingInstituteData?counsellingId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetUploadCandidatesExcelErrors(id, data, token) {
    return http.post(
      `admin/uploadCounsellingApplication?counsellingId=${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  EnrollFace(data, token) {
    return http.post(`admin/enrollFace`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FaceAuthenticate(data, token) {
    return http.post(`admin/faceAuthenticate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetInstituteAllotmentData(data, token) {
    return http.post(
      `admin/getInstituteAllotmentsByAdvertisementAndInstituteId`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAllInstituteAllotmentStats(param, token) {
    return http.get(`admin/getAllInstituteAllotmentStats?${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAdminById(adminId, token) {
    return http.get(`admin/getAdminById?adminId=${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  FindAllInstitutesForNORCET(token) {
    return http.get(`admin/findAllInstitutesForNORCET`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDocumentsByInstituteAllotmentId(id, token) {
    return http.get(
      `admin/getDocumentsByInstituteAllotmentId?instituteallotmentId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAllInstituteRoles(param, token) {
    return http.get(`admin/getPanelRolesForInstitute` + param, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateInstituteMembers(data, token) {
    return http.post(`admin/createInstituteMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateFaceSession(token) {
    return http.post("admin/createFaceSession", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFaceSessionResult(id, token) {
    return http.get(`admin/getSessionResultById?sessionId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  MapCandidateDocuments(data, token) {
    return http.post(`admin/mapCandidateDocuments`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCandidateForMapping(query, token) {
    return http.get(`admin/getRemainingCandidateForMapping?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetInstituteMembers(query, token) {
    return http.get(`admin/getInstituteMembers?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateInstituteDocStatus(data, token) {
    return http.patch(`admin/updateInstituteDocStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateInstituteScreeningStatus(data, token) {
    return http.patch(`admin/updateInstituteScreeningStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SendInterviewCredentialMail(data, token) {
    return http.post(`admin/sendInterviewCredentialMail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateInstituteScreeningSchedule(data, token) {
    return http.post(`admin/createInstituteScreeningSchedule`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetInstituteScreeningSchedule(token) {
    return http.get(`admin/getInstituteScreeningSchedule`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateMemberAttendance(data, token) {
    return http.patch(`admin/updateMemberAttendence`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindInstituteById(id, token) {
    return http.get(`/admin/findInstituteById?instituteId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  AddScrutinyData(data, token) {
    return http.post(`v1/admin/addScrutinyData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  DeleteCommittee(data, token) {
    return http.delete(`admin/deleteCommitteeByAdminn?id=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCommitteeCount(data, token) {
    return http.get(
      `admin/getCountOfCommitteeForDepartment?departmentId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  SendScreeningCredentialMail(data, token) {
    return http.post(`admin/sendScreeningCommitteeCredentialMail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ConvertRejectedScrutinyToPending(data, token) {
    return http.patch(`v1/admin/convertRejectedScrutinyToPending`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreatePermission(data, token) {
    return http.post(`admin/createPermission`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdatePermission(data, token) {
    return http.patch(`admin/updatePermission`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SendInterviewResultToCellAdmin(data, token) {
    return http.post(`admin/sendInterviewResultToCellAdmin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // UPPRB----------------------------------------------------------------------------------------------------------
  // Login Services
  Login(data) {
    return http.post(`v1/admin/login`, data);
  }

  GetPermissionByUserId(query, token) {
    return http.get(`v1/admin/getPermissionByUserId?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SubmitAdhiyaachan(data, token) {
    return http.post(`v1/adhiyaachan/adhiyaachanSubmission`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SubmitAdvertisementRelease(data, token) {
    return http.post(`v1/advertisement/advertisementRelease`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateAdhiyaachan(data, token) {
    return http.patch(`v1/adhiyaachan/updateAdhiyaachan`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllAdhiyaachanList(query, token) {
    return http.get(`v1/adhiyaachan/getAllNewAdhiyaachan?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllAdvertisement(query, token) {
    return http.get(`v1/advertisement/findAllnewAdvertisement?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAdhiyaachanWorkflow(token) {
    return http.get(`v1/adhiyaachan/adhiyaachanApprovalWorkFlow`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetDashboardStat(token) {
    return http.get(`v1/adhiyaachan/adhiyaachanDashBoard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAdhiyaachanById(data, token) {
    return http.get(`v1/adhiyaachan/adhiyaachanById?id=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAdhiyaachanAllMessages(data, token) {
    return http.get(`v1/adhiyaachan/allMessageAdhiyaachanById?id=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SubmitDetailsOfAdvertisement(data, token) {
    return http.post(
      `v1/detailsOFAdvertisement/createDetailsOFAdvertisement`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  SendMessageAdhiyaachan(data, token) {
    return http.post(`v1/adhiyaachan/adhiyaachanMessage`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateAdhiyaachanAdvertisement(data, token) {
    return http.patch(`v1/advertisement/updateAdvertisement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetKuhsalAdvertisements(query, token) {
    return http.get(`v1/advertisement/findAllAdv?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllApplications(query, token) {
    return http.get(`v1/admin/applications?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDocumentVerificationData(query, token) {
    return http.get(
      `v1/ApplicationScreening/fetchApplicationDocumentVerificationData?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetSportsStatistics(data) {
    return http.get(`v1/admin/fetchSportsStatistics?advertisementId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetSportsbyTeams(data) {
    return http.get(`v1/admin/getSportsListBasedOnTeam?teamId=${data}`);
  }
  GetPieCharData(query) {
    return http.get(`v1/admin/getScrutinyStatusData?${query}`);
  }
  GetAllAdvertisementWithoutToken(query) {
    return http.get(`v1/advertisement/findAllAdvertisement?${query}`);
  }
  GetAllSports(query, token) {
    return http.get(`v1/admin/getAllSports?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKuhsalApplicationsById(data) {
    return http.get(`v1/admin/applications/${data}`);
  }
  GetAdvertisementPost(token) {
    return http.get(`v1/advertisement/getPostNames`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllStates(token) {
    return http.get(`v1/admin/getStates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Kushal Khiladi APIs

  GetCandidatePerformance(query, token) {
    return http.get(`v1/admin/getCandidateDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCardModuleInformation(query, token) {
    return http.get(`v1/admin/fetchSportsDataTilesWise?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  DownloadKushalExcel(query, token) {
    return http.get(`${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  DownloadKushalPdf(query, token) {
    return http.get(`${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllKushalFilters(token) {
    return http.get(`v1/admin/fetchStatePostTeamData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetKushalSubSportDetails(query, token) {
    return http.get(`v1/admin/fetchSubSportsDataTilesWise?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKushalSubSportCategoriesDetails(query, token) {
    return http.get(`v1/admin/fetchSportsCategoriesStatistics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetKushalVenuesByEventID(query, token) {
    return http.get(`v1/admin/getVenues?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetKushalExaminationStatistics(token) {
    return http.get(`v1/admin/fetchExaminationStatistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  DeleteKushalVenues(data, token) {
    return http.delete(`v1/admin/venueDelete?venueId=${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKushalAddVenues(data, token) {
    return http.post(`v1/admin/addVenue`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDVstep(data, token) {
    return http.post(
      `v1/ApplicationScreening/updateApplicationScreeningStep`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateKushalAddVenues(data, token) {
    return http.patch(`v1/admin/updateVenue`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllTrialMarks(query, token) {
    return http.get(`v1/admin/getAllTrialMarks?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateTrialMarks(data, token) {
    return http.patch(`v1/admin/updateTrialMarks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadRefreeMarks(data, token) {
    return http.post(`v1/admin/uploadRefreeMarksWithSign`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadCommitteeMarks(data, token) {
    return http.post(`v1/admin/uploadCommitteeMarksWithSign`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  Upload20Marks(data, token) {
    return http.post(`v1/admin/upload20MarksCommitteeMarksWithSign`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UploadCertificateMarks(data, token) {
    return http.post(`v1/admin/createcertificateMarks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UploadCertificateStatus(data, token) {
    return http.patch(`v1/admin/updatecertificationStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMarksCommittee(query, token) {
    return http.get(`v1/admin/getAllCommitteeMarks?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMarksCommittee(data, token) {
    return http.patch(`v1/admin/updateCommitteeMarks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVenueBySportId(query, token) {
    return http.get(`v1/admin/getVenues?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Kushal Master Data
  GetAllKushalAdvertisement(token) {
    return http.get(`v1/user/findAllAdvertisement`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKushalAdvertisementSelect(query, token) {
    return http.get(`v1/advertisement/advertisementDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKuhsalTeams(query, token) {
    return http.get(`v1/admin/findAllGroup?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetKuhsalTeamsByID(id, token) {
    return http.get(`v1/admin/findGroup?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  RemoveGroupMember(data, token) {
    return http.patch(`v1/admin/removeGroupMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateMember(data, token) {
    return http.post(`v1/admin/createAdminMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMember(data, token) {
    return http.patch(`v1/admin/updateAdminMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DeleteMember(id, token) {
    return http.delete(`v1/admin/adminMember?userId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMembers(query, token) {
    return http.get(`v1/admin/findAllSubAdmin?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetMemberRole(token) {
    return http.get(`v1/master/getRoles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateTeam(data, token) {
    return http.post(`v1/admin/createGroup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateGroup(data, token) {
    return http.patch(`v1/admin/updateGroup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetMarksIntegrationData(query, token) {
    return http.get(`v1/admin/getMarksIntegrationData?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetMarksIntegrationFilters(token) {
    return http.get(`v1/admin/fetchAllMarksIntegrationFilterData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateApplicationScreening(data, token) {
    return http.patch(
      `v1/ApplicationScreening/updateApplicationScreening`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateAppllicationScreeningDocumentStatus(data, token) {
    return http.patch(
      `v1/ApplicationScreening/updateAppllicationScreeningDocumentStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateScreeningApplicationStatus(data, token) {
    return http.patch(
      `v1/ApplicationScreening/updateScreeningApplicationStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetApplicationScrutinyDetails(data, token) {
    return http.get(
      `v1/ApplicationScrutiny/getApplicationScrutinyDetails?${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetApplicationsScrutiny(data, token) {
    return http.get(`v1/ApplicationScrutiny/getApplicationsScrutiny?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCardWiseUserDetails(data, token) {
    return http.get(`v1/admin/getApplicationsDataTilesWise?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateApplicationScrutinyStatus(data, token) {
    return http.patch(
      `v1/ApplicationScrutiny/updateApplicationScrutinyStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FetchApplicationScreeningDetails(data, token) {
    return http.get(
      `v1/ApplicationScreening/fetchApplicationScreeningDetails?${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateScreeningApplicationDocument(data, token) {
    return http.get(
      `v1/ApplicationScreening/updateScreeningApplicationStatus?${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateAppllicationScreeningDetailsStatus(data, token) {
    return http.patch(
      `v1/ApplicationScreening/updateAppllicationScreeningDetailsStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetShortlistedCandidates(query, token) {
    return http.get(`v1/admin/getShortlistedCandidates?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetVenueDetails(query, token) {
    return http.get(`v1/admin/venueDetailById?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdmitCardCandidateDetails(query, token) {
    return http.get(`v1/admin/applicationForVenue?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  AddCandidateToVenue(data, token) {
    return http.post(`v1/admin/addCandidateToVenue`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ReleaseAdmitCard(query, token) {
    return http.patch(
      `v1/admin/eventVenueReleaseAdmitCard?${query}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  UpdateCertificateVerification(data, token) {
    return http.patch(
      `v1/admin/addCertificateVerificationDispatchDetails`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  GetAllCandidateVerification(query, token) {
    return http.get(
      `v1/admin/getDispatchedCertificatesForVerification?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  AuthoritiesCertificateVerification(data, token) {
    return http.patch(`v1/admin/verifyCertificate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  BoardCertificateVerification(data, token) {
    return http.patch(`v1/admin/processBoardVerification`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFinalResult(query, token) {
    return http.get(`v1/admin/getFinalResults?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadFinalResult(query, token) {
    return http.get(`v1/admin/downloadFinalResultKaushalKhiladi?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetReleaseAdmitCardDetails(query, token) {
    return http.get(`v1/admin/getVenuesCandidates?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllCourses(token) {
    return http.get(`v1/master/findMasterByCode`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCertificateMarking(token) {
    return http.get(`v1/admin/fetchCertificateMarking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdvByCourse(query, token) {
    return http.get(`v1/user/findAllAdvertisement?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // --Promotion

  SeniorityForPromotion(params, token) {
    return http.get(`v1/promotion/seniorityForPromotion?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  CreateSeniority(data, token) {
    return http.post(`v1/promotion/seniority`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateSeniorityForPromotion(data, token) {
    return http.patch(`v1/promotion/updateSeniorityForPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DeleteSeniority(data, token) {
    return http.delete(`v1/promotion/seniority?id=${data?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadSeniorityPromotionData(data, token) {
    return http.post(`v1/promotion/uploadSeniorityPromotionData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  EligibilityForPromotion(params, token) {
    return http.get(`v1/promotion/eligibilityForPromotion?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateEligibility(data, token) {
    return http.post(`v1/promotion/eligibility`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateEligibilityForPromotion(data, token) {
    return http.patch(`v1/promotion/updateEligibilityForPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DeleteEligibility(data, token) {
    return http.delete(`v1/promotion/eligibility?id=${data?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadEligibilityPromotionData(data, token) {
    return http.post(`v1/promotion/uploadEligibilityForPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DPCPromotionList(params, token) {
    return http.get(`v1/promotion/dcpForPromotion?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PromotionMeritList(params, token) {
    return http.get(`v1/promotion/getMeritList?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PromotionQualifiedCandidates(params, token) {
    return http.get(`v1/promotion/getQuilifiedList?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdatePhysicalQualification(data, token) {
    return http.patch(`v1/promotion/updatephysicalpromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDcpPromotion(data, token) {
    return http.patch(`v1/promotion/updateDcpPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // --Promotion Ends

  // --Vendor Starts

  FindMasterByCode() {
    return http.get(`v1/master/findMasterByCode`);
  }

  UserFindAllAdvertisement(params) {
    return http.get(`v1/user/findAllAdvertisement?${params}`);
  }
  GetAllWorkScope(params, token) {
    return http.get(`v1/admin/vendor/getAllWorkScope?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetWorkScopeByVendorId(params, token) {
    return http.get(`v1/admin/writtenExam/getWorkScopeByVendorId?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SaveVendorDetail(data, token) {
    return http.post(`v1/admin/vendor/saveVendorDetail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorByWorkScope(params, token) {
    return http.get(`v1/admin/vendor/getVendorByWorkScope?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMOU(params, token) {
    return http.get(`v1/admin/vendor/getAllMOU?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateVendorAgreement(data, token) {
    return http.patch(`v1/admin/vendor/updateVendorAgreement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllVendors(params, token) {
    return http.get(`v1/admin/vendor/getAllVendors?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  VendorWorkOrderReleased(data, token) {
    return http.patch(`v1/admin/vendor/vendorWorkOrderReleased`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateVendorStatus(data, token) {
    return http.patch(`v1/admin/vendor/updateVendorStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SaveUpdateVendorWorkCompletion(data, token) {
    return http.post(`v1/admin/vendor/saveUpdateVendorWorkCompletion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllVendorWorkCompletions(params, token) {
    return http.get(`v1/admin/vendor/getAllVendorWorkCompletions?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorByAdvertisement(query, token) {
    return http.get(`v1/admin/vendor/getAllVendors?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SaveUpdateVendorPaymentDetails(data, token) {
    return http.post(`v1/admin/vendor/saveUpdateVendorPaymentDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorPaymentDetails(params, token) {
    return http.get(`v1/admin/vendor/getVendorPaymentDetails?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddMou(data, token) {
    return http.post(`v1/admin/vendor/addMou`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddWorkScope(data, token) {
    return http.post(`v1/admin/vendor/addWorkScope`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // --Vendor Ends

  // DVPST
  GetAllDVPSTApplications(query, token) {
    return http.get(
      `v1/admin/Dvpst/fetchDvpstDocumentVerificationData?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  UpdateDVPSTScreening(data, token) {
    return http.patch(
      `v1/ApplicationScreening/updateApplicationScreening`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  FetchDVPSTScreeningDetails(data, token) {
    return http.get(`v1/admin/Dvpst/fetchDvpstApplicationDetails?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FetchDVPSTPrintDetails(data, token) {
    return http.get(`v1/admin/Dvpst/fetchDvpstApplicationData?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateDVPSTScreeningDetailsStatus(data, token) {
    return http.patch(
      `v1/admin/Dvpst/updateAppllicationScreeningDetailsStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  UpdateDVPSTApplicationStatus(data, token) {
    return http.patch(`v1/admin/Dvpst/updateDvpstApplicationStatus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateDVPSTScreeningDocumentStatus(data, token) {
    return http.patch(
      `v1/admin/Dvpst/updateAppllicationScreeningDocumentStatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateDVPSTPhysicalStanderdTest(data, token) {
    return http.post(`v1/admin/dvpst/physicalStandardTest`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadDVPSTSignature(data, token) {
    return http.post(`v1/ApplicationScreening/uploaddvpstSignature`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateDVPSTBoardDecision(data, token) {
    return http.patch(
      `v1/ApplicationScreening/verifiedApplicationScreening`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  FetchDVPSTPrintPageDetails(data, token) {
    return http.get(
      `v1/ApplicationScreening/fetchScreeningDetail?applicationId=${data}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UploadSportsCertificate(data, token) {
    return http.post(`v1/admin/uploadSportsCertificate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDVPSTstep(data, token) {
    return http.post(
      `v1/ApplicationScreening/updateApplicationDvpstStep`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  // DVPST End

  // written examination
  SaveVendorSelection(data, token) {
    return http.post(`v1/admin/writtenExam/saveVendorSelection`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorById(query, token) {
    return http.get(`v1/admin/writtenExam/getVendorSelected?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddWorkOrder(data, token) {
    return http.post(`v1/admin/vendor/addWorkOrder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Venue Management
  GetVenueDynamicAccordians(query, token) {
    return http.get(`v1/admin/get-form?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllOrder(params, token) {
    return http.get(`v1/admin/vendor/getAllWorkOrder?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCenters(query, token) {
    return http.get(`v1/admin/center/getCenterBydistrict?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetPhysicalByAdvertisement(query, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getVendorSelected?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  AddOrder(data, token) {
    return http.post(`v1/admin/vendor/addWorkOrder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPhysicalWorkScope(params, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getWorkScopeByVendorId?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetCBTCenterVerificationData(query, token) {
    return http.get(`v1/admin/center/getcbtcenterverification?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPhysicalById(query, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getVendorSelected?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  VendorByWorkScopeData(params, token) {
    return http.get(
      `v1/admin/vendor/getVendorPaymentDetailsById?id=${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  OtherWorkList(params, token) {
    return http.get(`v1/admin/vendor/getAllWorkOrder?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SavePhysicalSelection(data, token) {
    return http.post(
      `v1/admin/physicalEfficiencyTest/saveVendorSelection`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetAllMasterDistrict(query, token) {
    return http.get(`v1/district/getMasterDistricts?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AddOtherWork(data, token) {
    return http.post(`v1/admin/vendor/addWorkOrder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllUserRoles(token) {
    return http.get(`v1/role/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorByIdHistory(id, token) {
    return http.get(`v1/admin/vendor/getVendorById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterByDistrict(query, token) {
    console.log("GetCenterByDistrict",{query, token});
    return http.get(`v1/admin/center/getCenterBydistrict?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetWorkScopeByAdvId(params, token) {
    return http.get(`v1/admin/vendor/getWorkScopeByAdvId?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllUsers(query, token) {
    return http.get(`v1/admin/findAllSubAdmin?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetStates(token) {
    return http.get(`v1/district/getStates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllZone(query, token) {
    return http.get(`v1/district/getAllZone?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDistricts(query, token) {
    return http.get(`v1/district/getAllDistrict?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllCenters(query, token) {
    return http.get(`v1/center/getCenters?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetModuleWiseUsers(query, token) {
    return http.get(`v1/center/getmodulewiseusers?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetUsersByCenter(query, token) {
    return http.get(`v1/center/getcentersusers?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllRoles(query, token) {
    return http.get(`v1/role/admin/all?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllManpower(query, token) {
    return http.get(`v1/center/getmanpowers?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPublishDates(query, token) {
    return http.get(`v1/admin/sendshiftwiseDate?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdmitCardStats(query, token) {
    return http.get(`v1/admin/getadmitcardStatics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadSampleAdmitExcel(token) {
    return http.get(`v1/admin/downloadAdmitCardExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllObservers(query, token) {
    return http.get(`v1/center/getcenterobserver?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateVenueUser(data, token) {
    return http.post(`v1/admin/center/createuser`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateVenueUser(data, token) {
    return http.patch(`v1/admin/updatecenteruser`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateZone(data, token) {
    return http.post(`v1/district/zone`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateDistrict(data, token) {
    return http.post(`v1/district/createdistrict`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCenter(data, token) {
    return http.post(`v1/center/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateRole(data, token) {
    return http.post(`v1/role/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateManpower(data, token) {
    return http.post(`v1/center/createmanpower`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PublishAdmitCard(data, token) {
    return http.post(`v1/admin/publishAdmitCards`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadCandidateExam(data, token) {
    return http.post(`v1/admin/writtenExam/uploadMarksData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadCandidateMarks(data, token) {
    return http.post(`v1/admin/writtenExam/downloadCandidateMarks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateAdmitCardStatus(data, token) {
    return http.post(`v1/admin/admitCardStatusUpdate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateAdmitCardStatusKushal(data, token) {
    return http.post(`v1/admin/updateAdmitCardStatusByApplicationId`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  RescheduleAdmitCard(data, token) {
    return http.post(`v1/admin/rescheduleCenter`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateObserver(data, token) {
    return http.post(`v1/center/createcenterobserver`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllPhysicalWorkScope(params, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getWorkScopeByVendorId?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  DownloadPhysicalCandidateMarks(data, token) {
    return http.post(
      `v1/admin/physicalEfficiencyTest/downloadCandidateMarks`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  PhysicalUploadCandidateExam(data, token) {
    return http.post(`v1/admin/physicalEfficiencyTest/uploadMarksData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetWorkPhysicalScopeByVendorId(params, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getWorkScopeByVendorId?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetPhysicalByAdvertisement(query, token) {
    return http.get(`v1/admin/vendor/getAllVendors?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // typing test section
  GetTypingById(query, token) {
    return http.get(`v1/admin/typingTestShorthand/getVendorSelected?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SaveTypingSelection(data, token) {
    return http.post(`v1/admin/typingTestShorthand/saveVendorSelection`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  TypingUploadCandidateExam(data, token) {
    return http.post(`v1/admin/typingTestShorthand/uploadMarksData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTypingByAdvertisement(query, token) {
    return http.get(`v1/admin/typingTestShorthand/getVendorSelected?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetWorkTypingScopeByVendorId(params, token) {
    return http.get(
      `v1/admin/typingTestShorthand/getWorkScopeByVendorId?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  DownloadTypingCandidateMarks(data, token) {
    return http.post(
      `v1/admin/typingTestShorthand/downloadCandidateMarks`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  // final result section
  GetFinalResultById(query, token) {
    return http.get(
      `v1/admin/finalResultPreparation/getVendorSelected?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  SaveFinalResultSelection(data, token) {
    return http.post(
      `v1/admin/finalResultPreparation/saveVendorSelection`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetFinalResultByAdvertisement(query, token) {
    return http.get(
      `v1/admin/finalResultPreparation/getVendorSelected?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  FinalResultUploadCandidateExam(data, token) {
    return http.post(`v1/admin/finalResultPreparation/uploadMarksData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadFinalResultCandidateMarks(data, token) {
    return http.post(
      `v1/admin/finalResultPreparation/downloadCandidateMarks`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetWorkFinalResultScopeByVendorId(params, token) {
    return http.get(
      `v1/admin/finalResultPreparation/getWorkScopeByVendorId?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetFinalResultByAdvertisement(query, token) {
    return http.get(
      `v1/admin/finalResultPreparation/getVendorSelected?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  DownloadZoneExcel(token) {
    return http.get(`v1/district/downloadAllZoneExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  WorkOrderDelete(id, token) {
    return http.delete(`v1/admin/vendor/workOrderDelete?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadDistrictExcel(token) {
    return http.get(`v1/district/downloadAllDistrictExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCandidateVenueAllocationDetails(query, token) {
    return http.get(`v1/admin/getAllocatedCandidatesByVenue?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadCenterExcel(token) {
    return http.get(`v1/center/downloadCentersExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateOtherWork(dto, token) {
    return http.patch(
      `v1/admin/vendor/editWorkOrder?id=${dto?.id}`,
      dto?.data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  WorkScopeDelete(id, token) {
    return http.delete(`v1/admin/vendor/workScopeDelete?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadManpowerExcel(token) {
    return http.get(`v1/center/downloadmanpowerExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateEditWorkScope(dto, token) {
    return http.patch(
      `v1/admin/vendor/editWorkScope?id=${dto?.id}`,
      dto?.data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  DeleteMOU(id, token) {
    return http.delete(`v1/admin/vendor/mouDelete?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadObserverExcel(token) {
    return http.get(`v1/center/downloadcenterobserverExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMou(dto, token) {
    return http.patch(`v1/admin/vendor/editMou?id=${dto?.id}`, dto?.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDatesByCenter(query, token) {
    return http.get(`v1/center/getexamDate?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  VendorDashboard(dto, token) {
    return http.get(`v1/admin/vendor/vendorDashboard?${dto}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetExamInspection(query, token) {
    return http.get(`v1/center/centerexaminspection?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetObserverFeedback(query, token) {
    return http.get(`v1/center/centerobseverfeedaback?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadZone(data, token) {
    return http.post(`v1/district/createzoneexcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadDistrict(data, token) {
    return http.post(`v1/district/createsubdistrictexcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadCenter(data, token) {
    return http.post(`v1/center/createcenterexcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadManpower(data, token) {
    return http.post(`v1/center/createManPowerByExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadObserver(data, token) {
    return http.post(`v1/center/createobserverByExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateZone(data, token) {
    return http.patch(`v1/district/updatezone`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDistrict(data, token) {
    return http.patch(`v1/district/updatedistrict`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateRole(data, token) {
    return http.patch(`v1/role/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateCenter(data, token) {
    return http.patch(`v1/center/updatecenter`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateManpower(data, token) {
    return http.patch(`v1/center/updatemanpower`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateObserver(data, token) {
    return http.patch(`v1/center/updateCenterObserver`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdmitCardReleaseApplications(query, token) {
    return http.get(`v1/admin/getAdmitCardReleasedApplications?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  EligibilityForDPCPromotion(query, token) {
    return http.get(`v1/promotion/eligibilityForDPCPromotion?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCenterDashboard(query, token) {
    return http.get(`v1/center/admin/centerVerificationDashBoard?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SeniorityForPromotionById(query, token) {
    return http.get(`v1/promotion/seniorityForPromotionById?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCenterDashboardTable(query, token) {
    return http.get(`v1/center/admin/allAdminCenterVerification?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SubmitDCP(data, token) {
    return http.post(`v1/promotion/dpcPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllPromotion(query, token) {
    return http.get(`v1/promotion/promotioncommittee`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetTODashboard(query, token) {   
    return http.get(`v1/district/alldistrictdashboard?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  

  GetAllGroup(query, token) {
    return http.get(`v1/promotion/promotionbasis`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetDistrictDashboardTable(query, token) {
    return http.get(`v1/district/alldistrict?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  PromotionbasislistbyId(query, token) {
    return http.get(`v1/promotion/promotionbasislistbyId?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  AddCreateCommittee(data, token) {
    return http.post(`v1/promotion/promotioncommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetPromotioncommitteebyId(id, token) {
    return http.get(`v1/promotion/promotioncommitteebyId?groupType=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UpdateCommittee(data, token) {
    return http.post(`v1/promotion/updatePromotionCommittee`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  RemoveCommiteMember(data, token) {
    return http.post(`v1/promotion/removecommitteemember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  ValidateVenueDates(data, token) {
    return http.post(`v1/admin/validateVenueDates`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllFormTemplates(token) {
    return http.get(`v1/form/admin/getAllKeyTitle  `, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  SubmitHCMT(data, token) {
    return http.post(`v1/promotion/HCMPTPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  HCTCMmotionList(params, token) {
    return http.get(`v1/promotion/hcmtpromotionbyId?_id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFormByTemplateId(query, token) {
    return http.get(`v1/form/admin?${query}  `, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateFormByTemplateId(data, token) {
    return http.patch(`v1/form/admin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  SubmitG2(data, token) {
    return http.post(`v1/promotion/computerServicePromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DashbordList(params, token) {
    return http.get(`v1/promotion/fetchPromotionDashBoard?=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateHTCPPromotion(data, token) {
    return http.patch(`v1/promotion/updateHcmtPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  G2MmotionList(params, token) {
    return http.get(`v1/promotion/computerServicePromotionById?_id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateG2Promotion(data, token) {
    return http.patch(`v1/promotion/updatecomputerServicePromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadSportsCertificate(data, token) {
    return http.post(`v1/admin/uploadSportsCertificate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetCenterVerificationOfficers(query, token) {
    return http.get(
      `v1/center_verification/admin/centerVerification?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetCenterVerificationOfficers2(query, token) {
    return http.get(
      `v1/center_verification/admin/centerVerificationParsedFields?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  PromotionFinalResult(params, token) {
    return http.get(`v1/promotion/getFinalResult?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Otr, Application and transaction api
  GetOtrCandidateDetail(query, token) {
    return http.get(`v1/admin/candidateOtrDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  UploadDCPPromotionData(data, token) {
    return http.post(`v1/promotion/uploadDpcPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindcandidateOtrDetailsStats(params, token) {
    return http.get(`v1/admin/findcandidateOtrDetailsStats?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadHCMPPromotionData(data, token) {
    return http.post(`v1/promotion/uploadHCMPTPromotion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindAllTransactionsForAdmin(query, token) {
    return http.get(`v1/admin/findAllTransactionsForAdmin?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UploadG2PromotionData(data, token) {
    return http.post(`v1/promotion/uploadComputerServiceData`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DCPMmotionList(params, token) {
    return http.get(`v1/promotion/dpcpromotionbyId?_id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindApplicationStats(id, token) {
    return http.get(`v1/admin/findApplicationStats?advertisementId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FileCheck(data, token) {
    return http.post(`v1/admin/writtenExam/ocrBasedPdf`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  VendorCredential(query, token) {
    return http.get(`v1/admin/vendor/getVendorCredential?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVendorByIdUpload(query, token) {
    return http.get(`v1/admin/writtenExam/getVendorDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateCenterVerificationOfficers(data, token) {
    return http.patch(`v1/center_verification/admin/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetPhysicalByAdvertisementUpload(query, token) {
    return http.get(
      `v1/admin/physicalEfficiencyTest/getVendorDetails?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetFinalResultByAdvertisementUpload(query, token) {
    return http.get(
      `v1/admin/finalResultPreparation/getVendorDetails?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetTypingByAdvertisementUpload(query, token) {
    return http.get(`v1/admin/typingTestShorthand/getVendorDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  FindMasterByCodePromotion() {
    return http.get(`v1/promotion/getPromotionCourse`);
  }
  GetVenueDistrictById(query, token) {
    return http.get(`v1/district/districtById?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTreasuryVerificationByDistrictId(query, token) {
    return http.get(`v1/treasury/admin/parsedTreasuryData?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterMapData(query, token) {
    return http.get(`v1/center/admin/alldistrictverification?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTreasuryMapData(token) {
    return http.get(`v1/district/districtverification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  ResetPassword(data, token) {
    return http.post(`v1/admin/forgotCreateNewPassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterExcel(token) {
    return http.get(`v1/center/admin/downloadAllExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllCandidateDetails(query, token) {
    return http.get(
      `v1/admin/Dvpst/userDvpstDocumentVerificationData?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  CreateuserDvpst(data, token) {
    return http.post(`v1/admin/dvpst/createAdminMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  GetAllOfficer(query, token) {
    return http.get(`v1/admin/getSectionOfficer?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetDistrictExcel(query, token) {
    return http.get(`v1/district/downloadAlldistrictExcel?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdvByCourseDvpst(data, token) {
    return http.post(`v1/user/findDvpstAdvertisement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetUserDetails(query, token) {
    return http.get(`v1/admin/getUserDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetTreasuryMaterialVerification(query, token) {
    return http.get(`v1/treasury_material_verification/all?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDvpstMembers(query, token) {
    return http.get(`v1/admin/dvpst/getSubAdmin?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetModuleList(query, token) {
    return http.get(`v1/admin/getdashboardmodules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetMaterialReceipt(token) {
    return http.get(
      `v1/treasury_material_verification/admin/materialReceiptById`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetTreasuryMaterialUser(query, token) {
    return http.get(
      `v1/treasury_material_verification/admin/tresuarymaterialuser?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetTreasuryCenters(query, token) {
    return http.get(
      `v1/treasury_material_verification/admin/materialDispatchById?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetCentersToTreasury(query, token) {
    return http.get(
      `v1/treasury_material_verification/admin/materialReverseById?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  createOfficer(data, token) {
    return http.post(`v1/admin/createSectionOfficer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateOfficer(data, token) {
    return http.post(`v1/admin/editSectionOfficer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetPhaseData(query, token) {
    return http.get(`v1/center/cbtCenterMockConduction?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterAuditStats(query, token) {
    return http.get(`v1/admin/center/examAuditStatics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterMockStats(query, token) {
    return http.get(`v1/admin/center/examMockConductionStatics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterManpowerStats(query, token) {
    return http.get(`v1/center/manPowerStatics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDvpstMember(data, token) {
    return http.patch(`v1/admin/updateDvpstuser`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateDvpstTeam(data, token) {
    return http.post(`v1/admin/createDvpstGroup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateDvpstGroup(data, token) {
    return http.patch(`v1/admin/updateDvpstGroup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DownloadDVPSTApplications(query, token) {
    return http.get(`v1/admin/Dvpst/downloadDvpstApplicationPdf?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDvpstZone(query, token) {
    return http.get(`v1/admin/dvpst/getDvpstZone?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDvpstMandal(query, token) {
    return http.get(`v1/admin/dvpst/getDvpstRange?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDvpstDistricts(query, token) {
    return http.get(`v1/admin/dvpst/getDvpstDistrict?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  DvpstDashboard(query, token) {
    return http.get(`v1/admin/dvpst/dvpstStatics?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetFindVendorPaymentDetails(params, token) {
    return http.get(`v1/admin/vendor/getVendorById?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllPromotionData(params, token) {
    return http.get(`v1/promotion/dashBoardForPromotion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterCader(params, token) {
    return http.get(`v1/master/getcadre?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterCourses(params, token) {
    return http.get(`v1/master/getAllCourses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterCourses(params, token) {
    return http.get(`v1/master/getAllCourses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterCourseById(params, token) {
    return http.get(`v1/master/getCourseById?id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateCourses(data, token) {
    return http.post(`v1/master/createCourse`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterCourses(data, token) {
    return http.patch(`v1/master/updateCourse`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterPost(params, token) {
    return http.get(`v1/master/getAllPosts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterGender(query, token) {
    return http.get(`v1/master/getmasterBycode?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreatePost(data, token) {
    return http.post(`v1/master/createPost`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateAdhiyaachan(data, token) {
    return http.post(`v1/adhiyaachan/adhiyaachan`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMasterZoneById(params, token) {
    return http.get(`v1/district/getZoneById?id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllAllSportsData(query, token) {
    return http.get(`v1/admin/getSports?parentSportsId=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterZone(data, token) {
    return http.patch(`v1/district/updatezonedata`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdhiyaachanDataById(query, token) {
    return http.get(`v1/adhiyaachan/newAdhiyaachanById?id=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllRange(query, token) {
    return http.get(`v1/district/getZoneRange?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateNewAdhiyaachan(data, token) {
    return http.patch(`v1/adhiyaachan/updateNewAdhiyaachan`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateZoneRange(data, token) {
    return http.post("v1/district/createZoneRange", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllNewAdhiyaachanList(query, token) {
    return http.get(`v1/adhiyaachan/getAllNewAdhiyaachan?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterRange(data, token) {
    return http.patch(`v1/district/updateZoneRange`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateAdvertisementRelease(data, token) {
    return http.post(`v1/advertisement/createAdvertisement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllDistrict(data, token) {
    return http.get(`v1/district/getDistricts`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetVacancySeatsOfAdhiyachan(data, token) {
    return http.post(`v1/adhiyaachan/getvacancySeatsOfAdhiyachan`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateDistricts(data, token) {
    return http.post(`v1/district/createdistrict`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdvertisementById(query, token) {
    return http.get(`v1/advertisement/findnewAdvertisementById?id=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterDistrict(data, token) {
    return http.patch(`v1/district/updatedistrict`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateNewAdvertisement(data, token) {
    return http.patch(`v1/advertisement/updateAdvertisementDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAdhiyaachanByAdvertisement(query, token) {
    return http.get(
      `v1/adhiyaachan/getNewAdhiyaachanByAdvertisement?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetAllMasterPostById(params, token) {
    return http.get(`v1/master/getPostById?id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMasterPost(data, token) {
    return http.patch(`v1/master/updatePost`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateMainSport(data, token) {
    return http.post(`v1/admin/createSports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllMainSportById(params, token) {
    return http.get(`v1/admin/getSportById?id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateMainSport(data, token) {
    return http.patch(`v1/admin/updateSports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllSubSports(query, token) {
    return http.get(`v1/admin/getAllSubSports?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  CreateSubSport(data, token) {
    return http.post(`v1/admin/createSubSports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllSubSportById(params, token) {
    return http.get(`v1/admin/getSportById?id=${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateSubSport(data, token) {
    return http.patch(`v1/admin/updateSubSports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllPromotionCardList(query, token) {
    return http.get(`v1/promotion/promotioncardDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllAdvertisementData(query, token) {
    return http.get(`v1/advertisement/getAllAdvertisement?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllExamType(query, token) {
    return http.get(
      `v1/advertisement/admitcardstage?advertisementId=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  GetAllVenue(query, token) {
    return http.get(`v1/center/getCenters?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   CreateAdhiyaachanAdmitCard(data, token) {
    return http.post(`v1/advertisement/advertisementStage`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   GetAllAdhiyaachanAdmitCard(query, token) {
    return http.get(`v1/advertisement/getAllAdmitCardsStage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  AdhiyaachanAdmitCardGetById(query, token) {
    return http.get(`v1/advertisement/getExamTypeById?${query}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  UpdateAdhiyaachanAdmitCard(data, token) {
    return http.patch(`v1/advertisement/admitCardExams`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllExamTypeData(query, token) {
    return http.get(`v1/advertisement/getAdmitCardsStage?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetAllVenueTable(query, token) {
    return http.get(`v1/advertisement/getVenueByExamType?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   AddScheduleForExam(data, token) {
    return http.post(`v1/advertisement/addScheduleForExam`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   GetAllCentersAdmitCard(query, token) {
    return http.get(`v1/advertisement/getExamCenters?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetSWPDistrict(query, token) {
    return http.get(`v1/shiftWise/getCenterShift?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  GetCenterVerificationShiftData(query, token) {
    return http.get(
      `v1/shiftWise/ShiftWiseParsedFields?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  RemoveCommiteMemberDvpst(data, token) {
    return http.patch(`v1/admin/removeGroupMember`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    UpdateDVPSTuploadUnmatchedDocuments(data, token) {
    return http.patch(
      `v1/ApplicationScreening/uploadUnmatchedDocuments`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
    centerUsersWithSubmitStatus(query, token) {
    return http.get(`v1/center_verification/admin/centerUsersWithSubmitStatus?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
      centerVerificationParsedFields(query, token) {
    return http.get(`v1/center_verification/admin/centerVerificationParsedFields?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  centerVerificationDashboard(query, token) {
    return http.get(`v1/center_verification/admin/getCenterByDistrict?${query}` , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   AllInfraData(query, token) {
    return http.get(`v1/center_verification/admin/getDistrictReport?${query}` , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    UploadDVPSTData(data, token) {
    return http.post(`v1/admin/uploadAdmitCard`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    CandidatesAbsent(data, token) {
    return http.post(
      `v1/ApplicationScreening/updateScreeningAttandance`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
    DownloadTemplate(query, token) {
    return http.get(`v1/admin/writtenExam/downloadWrittenExamSampleExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   DownloadTemplateFinal(query, token) {
    return http.get(`v1/admin/finalResultPreparation/downloadFinalResultSampleExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   DownloadTemplateTypingTest(query, token) {
    return http.get(`v1/admin/typingTestShorthand/downloadTypingTestShorthandSampleExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   DownloadTemplatephysicalEfficiencyTest(query, token) {
    return http.get(`v1/admin/physicalEfficiencyTest/downloadPhysicalEfficiencyTestSampleExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  WrittenExamUpload(data, token) {
    return http.post(`v1/admin/vendor/uploadVendorDoc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  PhysicalTestUpload(data, token) {
    return http.post(`v1/admin/physicalEfficiencyTest/uploadPhysicalEfficiencyDoc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  TypingTestUpload(data, token) {
    return http.post(`v1/admin/typingTestShorthand/uploadTypingTestDoc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   FinalResultUpload(data, token) {
    return http.post(`v1/admin/finalResultPreparation/uploadFinalResultDoc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    DownloadDataByBoard(data, token) {
    return http.post(`v1/admin/vendor/listMyVendorDocs`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    GetVendor(query, token) {
    return http.get(`v1/admin/vendor/getAllVendors?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    AddHistory(data, token) {
    return http.post(`v1/admin/vendor/createVendorHistory`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    GetAllHistory(query, token) {
    return http.get(
      `v1/admin/vendor/getVendorHistoryDetails?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  UpdateHistory(data, token) {
    return http.patch(`v1/admin/vendor/updateVendorHistory`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
      HistoryGetById(query, token) {
    return http.get(
      `v1/admin/vendor/getVendorHistoryById?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
HistoryData(query, token) {
    return http.get(
      `v1/admin/vendor/getVendorHistoryById}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
      AddHistoryData(data, token) {
    return http.post(`v1/admin/vendor/addVendorHistory`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
   GetHistoryStatus(query, token) {
    return http.get(
      `v1/admin/vendor/checkVendorHistory?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
      DownloadDataByBoardTypingTest(data, token) {
    return http.post(`v1/admin/typingTestShorthand/getTypingTestDoc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
       DownloadDataByBoardPhysicalTest(data, token) {
    return http.post(`v1/admin/physicalEfficiencyTest/getPhysicalEfficiencyTestDoc`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
         DownloadDataByBoardFinalResult(data, token) {
    return http.post(`v1/admin/finalResultPreparation/getFinalResultDoc`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
      centerUsersWithShiftWise(query, token) {
    return http.get(`v1/shiftWise/getCenterVerificationData?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
        shiftWiseParsedFields(query, token) {
    return http.get(`v1/shiftWise/ShiftWiseParsedFields?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    GetUsersByShiftWise(query, token) {
    return http.get(`v1/shiftWise/getCenterUserDetails?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    UserListingUpload(data, token) {
    return http.post(`v1/admin/center/createuserDataByExcel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
      DeleteVenueUser(data, token) {
    return http.post(``, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
        DeleteVenueCenter(data, token) {
    return http.post(``, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    DownloadInfraExcel(query, token) {
    return http.get(`v1/center_verification/admin/getCentersDetailsExcel?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
      DownloadInfraPDF(query, token) {
    return http.get(`v1/center_verification/admin/getCentersDetailsPdf?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    GetCenterShiftDashboard(query, token) {
    return http.get(`v1/shiftWise/getCenterShiftDashboard?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
    DistrictJsonExcel(query, token) {
    return http.get(`v1/district/allAdminDistrictJsonExcel?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new DataService();
