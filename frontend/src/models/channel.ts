import { Language } from '../types';

export const channelTypes = [
  'EChannel',
  'Phone',
  'PrintableForm',
  'ServiceLocation',
  'WebPage',
] as const;

export type ChannelType = typeof channelTypes[number];

export const isChannelType = (val: string): val is ChannelType => {
  // widen channelTypes to string[] so indexOf(x) works
  return (channelTypes as readonly string[]).indexOf(val) !== -1;
};

export type IChannelDescType = 'Description' | 'Summary';

export interface IChannelDescription {
  value: string;
  type: IChannelDescType;
  language: Language;
}

export interface IPhoneNumber {
  number: string;
  prefixNumber?: string;
  chargeDescription?: string;
  serviceChargeType?: string;
}

export interface IAddress {
  type: string;
  subtype: string;
  streetNumber?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  streetName?: string;
  postOffice?: string;
  municipalityCode?: string;
  municipalityName?: string;
}

export interface IChannelUrl {
  url: string;
  type: string;
}

export interface IChannel {
  id: string;
  type: ChannelType;
  name: string;
  descriptions: IChannelDescription[];
  webPages: string[];
  emails: string[];
  phoneNumbers: IPhoneNumber[];
  addresses: IAddress[];
  channelUrls: IChannelUrl[];
}
