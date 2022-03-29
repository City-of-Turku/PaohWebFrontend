import { Language } from '../types';

export type ServiceDescriptionType =
  | 'ChargeTypeAdditionalInfo'
  | 'DeadLine'
  | 'Description'
  | 'GD_Description'
  | 'GD_GeneralDescriptionTypeAdditionalInformation'
  | 'GD_Summary'
  | 'ProcessingTime'
  | 'ServiceType'
  | 'Summary'
  | 'UserInstruction'
  | 'ValidityTime';

export interface IDescription {
  value: string;
  type: ServiceDescriptionType;
  language: Language;
  autoTranslated: boolean;
  original?: string; // If name was automatically translated, this contains the original (Finnish)
  originalLanguage?: string;
}

export interface IOrganization {
  id: string | null;
  name: string;
  roleType: OrgRole;
}

export enum OrgRole {
  Responsible = 'Responsible',
  Producer = 'Producer',
  OtherResponsible = 'OtherResponsible',
}

export interface IServiceArea {
  name: string;
  type: string;
  code: string;
}

export interface IServiceName {
  value: string;
  language: Language;
  autoTranslated: boolean;
  original?: string; // If name was automatically translated, this contains the original (Finnish)
  originalLanguage?: Language;
}

export interface IService {
  id: string;
  name: IServiceName;
  descriptions: IDescription[];
  organizations: IOrganization[];
  areas: IServiceArea[];
}
