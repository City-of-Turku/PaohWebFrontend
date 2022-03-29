import {
  IDescription,
  IOrganization,
  IServiceArea,
  OrgRole,
} from 'models/service';

/* Check if string is valid UUID */
function checkIfValidUUID(str: string): boolean {
  const regexExp =
    /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi;
  return regexExp.test(str.toLowerCase());
}

/**
 * Order of descriptions to use: Description > GD_Description > Summary > GD_Summary
 * If none of them exist, return an empty description
 */
function getDescription(
  descriptions: IDescription[],
): IDescription | undefined {
  // Convert type: x, value: y structure into {x: y} meaning description types serve as keys for values (descriptions)
  const mappedDescriptions = descriptions.map((desc: IDescription) => ({
    [desc.type]: {
      value: desc.value,
      language: desc.language,
      autoTranslated: desc.autoTranslated,
      ...(desc.original && {
        original: desc.original,
        originalLanguage: desc.originalLanguage,
      }),
    },
  }));
  const descData = Object.assign({}, ...mappedDescriptions);
  const descriptionOrder = [
    'Description',
    'Summary',
    'GD_Description',
    'GD_Summary',
  ];

  const selectedType = descriptionOrder.find(
    (descName: string) =>
      descData[descName] &&
      descData[descName].value !== null &&
      descData[descName].value !== undefined &&
      descData[descName].value !== '',
  );

  if (selectedType) {
    return descData[selectedType];
  }
  return undefined;
}

/**
 *
 * @param areas
 * @param areasText
 * @returns
 */
function getLocationSubheader(
  areas: IServiceArea[],
  areasText: string,
): string | null {
  if (areas && areas.length > 0) {
    return areas.length === 1 ? areas[0].name : `${areas.length} ${areasText}`;
  }
  return null;
}

/**
 * Get name of (one) organization responsible for a service
 * @param organizations Array of organizations
 * @returns name of (first) organization with role Responsible - or if such is not found, returns null
 */
function getOrganizationName(organizations: IOrganization[]): string | null {
  const responsible = organizations.filter(
    (o) => o.roleType === OrgRole.Responsible,
  );
  if (responsible.length > 0) {
    return responsible[0].name;
  }
  return null;
}

export {
  checkIfValidUUID,
  getDescription,
  getLocationSubheader,
  getOrganizationName,
};
