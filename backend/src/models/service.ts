import { Language } from '../types';
import { ServiceDescriptionType } from '../dtos/service.dto';

export interface IDescription {
  value: string;
  type: ServiceDescriptionType;
  language: Language;
  autoTranslated: boolean;
  original?: string; // If name was automatically translated, this contains the original language
  originalLanguage?: Language;
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
  originalLanguage?: string;
}

export interface IService {
  id: string;
  name: IServiceName;
  descriptions: IDescription[];
  organizations: IOrganization[];
  areas: IServiceArea[];
}
