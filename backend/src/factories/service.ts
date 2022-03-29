import { faker } from '@faker-js/faker';
import {
  ServiceDTO,
  ServiceDescriptionDTO,
  ServiceDescriptionType,
  ServiceAreaDTO,
  OrganizationDTO,
  serviceDescriptionTypes,
} from '../dtos/service.dto';
import { Language } from '../types';
import { generateList } from './factory-utils';

export const makeFakeService = (): ServiceDTO => {
  const areaList: ServiceAreaDTO[] = generateList(makeFakeServiceArea(), 0, 3);
  return {
    id: faker.random.alphaNumeric(8),
    name: {
      en: faker.lorem.word(),
      fi: faker.lorem.word(),
      sv: faker.lorem.word(),
    },
    nameAutoTranslated: {
      en: faker.datatype.boolean(),
      fi: faker.datatype.boolean(),
      sv: faker.datatype.boolean(),
    },
    descriptions: makeFakeServiceDescriptionList(),
    organizations: generateList(makeFakeOrganization(), 0, 4),
    areas: {
      en: areaList,
      fi: areaList,
      sv: areaList,
    },
    lastUpdated: faker.date.past(),
  };
};

export const makeFakeServiceDescriptionList = (
  minCount: number = 0,
): { [lang in Language]: ServiceDescriptionDTO[] } => {
  const descTypes = faker.random.arrayElements(
    serviceDescriptionTypes,
    faker.datatype.number({ min: minCount, max: 6 }),
  );

  const descTypesSubset = faker.random.arrayElements(
    descTypes,
    faker.datatype.number({ min: minCount, max: 6 }),
  );

  const makeDescriptions = (types: ServiceDescriptionType[]) => {
    return types.map((type: ServiceDescriptionType) => {
      return {
        value: faker.lorem.sentence(),
        type: type,
        autoTranslated: false,
      };
    });
  };

  return {
    fi: makeDescriptions(descTypes),
    sv: makeDescriptions(descTypesSubset),
    en: makeDescriptions(descTypesSubset),
  };
};

const makeFakeServiceArea = (): ServiceAreaDTO => {
  return {
    name: faker.address.cityName(),
    type: 'Municipality',
    code: faker.unique.name,
  };
};

export const makeFakeOrganization = (): OrganizationDTO => {
  return {
    id: faker.datatype.boolean() ? faker.random.alphaNumeric(4) : null,
    name: faker.company.companyName(),
    roleType: faker.random
      .arrayElements(['Responsible', 'Producer', 'OtherResponsible', undefined])
      .pop(),
  };
};
