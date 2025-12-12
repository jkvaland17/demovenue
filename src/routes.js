export const superAdminRoutes = [
  {
    path: "/organization",
    name: "Organization",
    icon: "corporate_fare",
    show: true,
    layout: "/superadmin",
  },
];

export const orgAdmin = [
  {
    path: "/cell",
    name: "Cells",
    icon: "fa-solid fa-tag",
    show: true,
    layout: "/orgadmin",
  },
  {
    path: "/cell-head",
    name: "Cell Head",
    icon: "fa-solid fa-person-breastfeeding",
    show: true,
    layout: "/orgadmin",
  },
  {
    path: "/setting",
    name: "Setting",
    icon: "settings",
    show: true,
    layout: "/orgadmin",
  },
];
export const adminRoutes = [
  {
    path: "/master/master-categories",
    name: "Master",
    icon: "database",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/master-categories",
        name: "Categories",
        layout: "/admin/master",
      },
      {
        path: "/master-data",
        name: "Data",
        layout: "/admin/master",
      },
    ],
  },
  {
    path: "/subadmin",
    name: "Member",
    icon: "supervisor_account",
    show: true,
    layout: "/admin",
  },
  {
    path: "/application",
    name: "Application",
    icon: "description",
    show: true,
    layout: "/admin",
  },
  {
    path: "/transaction",
    name: "Transaction",
    icon: "payments",
    show: true,
    layout: "/admin",
  },
  {
    path: "/verify-image",
    name: "Image Verification",
    icon: "fact_check",
    show: true,
    layout: "/admin",
  },
  {
    path: "/screening/screening-panel",
    name: "Screening",
    icon: "badge",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/screening-panel",
        name: "Screening panel",
        layout: "/admin/screening",
      },
      {
        path: "/department-screening",
        name: "Screening Summary",
        layout: "/admin/screening",
      },
    ],
  },
  {
    path: "/post-screening/list",
    name: "Post Screening",
    icon: "markunread_mailbox",
    show: false,
    layout: "/admin",
    views: [
      {
        path: "/list",
        name: "Approval List",
        layout: "/admin/post-screening",
        show: false,
      },
    ],
  },
  {
    path: "/admit-card/generate-admitcard",
    name: "Admit Card",
    icon: "badge",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/generate-admitcard",
        name: "Generate Admit card",
        layout: "/admin/admit-card",
      },
      {
        path: "/all-admit-card",
        name: "Available Admit Card",
        layout: "/admin/admit-card",
      },
    ],
  },
  {
    path: "/interview/manage-interview",
    name: "Interview",
    icon: "psychology",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/manage-interview",
        name: "Schedule Interview",
        layout: "/admin/interview",
      },
      {
        path: "/assign-interview",
        name: "Map Candidate",
        layout: "/admin/interview",
      },
      {
        path: "/interview-panel",
        name: "Create Interview Panel",
        layout: "/admin/interview",
      },
      {
        path: "/map-interview-panel",
        name: "Map Interview Panel",
        layout: "/admin/interview",
      },
      {
        path: "/summary",
        name: "Interview Summary",
        layout: "/admin/interview",
      },
    ],
  },
  {
    path: "/counselling",
    name: "Counselling",
    icon: "description",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/all-counselling",
        name: "Schedule Counselings",
        layout: "/admin/counselling",
      },
      {
        path: "/map-institute",
        name: "Map Center",
        layout: "/admin/counselling",
      },
      {
        path: "/map-candidate",
        name: "Map Candidate",
        layout: "/admin/counselling",
      },
      {
        path: "/statistics",
        name: "Counselling Summery",
        layout: "/admin/counselling",
      },
    ],
  },
  {
    path: "/queries",
    name: "Queries",
    icon: "person_raised_hand",
    show: true,
    layout: "/admin",
  },
  {
    path: "/notification",
    name: "Notification",
    icon: "notifications",
    show: true,
    layout: "/admin",
  },
];

export const adminRoutesHOD = [
  {
    path: "/subadmin",
    name: "Member",
    icon: "supervisor_account",
    show: true,
    layout: "/admin",
  },
];

export const orgSubAdminRoutes = [
  {
    path: "/application",
    name: "Application",
    icon: "description",
    layout: "/admin",
    show: true,
  },

  {
    path: "/interview-department-screening",
    name: "Interview Department Candidate Details",
    icon: "fact_check",
    layout: "/admin",
    show: true,
  },

  {
    path: "/interview-screening",
    name: "Interview Candidate Details",
    icon: "fact_check",
    layout: "/admin",
    show: true,
  },

  {
    path: "/setting",
    name: "Setting",
    icon: "settings",
    show: true,
    layout: "/admin",
  },
];

export const cellAdminRoutes = [
  {
    path: "/application",
    name: "Application",
    icon: "description",
    show: true,
    layout: "/admin",
  },
  {
    path: "/interview/sheet",
    name: "Interview",
    icon: "psychology",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/sheet",
        name: "Interview Result",
        layout: "/admin/interview",
      },
    ],
  },
  {
    path: "/screening/department-screening",
    name: "Scrutiny",
    icon: "fact_check",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/department-screening",
        name: "Screening Summary",
        layout: "/admin/screening",
      },
      {
        path: "/candidate-screening",
        name: "Screening Candidate Details",
        layout: "/admin/screening",
      },
      {
        path: "/submission",
        name: "Final Submission",
        layout: "/admin/scrutiny",
      },
    ],
  },
];

