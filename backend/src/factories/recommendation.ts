import { faker } from '@faker-js/faker';
import { makeFakeService } from './service';
import { makeFakeChannel } from './channel';
import { RecommendationDTO } from '../dtos/recommendation.dto';
import { generateList } from './factory-utils';

export const makeFakeRecommendationList = (
  min = 1,
  max = 3,
): RecommendationDTO[] => {
  return generateList(makeFakeRecommendation(), min, max);
};

export const makeFakeRecommendation = (
  channelCount?: number,
): RecommendationDTO => {
  const minChannels = channelCount || 1;
  const maxChannels = channelCount || 4;
  return {
    service: makeFakeService(),
    channels: generateList(makeFakeChannel(), minChannels, maxChannels),
    score: faker.datatype.boolean() ? faker.datatype.number(1) : undefined,
  };
};
