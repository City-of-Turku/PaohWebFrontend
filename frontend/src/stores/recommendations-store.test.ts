import RecommendationStore from './recommendations-store';
import { AxiosResponse } from 'axios';
import RecommendationsService from '../services/recs.service';
import { IRecommendation } from 'models/recommendation';
import { useStore } from './store-hooks';
import { testHook } from 'utils/test-utils';

const TEST_RECOMMENDATIONS: IRecommendation[] = [
  {
    service: {
      id: '1',

      name: {
        value: 'Tukea mielenterveyden vahvistamiseen',
        language: 'fi',
        autoTranslated: false,
      },
      organizations: [],
      descriptions: [
        {
          value:
            'Ota yhteyttä, kun pohdit, miten voisit vahvistaa omia mielenterveystaitojasi. Meiltä saat tietoa ja harjoituksia sekä tukea elämän eri tilanteisiin.',
          type: 'Summary',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value:
            'Ota yhteyttä, kun pohdit, miten voisit vahvistaa omia mielenterveystaitoja. Meiltä saat tietoa ja harjoituksia sekä tukea elämän eri tilanteisiin. Autamme pohtimaan keinoja oman tilanteen helpottamiseksi, omien voimavarojen löytämiseksi ja ongelmien ratkaisemiseksi.\n\nVoit ottaa yhteyttä nimettömänä ja luottamuksellisesti.\n',
          type: 'Description',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value:
            'Saat keskusteluapua puhelinpalvelussa, joka palvelee 24 tuntia vuorokaudessa suomeksi, ruotsiksi, englanniksi ja arabiaksi.',
          type: 'UserInstruction',
          language: 'fi',
          autoTranslated: false,
        },
      ],
      areas: [],
    },
    channels: [
      {
        id: '23',
        type: 'Phone',
        name: 'Kriisipuhelin',
        descriptions: [
          {
            value:
              'Kriisipuhelin tarjoaa keskusteluapua kriisissä oleville ja heidän läheisilleen.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Kriisipuhelimeen voit soittaa nimettömänä ja luottamuksellisesti. Kriisipuhelin tarjoaa keskusteluapua kriisissä oleville ja heidän läheisilleen. Puhelimessa vastaavat kriisityön ammattilaiset sekä koulutetut vapaaehtoiset ympäri Suomea. ',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: [],
        emails: [],
        phoneNumbers: [
          {
            number: '925250111',
            prefixNumber: '+358',
            serviceChargeType: 'Chargeable',
          },
        ],
        addresses: [],
        channelUrls: [],
      },
    ],
    score: 0.1,
  },
  {
    service: {
      id: '1d',
      name: {
        value: 'Kirkon keskusteluapu',
        language: 'fi',
        autoTranslated: false,
      },
      organizations: [],
      descriptions: [
        {
          value: 'Kirkon keskusteluapu auttaa ja kuuntelee.',
          type: 'Summary',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value:
            'Kirkon keskusteluapu on sinua varten, kun kaipaat henkistä tai hengellistä tukea. Päivystäjät ovat vaitiolovelvollisia koulutettuja vapaaehtoisia ja kirkon työntekijöitä.',
          type: 'Description',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value:
            'Voit saada keskusteluapua palvelevan puhelimen, palvelevan chatin tai palvelevan netin kautta tai kirjoittamalla kirjeen. \n\nJos haluat keskustella kasvokkain, voit sopia tapaamisen oman seurakuntasi papin tai diakonin kanssa. ',
          type: 'UserInstruction',
          language: 'fi',
          autoTranslated: false,
        },
      ],
      areas: [],
    },
    channels: [
      {
        id: '80',
        type: 'Phone',
        name: 'Palveleva puhelin',
        descriptions: [
          {
            value:
              'Voit soittaa palvelevaan puhelimeen, kun tarvitset henkistä tai hengellistä tukea.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Voit soittaa palvelevaan puhelimeen, kun tarvitset henkistä tai hengellistä tukea. \n\nPäivystäjät ovat vaitiolovelvollisia koulutettuja vapaaehtoisia ja kirkon työntekijöitä.',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: [],
        emails: [],
        phoneNumbers: [
          {
            number: '400221180',
            prefixNumber: '+358',
            chargeDescription:
              'Operaattori veloittaa puhelusta liittymäsopimuksesi mukaisen hinnan (pvm/mpm).',
            serviceChargeType: 'Chargeable',
          },
        ],
        addresses: [],
        channelUrls: [],
      },
      {
        id: '6a',
        type: 'WebPage',
        name: 'Keskustelu papin tai diakonin kanssa',
        descriptions: [
          {
            value:
              'Jos haluat keskustella papin tai diakonin kanssa, ota yhteys lähimpään seurakuntaan.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Haluatko keskustella papin tai diakonin kanssa? Löydät lähimmän seurakunnan yhteystiedot seurakuntahausta. ',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: ['https://evl.fi/seurakunnat'],
        emails: [],
        phoneNumbers: [],
        addresses: [],
        channelUrls: [],
      },
      {
        id: '4b',
        type: 'EChannel',
        name: 'Palveleva chat',
        descriptions: [
          {
            value: 'Chatin keskustelut ovat kahdenkeskisiä.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Keskustelut ovat kahdenkeskisiä. Yhteydenottaja näkyy päivystäjälle nimettomänä.',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: [
          'https://evl.teleqone.com/external/chat/chatWindow.zul?config=588f4202ca1d7534d0667264',
        ],
        emails: [],
        phoneNumbers: [],
        addresses: [],
        channelUrls: [],
      },
      {
        id: '159b645a-f480-4246-b761-d7599215e663',
        type: 'EChannel',
        name: 'Palveleva netti',
        descriptions: [
          {
            value:
              'Painaako jokin mieltäsi? Kirjoita meille. Vastaamme muutaman päivän kuluessa.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Painaako jokin mieltäsi? Kirjoita meille. Vastaamme muutaman päivän kuluessa.\n\nPalveleva netti on valtakunnallinen palvelu, jonka viestit ohjautuvat kirkon päivystäjille ympäri maata. ',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: [
          'https://www4.teleqone.com/external/questionBox/questionBox.zul?config=588f410b938cfb2aaac07832',
        ],
        emails: [],
        phoneNumbers: [],
        addresses: [],
        channelUrls: [],
      },
    ],
    score: 0.7,
  },
  {
    service: {
      id: '234861f6-28d2-4671-8f50-269592a92148',

      name: {
        value: 'Läheisen kuoleman muistilista',
        language: 'fi',
        autoTranslated: false,
      },
      organizations: [],
      descriptions: [
        {
          value:
            'Läheisen kuolema on usein henkisesti raskas tapahtuma ja siihen saattaa liittyä paljon omaiselle uusia käytännön asioita. Surun keskellä kaikkien tarvittavien käytännön asioiden selvittäminen voi tuntua hyvin raskaalta. Olitpa sitten vainajan aviopuoliso, avopuoliso, lapsi, muu omainen tai ystävä, tältä sivulta saat tietoa ja apua läheisen kuolemaan liittyvien käytännön asioiden hoitamiseen. Saat sivulta apua esimerkiksi kuolemasta ilmoittamiseen, hautajaisten järjestämiseen, perunkirjoitukseen sekä perintöveron maksamiseen.\n\nSeuraamalla sivuston aikajanaa, saat läheisen kuolemaan liittyvät asiat hoidettua ilman ylimääräistä huolta. Tehtävät ja tapahtumat on järjestetty aikajärjestykseen ja jokaisen tehtävän kohdalta näet helposti, kuinka pitkän ajan kuluessa kuolemasta kyseinen tehtävä tulisi suorittaa.\n\nLöydät sivuilta myös tarkempaa tietoa jokaiseen tehtävään liittyen. Painamalla sivustolla tehtävän alta löytyvää linkkiä, voit lukea asiasta tarkemmin.',
          type: 'Description',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value:
            'Muistilista ja ohjeita läheisen kuoleman kohdanneelle. Mitä kaikkia asioita omaisten tulee ottaa huomioon ja kuinka hoitaa käytännön asiat.',
          type: 'Summary',
          language: 'fi',
          autoTranslated: false,
        },
      ],
      areas: [],
    },
    channels: [
      {
        id: 'ef6b8385-eee5-452d-8932-bfed39416da2',
        type: 'WebPage',
        name: 'Aatos – Läheisen kuolema verkkosivu',
        descriptions: [
          {
            value:
              'Muistilista ja ohjeita läheisen kuoleman kohdanneelle. Yrityksen verkkosivu.',
            type: 'Summary',
            language: 'fi',
          },
          {
            value:
              'Läheisen kuolema on usein henkisesti raskas tapahtuma ja siihen saattaa liittyä paljon omaiselle uusia käytännön asioita. Surun keskellä kaikkien tarvittavien käytännön asioiden selvittäminen voi tuntua hyvin raskaalta. Olitpa sitten vainajan aviopuoliso, avopuoliso, lapsi, muu omainen tai ystävä, tältä sivulta saat tietoa ja apua läheisen kuolemaan liittyvien käytännön asioiden hoitamiseen. Saat sivulta apua esimerkiksi kuolemasta ilmoittamiseen, hautajaisten järjestämiseen, perunkirjoitukseen sekä perintöveron maksamiseen.\n\nSeuraamalla sivuston aikajanaa, saat läheisen kuolemaan liittyvät asiat hoidettua ilman ylimääräistä huolta. Tehtävät ja tapahtumat on järjestetty aikajärjestykseen ja jokaisen tehtävän kohdalta näet helposti, kuinka pitkän ajan kuluessa kuolemasta kyseinen tehtävä tulisi suorittaa.\n\nLöydät sivuilta myös tarkempaa tietoa jokaiseen tehtävään liittyen. Painamalla sivustolla tehtävän alta löytyvää linkkiä, voit lukea asiasta tarkemmin.',
            type: 'Description',
            language: 'fi',
          },
        ],
        webPages: ['https://aatos.app/laheisenkuolema/'],
        emails: ['asiakaspalvelu@aatos.app'],
        phoneNumbers: [],
        addresses: [],
        channelUrls: [],
      },
    ],
  },
];

const FETCH_RECS_MOCK: AxiosResponse<IRecommendation[]> = {
  data: TEST_RECOMMENDATIONS,
  status: 200,
  statusText: '',
  headers: {},
  config: {},
};

const EMPTY_RESPONSE: AxiosResponse<IRecommendation[]> = {
  data: [],
  status: 200,
  statusText: '',
  headers: {},
  config: {},
};

describe('Recommendations Store', () => {
  it('fetches recommendations', async () => {
    const spy = jest
      .spyOn(RecommendationsService, 'getServiceRecommendations')
      .mockResolvedValueOnce(FETCH_RECS_MOCK);
    const store = new RecommendationStore();
    expect(store.recommendations.length).toEqual(0);
    await store.loadRecommendations('fakeId', 'fi');
    expect(store.recommendations.length).toEqual(3);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('confidentRecommendations should filter out recommendations below certain confidence level', async () => {
    const spy = jest
      .spyOn(RecommendationsService, 'getServiceRecommendations')
      .mockResolvedValueOnce(FETCH_RECS_MOCK);
    const store = new RecommendationStore();
    expect(store.recommendations.length).toEqual(0);
    await store.loadRecommendations('fakeId', 'fi');

    expect(store.recommendations.length).toEqual(3);
    expect(store.recommendations).toEqual(TEST_RECOMMENDATIONS);
    expect(store.confidentRecommendations.length).toEqual(3);
    expect(store.recommendations.length).toEqual(3);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('recommendations are not overwritten if api returns an empty list', async () => {
    const spy = jest
      .spyOn(RecommendationsService, 'getServiceRecommendations')
      .mockResolvedValueOnce(EMPTY_RESPONSE);

    const store = new RecommendationStore();
    store.setRecommendations(TEST_RECOMMENDATIONS);
    expect(store.recommendations.length).toEqual(3);

    await store.loadRecommendations('someID', 'fi');
    expect(store.recommendations.length).toEqual(3);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('Store hooks', () => {
  let recStore: RecommendationStore;
  beforeEach(() => {
    testHook(() => {
      recStore = useStore('recommendationsStore');
    });
  });

  it('useStore() returns a reference to recommendationsStore', () => {
    expect(recStore).toBeInstanceOf(RecommendationStore);
    expect(recStore).toHaveProperty('recommendations');
    expect(recStore.recommendations).toStrictEqual([]);
  });
});
