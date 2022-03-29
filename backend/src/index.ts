import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { RecommendationDTO } from './dtos/recommendation.dto';
import { IRecommendation } from './models/recommendation';
import {
  convertChannels,
  convertRecommendations,
  convertService,
} from './convert';
import { Language } from './types';
import { IChannel } from './models/channel';
import { IService } from './models/service';
import { ChannelDTO } from './dtos/channel.dto';
import { ServiceDTO } from './dtos/service.dto';

export const app: Application = express();
app.disable('x-powered-by');

const recApiURL = process.env.SERVICE_RECOMMENDER_ENDPOINT;

var whitelist =
  process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'https://localhost:3000']
    : ['https://test.palveluohjaaja.fi', 'https://palveluohjaaja.fi'];

var corsOptionsDelegate = function (req: Request, callback: any) {
  let corsOptions;
  if (
    req.headers['origin'] &&
    whitelist.indexOf(req.headers['origin']) !== -1
  ) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

/**
 * Parse requested languages from HTTP header
 * Frontend will set the language to one of the accepted languages.
 * This is mainly needed when accessing backend api from browser (in development)
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  // Reads the accept-language header and return the language if found or false if not
  const lang = req.acceptsLanguages('fi', 'sv', 'en');
  if (lang) {
    req.headers['accept-language'] = lang;
  } else {
    req.headers['accept-language'] = 'fi';
  }
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Webserver is up and running');
});

app.get('/api/', (_req: Request, res: Response) => {
  res.send('API is up and running!');
});

app.get('/api/ping', (_req: Request, res: Response) => {
  res.send('Ping pong from server!');
});

app.get(
  '/api/recommendations/:conversationId',
  (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    const { area, autoTranslate } = req.query;
    const translate_missing_texts = autoTranslate || false;
    const municipalities = area ? [area] : ['all'];
    const requestedLanguage = req.headers['accept-language'] as Language;
    axios
      .post(
        `${recApiURL}/services/recommendByConversation/${conversationId}`,
        {
          top_k: 20,
          municipalities: municipalities,
          language: requestedLanguage,
          translate_missing_texts: translate_missing_texts,
        },
        { timeout: 15000 },
      )
      .then((response) => {
        const recommendations: RecommendationDTO[] = response.data;
        const recsForClient: IRecommendation[] = convertRecommendations(
          recommendations,
          requestedLanguage,
        );
        res.send(recsForClient);
      })
      .catch((error) => {
        throw Error(error);
      });
  },
);

app.get('/api/services/:serviceId', (req: Request, res: Response) => {
  const serviceId = req.params.serviceId;
  const { autoTranslate } = req.query;
  const translate_missing_texts = autoTranslate || false;
  const requestedLanguage = req.headers['accept-language'] as Language;

  axios
    .get(
      `${recApiURL}/services/${serviceId}?translate_missing_texts=${translate_missing_texts}`,
      {
        timeout: 15000,
      },
    )
    .then((response) => {
      const service: ServiceDTO = response.data;
      const serviceForClient: IService = convertService(
        service,
        requestedLanguage,
      );
      res.send(serviceForClient);
    })
    .catch((error) => {
      console.log(error);
      throw Error(error);
    });
});

app.get('/api/channels/:serviceId', (req: Request, res: Response) => {
  const serviceId = req.params.serviceId;
  const requestedLanguage = req.headers['accept-language'] as Language;

  axios
    .get(`${recApiURL}/serviceChannels/${serviceId}`, { timeout: 15000 })
    .then((response) => {
      const channels: ChannelDTO[] = response.data;
      const channelsForClient: IChannel[] = convertChannels(
        channels,
        requestedLanguage,
      );
      res.send(channelsForClient);
    })
    .catch((error) => {
      console.log(error);
      throw Error(error);
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.info(`server up listening on port => ${PORT}`);
});
