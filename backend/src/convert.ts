import { RecommendationDTO } from './dtos/recommendation.dto';
import { IRecommendation } from './models/recommendation';
import {
  IAddress,
  IChannel,
  IChannelUrl,
  IPhoneNumber,
  IChannelDescription,
} from './models/channel';
import { Language, LangStringList } from './types';
import {
  AddressDTO,
  ChannelDescriptionDTO,
  ChannelDTO,
  ChannelUrlDTO,
  PhoneNumberDTO,
} from './dtos/channel.dto';
import {
  ServiceDescriptionDTO,
  ServiceDTO,
  OrganizationDTO,
} from './dtos/service.dto';
import {
  IService,
  IDescription,
  IOrganization,
  OrgRole,
  IServiceName,
} from './models/service';
import sanitizeHtml from 'sanitize-html';
import proj4 from 'proj4';

const TRANSLATION_SOURCE: Language = 'fi'; // Currently backend uses Finnish as the source language for automatic translations

/**
 *
 * @param data  Recommendation data received from service matcher
 * @param lang  Language requested by the client (use Finnish as default)
 * @returns     List of recommendations matching IRecommendation structure
 *              If input array is empty, returns an empty array
 */
export function convertRecommendations(
  data: RecommendationDTO[],
  lang: Language = 'fi',
): IRecommendation[] {
  const recommendations: IRecommendation[] = data.map((rec) => {
    const convertedService = convertService(rec.service, lang);
    const convertedChannels: IChannel[] =
      rec.channels === null ? [] : convertChannels(rec.channels, lang);
    return {
      service: convertedService,
      channels: convertedChannels,
      score: rec.score,
      // automaticTranslationUsed:
      // lang !== 'fi' && (rec.missing_texts_translated || false), // Language condition is used as automatic translation is never done for Finnish
    };
  });

  return recommendations;
}

export function convertService(service: ServiceDTO, lang: Language): IService {
  return {
    id: service.id,
    name: convertServiceName(service, lang),
    organizations: convertOrganizations(service.organizations),
    descriptions:
      service.descriptions[lang].length > 0
        ? convertServiceDescriptions(service.descriptions, lang)
        : convertServiceDescriptions(service.descriptions, 'fi'),
    areas:
      service.areas[lang].length > 0 ? service.areas[lang] : service.areas.fi,
  };
}

/**
 *
 * @param channels
 * @param lang
 * @returns
 */
export function convertChannels(
  channels: ChannelDTO[],
  lang: Language,
): IChannel[] {
  const convertedChannels: IChannel[] = channels.map((ch: ChannelDTO) => {
    return {
      id: ch.id,
      type: ch.type,
      name: ch.name[lang] || ch.name.fi || '',
      nameLanguage: ch.name[lang] ? lang : 'fi',
      descriptions:
        ch.descriptions[lang].length > 0
          ? convertChannelDescriptions(ch.descriptions[lang], lang)
          : convertChannelDescriptions(ch.descriptions.fi, 'fi'),
      webPages: uniqueNonEmptyStrings(convertStringArray(ch.webPages, lang)),
      emails: uniqueNonEmptyStrings(convertStringArray(ch.emails, lang)),
      phoneNumbers: convertPhoneNumberList(ch.phoneNumbers, lang),
      addresses: convertAddressList(ch.addresses, lang),
      channelUrls: convertChannelUrlList(ch.channelUrls, lang),
    };
  });

  // Filter out channels that:
  // - have no description, webPages, emails, phone numbers or addresses
  // - don't have a name in any language (this should not happen but just in case)
  // - MAYBE: type is null (because handling such cases on frontend is very difficult)
  return convertedChannels.filter((ch: IChannel) => {
    return (
      containsNonEmptyArrayProperty(ch, ['id', 'name', 'type', 'areas']) &&
      ch.name !== '' &&
      ch.type !== null
    );
  });
}

function convertChannelDescriptions(
  descs: ChannelDescriptionDTO[],
  lang: Language,
): IChannelDescription[] {
  return descs.map((d: ChannelDescriptionDTO) => {
    const descWithLanguage: IChannelDescription = {
      value: ptvSyntaxToHTML(sanitizeDescription(d.value)),
      type: d.type,
      language: lang,
    };
    return descWithLanguage;
  });
}

