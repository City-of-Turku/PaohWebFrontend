import { Language } from '../types';
import { ChannelDescType, ChannelType } from '../dtos/channel.dto';

export interface IChannelDescription {
  value: string;
  type: ChannelDescType;
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
