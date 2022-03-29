import {
  makeFakeAddress,
  makeFakeChannel,
  makeFakePhoneNumber,
} from './factories/channel';
import {
  makeFakeServiceDescriptionList,
  makeFakeOrganization,
} from './factories/service';
import {
  makeFakeRecommendationList,
  makeFakeRecommendation,
} from './factories/recommendation';
import { AddressDTO } from './dtos/channel.dto';
import {
  convertAddressList,
  convertOrganizations,
  convertPhoneNumberList,
  convertRecommendations,
  convertServiceDescriptions,
  ptvSyntaxToHTML,
} from './convert';
import { RecommendationDTO } from './dtos/recommendation.dto';
import { OrganizationDTO } from './dtos/service.dto';
import { OrgRole } from './models/service';

describe('Test convertRecommendations', () => {
  it('Is able to handle empty list', () => {
    const converted = convertRecommendations([], 'fi');
    expect(converted).toEqual([]);

    const convertedWithoutLang = convertRecommendations([]);
    expect(convertedWithoutLang).toEqual([]);
  });

  it('Replaces channel property null value with empty array', () => {
    const rec = makeFakeRecommendation();
    const nullChannels = [{ ...rec, channels: null }];
    const converted = convertRecommendations(nullChannels);
    expect(converted[0].channels).toEqual([]);
  });

  it('Parses Finnish data by default', () => {
    const recs = makeFakeRecommendationList();
    const converted = convertRecommendations(recs);
    expect(converted[0].service.name.value).toEqual(recs[0].service.name.fi);
    expect(converted[0].service.name.language).toEqual('fi');
    expect(
      converted[0].service.name.value !== recs[0].service.name.en ||
        recs[0].service.name.en === recs[0].service.name.fi,
    ).toBeTruthy();
    expect(
      converted[0].service.name.value !== recs[0].service.name.sv ||
        recs[0].service.name.sv === recs[0].service.name.fi,
    ).toBeTruthy();
  });

  it('Returns data in the requested language if available', () => {
    const recs = makeFakeRecommendationList(3, 3);
    const converted = convertRecommendations(recs, 'en');
    expect(converted[0].service.name.value).toEqual(recs[0].service.name.en);
    expect(converted[0].service.name.language).toEqual('en');
  });

  it('Uses Finnish as a fallback language', () => {
    const rec = makeFakeRecommendation();
    const missingEnglishData = [
      {
        ...rec,
        service: {
          ...rec.service,
          name: {
            ...rec.service.name,
            en: null,
          },
          descriptions: {
            ...rec.service.descriptions,
            en: [],
          },
        },
      },
    ];

    const converted = convertRecommendations(missingEnglishData, 'en');
    const descsWithLanguage = rec.service.descriptions.fi.map((d) => {
      return {
        ...d,
        value: ptvSyntaxToHTML(d.value),
        language: 'fi',
        autoTranslated: false,
      };
    });
    expect(converted[0].service.descriptions).toEqual(descsWithLanguage);
    expect(converted[0].service.name.value).toEqual(rec.service.name.fi);
    expect(converted[0].service.name.language).toEqual('fi');
  });

  it('Gives service empty names if no names available', () => {
    const rec = makeFakeRecommendation();
    const missingNames: RecommendationDTO[] = [
      {
        ...rec,
        service: {
          ...rec.service,
          name: {
            en: null,
            fi: null,
            sv: null,
          },
        },
        channels: rec.channels,
      },
    ];

    const converted = convertRecommendations(missingNames, 'fi');
    expect(converted[0].service.name.value).toEqual('');
  });

  it('Filters out channels that do not have a name in any language', () => {
    const rec = makeFakeRecommendation(2);
    const channel1 = makeFakeChannel();
    const channel2 = makeFakeChannel();
    const missingNames: RecommendationDTO[] = [
      {
        ...rec,
        service: {
          ...rec.service,
          name: {
            en: null,
            fi: null,
            sv: null,
          },
        },
        channels: [
          {
            ...channel1,
            name: { fi: null, en: null, sv: null },
          },
          channel2,
        ],
      },
    ];

    const converted = convertRecommendations(missingNames, 'fi');
    expect(converted[0].channels.length).toEqual(1);
    expect(converted[0].channels[0].id).toEqual(channel2.id);
  });

  it('Filters out channels that only have name and/or type information', () => {
    const rec = makeFakeRecommendation();
    const missingNames: RecommendationDTO[] = [
      {
        ...rec,
        service: {
          ...rec.service,
          name: {
            en: null,
            fi: null,
            sv: null,
          },
        },
        channels: [
          {
            id: '4538495838489',
            type: 'WebPage',
            organizationId: '8476354836',
            serviceIds: [],
            name: { fi: 'Some sample name', en: null, sv: null },
            descriptions: { fi: [], en: [], sv: [] },
            webPages: { fi: [], en: [], sv: [] },
            emails: { fi: [], en: [], sv: [] },
            phoneNumbers: { fi: [], en: [], sv: [] },
            addresses: { fi: [], en: [], sv: [] },
            channelUrls: { fi: [], en: [], sv: [] },
            lastUpdated: new Date(),
          },
        ],
      },
    ];

    const converted = convertRecommendations(missingNames, 'fi');
    expect(converted[0].channels).toEqual([]);
  });
});