export const norcetCellAdminRoutes = [
  {
    path: "/institute",
    name: "Institute",
    icon: "apartment",
    show: true,
    layout: "/admin",
  },
  {
    path: "/institute-admin",
    name: "Institute Admin",
    icon: "supervisor_account",
    show: true,
    layout: "/admin",
  },
];

export const subAdminRoutes = [];

export const interviewRoutes = [
  {
    path: "/interview/all-interview",
    name: "All Interview",
    icon: "psychology",
    show: true,
    layout: "/admin",
  },
];

export const interviewAdmin = {
  path: "/interview/manage-interview",
  name: "Interview",
  icon: "psychology",
  show: true,
  layout: "/admin",
  views: [
    {
      path: "/manage-interview",
      name: "Interview Schedule",
      layout: "/admin/interview",
    },
    {
      path: "/assign-interview",
      name: "Map Candidate",
      layout: "/admin/interview",
    },
    {
      path: "/interview-panel",
      name: "Interview Panel",
      layout: "/admin/interview",
    },
    {
      path: "/map-interview-panel",
      name: "Map Interview Panel",
      layout: "/admin/interview",
    },
    {
      path: "/map-interview-hod",
      name: "Map Interview HOD",
      layout: "/admin/interview",
    },
    {
      path: "/map-application-interview",
      name: "Map Application Interview",
      layout: "/admin/interview",
    },
    {
      path: "/committee",
      name: "Committee",
      layout: "/admin/interview",
    },
  ],
};

export const interview = [
  {
    path: "/interview/all-interview",
    name: "All Interview",
    icon: "psychology",
    show: true,
    layout: "/admin",
  },
];

export const screeningMain = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "monitoring",
    show: true,
    layout: "/admin",
  },
];

export const screeningRoutesHOD = [
  {
    path: "/scrutiny/screening",
    name: "Screening",
    icon: "fact_check",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/scrutiny-panel",
        name: "Constitute Screening Committee",
        layout: "/admin/scrutiny",
      },
      {
        path: "/screening",
        name: "Document Screening",
        layout: "/admin/scrutiny",
      },
      {
        path: "/meeting",
        name: "Create Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/concern-screening",
        name: "Map Candidate to  Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/scheduled-virtual-meeting",
        name: "Scheduled Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/final-submission",
        name: "Final Submission",
        layout: "/admin/scrutiny",
      },
    ],
  },
];

export const screeningRoutesMember = [
  {
    path: "/scrutiny/screening",
    name: "Screening",
    icon: "fact_check",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/meeting",
        name: "Create Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/concern-screening",
        name: "Map Candidate to  Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/scheduled-virtual-meeting",
        name: "Scheduled Virtual Meeting",
        layout: "/admin/scrutiny",
      },
    ],
  },
];

export const screeningRoutesCoOp = [
  {
    path: "/scrutiny/screening",
    name: "Screening",
    icon: "fact_check",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/scrutiny-panel",
        name: "Constitute Screening Committee",
        layout: "/admin/scrutiny",
      },
      {
        path: "/screening",
        name: "Document Screening",
        layout: "/admin/scrutiny",
      },
      {
        path: "/meeting",
        name: "Create Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/concern-screening",
        name: "Map Candidate to  Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/scheduled-virtual-meeting",
        name: "Scheduled Virtual Meeting",
        layout: "/admin/scrutiny",
      },
      {
        path: "/final-submission",
        name: "Final Submission",
        layout: "/admin/scrutiny",
      },
    ],
  },
];

export const instituteAdminRoutes = [
  {
    path: "/institute/alloted-candidates",
    name: "Institute",
    icon: "apartment",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/alloted-candidates",
        name: "Alloted Candidates",
        layout: "/admin/institute",
      },
      {
        path: "/schedule-screening",
        name: "Schedule Verification",
        layout: "/admin/institute",
      },
      {
        path: "/user-master",
        name: "User Master",
        layout: "/admin/institute",
      },
      {
        path: "/map-candidates",
        name: "Map Candidate",
        layout: "/admin/institute",
      },
      {
        path: "/screening-details",
        name: "Verification Candidate",
        layout: "/admin/institute",
      },
    ],
  },
];
export const LevelAdminRoutes = [
  {
    path: "/institute/screening-details",
    name: "Verification Candidate",
    icon: "apartment",
    show: true,
    layout: "/admin",
  },
];

export const jammuRoutes = [
  {
    path: "/interview/manage-interview",
    name: "Interview",
    icon: "psychology",
    show: true,
    layout: "/admin",
    views: [
      {
        path: "/manage-interview",
        name: "Interview Schedule",
        layout: "/admin/interview",
      },
      {
        path: "/assign-interview",
        name: "Map Candidate",
        layout: "/admin/interview",
      },
      {
        path: "/interview-panel",
        name: "Interview Panel",
        layout: "/admin/interview",
      },
      {
        path: "/map-interview-panel",
        name: "Map Interview Panel",
        layout: "/admin/interview",
      },
      {
        path: "/summary",
        name: "Interview Summary",
        layout: "/admin/interview",
      },
    ],
  },
  {
    path: "/subadmin",
    name: "Member",
    icon: "supervisor_account",
    show: true,
    layout: "/admin",
  },
];
