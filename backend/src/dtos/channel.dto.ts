import { Language } from '../types';

export const channelTypes = [
  'EChannel',
  'Phone',
  'PrintableForm',
  'ServiceLocation',
  'WebPage',
] as const;

export type ChannelType = typeof channelTypes[number];

export const channelDescTypes = ['Description', 'Summary'];
export type ChannelDescType = typeof channelDescTypes[number];

export interface ChannelDescriptionDTO {
  value: string;
  type: ChannelDescType;
}

export interface PhoneNumberDTO {
  number: string;
  prefixNumber: string | null;
  chargeDescription: string | null;
  serviceChargeType: string | null; // Chargeable"
}

export interface AddressDTO {
  type: string;
  subtype: string;
  streetNumber: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  streetName: string | null;
  postOffice: string | null;
  municipalityCode: string | null;
  municipalityName: string | null;
}

export interface ChannelUrlDTO {
  url: string;
  type: string; // Possible values include at least DOC, PDF...
}

// Model represents the data received from the API (from service matcher)
export interface ChannelDTO {
  id: string;
  type: ChannelType;
  organizationId: string;
  serviceIds: string[];
  name: {
    [lang in Language]: string | null;
  };
  descriptions: {
    [lang in Language]: ChannelDescriptionDTO[];
  };
  webPages: {
    [lang in Language]: string[];
  };
  emails: {
    [lang in Language]: string[];
  };
  phoneNumbers: {
    [lang in Language]: PhoneNumberDTO[];
  };
  addresses: {
    [lang in Language]: AddressDTO[];
  };
  channelUrls: {
    [lang in Language]: ChannelUrlDTO[];
  };
  lastUpdated: Date;
}