describe('Test convertAddressList', () => {
  const nullAddress: AddressDTO = {
    type: 'Postal',
    subtype: 'Street',
    streetNumber: null,
    postalCode: null,
    latitude: null,
    longitude: null,
    streetName: null,
    postOffice: null,
    municipalityCode: null,
    municipalityName: null,
  };

  it('Filters out address with all null fields', () => {
    expect(
      convertAddressList({ en: [nullAddress], fi: [], sv: [] }, 'en'),
    ).toEqual([]);
  });

  it('Keeps address as long as one address field is not null', () => {
    const oneFieldDefined = { ...nullAddress, streetNumber: '56' };
    const conversionResult = convertAddressList(
      { fi: [oneFieldDefined, nullAddress], en: [], sv: [] },
      'en',
    );
    expect(conversionResult.length).toEqual(1);
    expect(conversionResult[0].longitude).toBeUndefined();
    expect(conversionResult[0].latitude).toBeUndefined();
    expect(conversionResult[0].streetNumber).toEqual(
      oneFieldDefined.streetNumber,
    );
  });

  it('Converts null values to undefined', () => {
    const randomAddress = makeFakeAddress();
    const nullCoordinates: AddressDTO = {
      ...randomAddress,
      streetNumber: null,
      longitude: null,
      latitude: null,
    };
    const conversionResult = convertAddressList(
      { fi: [nullCoordinates], en: [], sv: [] },
      'en',
    );
    expect(conversionResult.length).toEqual(1);
    expect(conversionResult[0].longitude).toBeUndefined();
    expect(conversionResult[0].latitude).toBeUndefined();
    expect(conversionResult[0].streetNumber).toBeUndefined();
    expect(conversionResult[0].streetName).toEqual(nullCoordinates.streetName);
  });

  it('Returns data in the requested language', () => {
    const inputData = {
      fi: [makeFakeAddress(), makeFakeAddress()],
      en: [makeFakeAddress()],
      sv: [makeFakeAddress(), makeFakeAddress(), makeFakeAddress()],
    };
    const resultEnglish = convertAddressList(inputData, 'en');
    expect(resultEnglish.length).toBe(1);
    expect(resultEnglish[0].streetName).toEqual(inputData.en[0].streetName);
    expect(resultEnglish[0].postalCode).toEqual(inputData.en[0].postalCode);

    const resultSwedish = convertAddressList(inputData, 'sv');
    expect(resultSwedish.length).toBe(3);

    const resultFinnish = convertAddressList(inputData, 'fi');
    expect(resultFinnish.length).toBe(2);
  });
});