/**
 *
 * @param data
 * @param lang
 * @returns
 */
function convertStringArray(data: LangStringList, lang: Language): string[] {
  return data[lang].length > 0 ? data[lang] : data['fi'];
}

/**
 * Filter string array so that it only contains unique and non-empty string values
 * @param arr
 * @returns
 */
function uniqueNonEmptyStrings(arr: string[]): string[] {
  return arr
    .filter((val) => val.length > 0)
    .filter((val, index, self) => self.indexOf(val) === index);
}

export function convertServiceName(
  service: ServiceDTO,
  lang: Language,
): IServiceName {
  const nameLanguage: Language = service.name[lang] ? lang : 'fi';
  const nameTranslated = service.nameAutoTranslated[nameLanguage];

  return {
    value: service.name[nameLanguage] || '',
    language: nameLanguage,
    autoTranslated: nameTranslated,
    ...(nameTranslated && {
      original: service.name[TRANSLATION_SOURCE] || '',
      originalLanguage: TRANSLATION_SOURCE,
    }),
  };
}

/**
 * Filter list of organizations to contain only unique values
 * @param data
 * @returns
 */
export function convertOrganizations(data: OrganizationDTO[]): IOrganization[] {
  const converted: IOrganization[] = data
    .filter((o) => isOrgRole(o.roleType))
    .map((org) => {
      return {
        id: org.id || null,
        name: org.name,
        roleType: org.roleType as OrgRole,
      };
    });

  return converted;
}

const isOrgRole = (param: any): param is OrgRole => {
  return Object.values(OrgRole).includes(param);
};

/**
 *
 * @param adds
 * @param lang
 * @returns
 */
export function convertAddressList(
  adds: { [lang in Language]: AddressDTO[] },
  lang: Language,
): IAddress[] {
  const addsByLanguage: AddressDTO[] =
    adds[lang].length > 0 ? adds[lang] : adds['fi'];
  const nonEmptyAddresses = addsByLanguage.filter((address: AddressDTO) => {
    return !isEmptyObject(address, ['type', 'subtype']);
  });

  return nonEmptyAddresses.map((addr: AddressDTO) => {
    const convertedAddress: IAddress = {
      type: addr.type,
      subtype: addr.subtype,
      streetNumber: addr.streetNumber || undefined,
      postalCode: addr.postalCode || undefined,
      streetName: addr.streetName || undefined,
      postOffice: addr.postOffice || undefined,
      municipalityCode: addr.municipalityCode || undefined,
      municipalityName: addr.municipalityName || undefined,
      ...convertCoordinates(addr.latitude, addr.longitude),
    };
    return convertedAddress;
  });
}

/**
 * Convert coordinates from Finnish system (ETRS-TM35FIN) to WGS84 (that for example Open Street Map uses)
 * @param latitude Location latitude expressed in ETRS-TM35FIN coordinate system
 * @param longitude Location longitude expressed in ETRS-TM35FIN coordinate system
 * @returns
 */
function convertCoordinates(
  latitude: string | null,
  longitude: string | null,
): { longitude: string | undefined; latitude: string | undefined } {
  if (latitude && longitude) {
    // ETRS-TM35FIN
    const finnProjection = '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs';
    // WGS84
    const wgsProjection =
      '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs';

    const [convLongitude, convLatitude] = proj4(finnProjection, wgsProjection, [
      Number(longitude),
      Number(latitude),
    ]);

    return {
      longitude: convLongitude.toString(),
      latitude: convLatitude.toString(),
    };
  }

  return {
    longitude: undefined,
    latitude: undefined,
  };
}

export function convertPhoneNumberList(
  nums: { [lang in Language]: PhoneNumberDTO[] },
  lang: Language,
): IPhoneNumber[] {
  const numsByLanguage: PhoneNumberDTO[] =
    nums[lang].length > 0 ? nums[lang] : nums['fi'];
  const nonEmptyNumbers = numsByLanguage.filter((num: PhoneNumberDTO) => {
    return !isEmptyObject(num, []);
  });

  return nonEmptyNumbers.map((num: PhoneNumberDTO) => {
    const convertedNumber: IPhoneNumber = {
      number: num.number,
      prefixNumber: num.prefixNumber || undefined,
      chargeDescription: num.chargeDescription || undefined,
      serviceChargeType: num.serviceChargeType || undefined,
    };
    return convertedNumber;
  });
}

