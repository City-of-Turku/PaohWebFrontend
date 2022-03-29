import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IRecommendation } from 'models/recommendation';
import { IService } from 'models/service';
import { IChannel } from 'models/channel';
import { Language } from '../types';

export const API_PATHS = {
  ping: '/api/ping',
  recommendations: '/api/recommendations',
  services: '/api/services',
  channels: '/api/channels',
};

const BASE_URLS = {
  local: 'http://localhost:8000',
  stage: process.env.REACT_APP_BOTFRONT_ROOT_URL + '/webbackend',
  production: '__botfrontrooturl__' + '/webbackend',
};

export let API_URL = BASE_URLS.stage;
if (process.env.NODE_ENV === 'development') API_URL = BASE_URLS.local;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

class RecommendationsService {
  public async getPing(): Promise<AxiosResponse<string>> {
    return api.get(`${API_PATHS.ping}`);
  }

  public async getServiceRecommendations(
    conversationId: string,
    language: Language,
    area?: string,
  ): Promise<AxiosResponse<IRecommendation[]>> {
    return api.get<IRecommendation[]>(
      `${API_PATHS.recommendations}/${conversationId}/`,
      {
        headers: { 'Accept-Language': language },
        params: { area: area, autoTranslate: true },
      },
    );
  }

  public async getRecommendationsWithoutAreaFilter(
    conversationId: string,
    language: Language,
  ): Promise<AxiosResponse<IRecommendation[]>> {
    return api.get<IRecommendation[]>(
      `${API_PATHS.recommendations}/${conversationId}/`,
      {
        headers: { 'Accept-Language': language },
        params: { autoTranslate: true },
      },
    );
  }

  public async getService(
    serviceId: string,
    language: Language,
  ): Promise<AxiosResponse<IService>> {
    return api.get<IService>(`${API_PATHS.services}/${serviceId}`, {
      headers: { 'Accept-Language': language },
      params: { autoTranslate: true },
    });
  }

  public async getServiceChannels(
    serviceId: string,
    language: Language,
  ): Promise<AxiosResponse<IChannel[]>> {
    return api.get<IChannel[]>(`${API_PATHS.channels}/${serviceId}`, {
      headers: { 'Accept-Language': language },
    });
  }
}

export default new RecommendationsService();
