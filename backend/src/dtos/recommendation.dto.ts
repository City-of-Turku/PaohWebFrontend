import { ServiceDTO } from './service.dto';
import { ChannelDTO } from './channel.dto';

export interface RecommendationDTO {
  service: ServiceDTO;
  channels: ChannelDTO[] | null;
  score?: number;
}