describe('Test convertPhoneNumberList', () => {
  it('Returns an empty list if no numbers are available', () => {
    const inputData = { fi: [], en: [], sv: [] };
    const resultFinnish = convertPhoneNumberList(inputData, 'fi');
    expect(resultFinnish.length).toBe(0);
    expect(resultFinnish).toEqual([]);
  });

  it('Returns data in the requested language', () => {
    const inputData = {
      fi: [makeFakePhoneNumber(), makeFakePhoneNumber()],
      en: [],
      sv: [],
    };

    const resultFinnish = convertPhoneNumberList(inputData, 'fi');
    expect(resultFinnish.length).toBe(2);
    expect(resultFinnish[0].number).toEqual(inputData.fi[0].number);

    expect(
      (inputData.fi[0].prefixNumber === null &&
        resultFinnish[0].prefixNumber === undefined) ||
        resultFinnish[0].prefixNumber === inputData.fi[0].prefixNumber,
    ).toBeTruthy();

    expect(
      (inputData.fi[0].chargeDescription === null &&
        resultFinnish[0].chargeDescription === undefined) ||
        resultFinnish[0].chargeDescription ===
          inputData.fi[0].chargeDescription,
    ).toBeTruthy();

    expect(
      (inputData.fi[0].serviceChargeType === null &&
        resultFinnish[0].serviceChargeType === undefined) ||
        resultFinnish[0].serviceChargeType ===
          inputData.fi[0].serviceChargeType,
    ).toBeTruthy();
  });

  it('Always uses Finnish as a fallback language', () => {
    const inputData = {
      fi: [makeFakePhoneNumber()],
      en: [],
      sv: [],
    };

    const fallbackFromEnglish = convertPhoneNumberList(inputData, 'en');
    expect(fallbackFromEnglish.length).toBe(1);
    expect(fallbackFromEnglish[0].number).toEqual(inputData.fi[0].number);

    const fallbackFromSwedish = convertPhoneNumberList(inputData, 'sv');
    expect(fallbackFromEnglish).toEqual(fallbackFromSwedish);

    const englishEmpty = {
      fi: [makeFakePhoneNumber()],
      en: [],
      sv: [makeFakePhoneNumber()],
    };
    const convertedEnglish = convertPhoneNumberList(englishEmpty, 'en');
    expect(convertedEnglish.length).toBe(1);
    expect(convertedEnglish[0].number).toEqual(englishEmpty.fi[0].number);
  });
});

describe('Test convertOrganizations', () => {
  it('filters out organizations without role', () => {
    const org1 = { ...makeFakeOrganization(), roleType: null };
    const org2 = makeFakeOrganization();
    const org3 = makeFakeOrganization();
    const apiOrganizations: OrganizationDTO[] = [
      org1,
      {
        id: org2.id,
        name: org2.name,
      },
      {
        id: org3.id,
        name: org3.name,
        roleType: 'Responsible',
      },
    ];

    const converted = convertOrganizations(apiOrganizations);
    expect(converted.length).toBe(1);
    expect(converted[0]).toEqual(apiOrganizations[2]);
  });

  it('allows organizations with null ids', () => {
    const apiOrganizations = [
      {
        id: '7435c711-4cbc-42d8-b155-2ceeb3357f21',
        name: 'Kosken Tl kunta',
        roleType: 'Producer',
      },
      {
        id: '3614165f-5528-43a1-9fb7-d69ebb40fd50',
        name: 'Kosken Tl kunta, Hyvinvointilautakunta',
      },
      {
        id: '7435c711-4cbc-42d8-b155-2ceeb3357f21',
        name: 'Kosken Tl kunta',
        roleType: 'Responsible',
      },
      {
        id: null,
        name: 'Kunnat',
        roleType: 'Producer',
      },
      {
        id: null,
        name: 'VSSHP',
        roleType: 'Producer',
      },
    ];

    const converted = convertOrganizations(apiOrganizations);
    expect(converted.length).toEqual(4);
    expect(converted[0].name).toEqual('Kosken Tl kunta');
    expect(converted[3].name).toEqual('VSSHP');
    expect(converted[3].roleType).toEqual(OrgRole.Producer);
  });
});

describe('Test convertServiceDescriptions', () => {
  test('Returns original description and language only if description was automatically translated', () => {
    const descriptions = makeFakeServiceDescriptionList(2);

    descriptions.en[0].autoTranslated = true;
    descriptions.en[1].autoTranslated = false;

    const converted = convertServiceDescriptions(descriptions, 'en');

    expect(converted.length).toEqual(descriptions.en.length);
    expect(converted[0].language).toEqual('en');
    expect(converted[0]).toHaveProperty('original');
    expect(converted[0]).toHaveProperty('originalLanguage');

    expect(converted[1]).not.toHaveProperty('original');
    expect(converted[1]).not.toHaveProperty('originalLanguage');
  });
});
