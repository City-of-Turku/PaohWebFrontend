import { faker } from '@faker-js/faker';
import {
  AddressDTO,
  ChannelDescriptionDTO,
  ChannelDTO,
  ChannelUrlDTO,
  PhoneNumberDTO,
  channelTypes,
} from '../dtos/channel.dto';
import { generateList } from './factory-utils';

export const makeFakeChannel = (): ChannelDTO => {
  return {
    id: faker.random.alphaNumeric(16),
    type: faker.random.arrayElements(channelTypes, 1)[0],
    organizationId: faker.random.alphaNumeric(16),
    serviceIds: generateList(faker.random.alphaNumeric, 0, 4),
    name: {
      en: faker.company.companyName(),
      fi: faker.company.companyName(),
      sv: faker.company.companyName(),
    },
    descriptions: {
      en: generateList(makeFakeChannelDescription(), 0, 5),
      fi: generateList(makeFakeChannelDescription(), 0, 5),
      sv: generateList(makeFakeChannelDescription(), 0, 5),
    },
    webPages: {
      en: generateList(faker.internet.url(), 0, 4),
      fi: generateList(faker.internet.url(), 0, 4),
      sv: generateList(faker.internet.url(), 0, 4),
    },
    emails: {
      en: generateList(faker.internet.email(), 0, 3),
      fi: generateList(faker.internet.email(), 0, 3),
      sv: generateList(faker.internet.email(), 0, 3),
    },
    phoneNumbers: {
      en: generateList(makeFakePhoneNumber()),
      fi: generateList(makeFakePhoneNumber()),
      sv: generateList(makeFakePhoneNumber()),
    },
    addresses: {
      en: generateList(makeFakeAddress(), 1, 3),
      fi: generateList(makeFakeAddress(), 1, 3),
      sv: generateList(makeFakeAddress(), 1, 3),
    },
    channelUrls: {
      en: generateList(makeFakeChannelUrl(), 0, 3),
      fi: generateList(makeFakeChannelUrl(), 0, 3),
      sv: generateList(makeFakeChannelUrl(), 0, 3),
    },
    lastUpdated: faker.date.past(),
  };
};

export const makeFakeAddress = (): AddressDTO => {
  return {
    type: faker.lorem.word(),
    subtype: faker.lorem.word(),
    streetNumber: faker.address.streetName(),
    postalCode: faker.address.zipCode(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    streetName: faker.address.streetName(),
    postOffice: faker.address.cityName(),
    municipalityCode: faker.random.alphaNumeric(),
    municipalityName: faker.address.cityName(),
  };
};

export const makeFakePhoneNumber = (): PhoneNumberDTO => {
  return {
    number: faker.phone.phoneNumber(),
    prefixNumber: faker.datatype.boolean()
      ? faker.random.alphaNumeric(4)
      : null,
    chargeDescription: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    serviceChargeType: faker.datatype.boolean() ? faker.lorem.word() : null,
  };
};

const makeFakeChannelDescription = (): ChannelDescriptionDTO => {
  return {
    value: faker.lorem.sentences(),
    type: faker.lorem.word(),
  };
};

const makeFakeChannelUrl = (): ChannelUrlDTO => {
  return {
    url: faker.internet.url(),
    type: faker.lorem.word(),
  };
};