export function convertChannelUrlList(
  urls: { [lang in Language]: ChannelUrlDTO[] },
  lang: Language,
): IChannelUrl[] {
  const urlsByLanguage: ChannelUrlDTO[] =
    urls[lang].length > 0 ? urls[lang] : urls['fi'];

  return urlsByLanguage.map((url: ChannelUrlDTO) => {
    return {
      url: url.url,
      type: url.type,
    };
  });
}

/**
 * Check whether objects fields are set to "no value" (null or empty string)
 * @param o
 * @param fieldsToIgnore Array of names of fields that should not be taken into
 *                       consideration when checking the condition
 * @returns True, if all fields (expect fieldsToIgnore) in the object are set to null
 *          (or an empty string)
 */
function isEmptyObject(o: any, fieldsToIgnore: string[]): boolean {
  return !Object.entries(o).some(
    ([k, v]) => v !== null && v !== '' && !fieldsToIgnore.includes(k),
  );
}

/**
 *
 * @param o
 * @param fieldsToIgnore
 * @returns True, if all fields (expect fieldsToIgnore) in the object are set to null (or an empty string)
 */
function containsNonEmptyArrayProperty(
  o: any,
  fieldsToIgnore: string[],
): boolean {
  return Object.entries(o).some(
    ([k, v]) =>
      !fieldsToIgnore.includes(k) && Array.isArray(v) && v.length !== 0,
  );
}

export function convertServiceDescriptions(
  raw: { [lang in Language]: ServiceDescriptionDTO[] },
  lang: Language,
): IDescription[] {
  return raw[lang].map((desc) => {
    const original = !desc.autoTranslated
      ? undefined
      : raw[TRANSLATION_SOURCE].find((d) => d.type === desc.type);

    return {
      type: desc.type,
      value: ptvSyntaxToHTML(sanitizeDescription(desc.value)),
      language: lang,
      autoTranslated: desc.autoTranslated,
      ...(original && {
        original: ptvSyntaxToHTML(sanitizeDescription(original.value)),
        originalLanguage: TRANSLATION_SOURCE,
      }),
    };
  });
}

function sanitizeDescription(raw: string): string {
  // Replaces non-breakable spaces &nbsp; with regular spaces
  const noNBSP = raw.replace(/(&nbsp;)/gi, ' ');

  // Remove all html tags except <p> - those will be replaced with linebreaks to preserve paragraphs
  const clean: string = sanitizeHtml(noNBSP, {
    allowedTags: ['p'], // To be replaced with line breaks
    allowedAttributes: {},
  });
  return clean.replace(/<p>|<\/p>/gi, '\n');
}

/**
 * PTV descriptions use their own syntax (similar to markdown) to mark lists and titles
 * Lists are marked with * and - and titles (supposed to be h3) are marked with #
 * @param text Any text containing PTV syntax
 * @returns String where PTV syntax has been converted to corresponding HTML elements
 */
export function ptvSyntaxToHTML(text: string): string {
  // Hack so that lists in the end of the description get rendered correctly
  text = text.concat('\n');
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>'); // h3 tag
  //ul
  text = text.replace(/((\*[^*\n]+\n))+/gm, '<ul>$&\n</ul>\n');
  text = text.replace(/\*(.+)/gm, '<li>$1</li>');

  //ol
  text = text.replace(/((\n\d\.[^\d\n]+))+/gm, '<ol>$&\n</ol>\n');
  text = text.replace(/(\n+)\d\.(.+)/gm, '<li>$2</li>');

  //p
  text = text.trim();
  text = text.replace(/^\s*(\n)?(.+)/gm, function (m) {
    return /<(\/)?(h\d|ul|ol|li)/.test(m) && m !== ' '
      ? m
      : '<p>' + m.trim() + '</p>';
  });

  return text.trim();
}
