export const serviceDescriptionTypes = [
  'ChargeTypeAdditionalInfo',
  'DeadLine',
  'Description',
  'GD_Description',
  'GD_GeneralDescriptionTypeAdditionalInformation',
  'GD_Summary',
  'ProcessingTime',
  'ServiceType',
  'Summary',
  'UserInstruction',
  'ValidityTime',
] as const;

export type ServiceDescriptionType = typeof serviceDescriptionTypes[number];

export interface ServiceDescriptionDTO {
  value: string;
  type: ServiceDescriptionType;
  autoTranslated: boolean;
}

export interface ServiceAreaDTO {
  name: string;
  type: string; // Limited range of values: Municipality, ...?
  code: string;
}
export interface OrganizationDTO {
  id: string | null;
  name: string;
  roleType?: string | null;
}

export interface ServiceDTO {
  id: string;
  name: {
    en: string | null;
    fi: string | null;
    sv: string | null;
  };
  nameAutoTranslated: {
    fi: boolean;
    en: boolean;
    sv: boolean;
  };
  descriptions: {
    en: ServiceDescriptionDTO[];
    fi: ServiceDescriptionDTO[];
    sv: ServiceDescriptionDTO[];
  };
  organizations: OrganizationDTO[];
  areas: {
    en: ServiceAreaDTO[];
    fi: ServiceAreaDTO[];
    sv: ServiceAreaDTO[];
  };
  lastUpdated: Date;
}
