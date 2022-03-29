import { IService } from './service';
import { IChannel } from './channel';

export interface IRecommendation {
  service: IService;
  channels: IChannel[];
  score?: number;
}
