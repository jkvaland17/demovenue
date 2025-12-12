const actionRouteDecider = (
  tilesType: string,
  candidateId?: string,
  routeType = "static",
) => {
  const routes: any = {
    candidatesRegisteredApplied: `/admin/kushal-khiladi/kushal/application-scrutiny`,
    documentVerification: `/admin/kushal-khiladi/kushal/document-verification`,
  };

  const dynamicRoutes: any = {
    candidatesRegisteredApplied: `/admin/kushal-khiladi/kushal/application-scrutiny/candidate-application-scrutiny/${candidateId}`,
    documentVerification: `/admin/kushal-khiladi/kushal/document-verification/${candidateId}/${candidateId}`,
  };

  const title: any = {
    candidatesRegisteredApplied: "Scrutiny",
    documentVerification: "Document Verification",
  };

  const dropdownItems: any = {
    candidatesRegisteredApplied: ["candidatesRegisteredApplied"],
    applicationsScrutinized: ["candidatesRegisteredApplied"],
    applicantsFoundFit: ["candidatesRegisteredApplied"],
    applicantsFoundUnfit: ["candidatesRegisteredApplied"],
    documentVerification: ["documentVerification"],
    admitCardRelease: ["documentVerification"],
  };

  const action = dropdownItems[tilesType] || [];
  return action.map((key: any) => ({
    title: title[key],
    route: routeType === "static" ? routes[key] : dynamicRoutes[key],
  }));
};

export default actionRouteDecider;
