import { makeAutoObservable, runInAction } from 'mobx';
import RecommendationsService from 'services/recs.service';
import { IRecommendation } from 'models/recommendation';
import { Language } from 'types';
import { StoreState } from 'stores/store-state';

class RecommendationStore {
  constructor() {
    makeAutoObservable(this);
  }

  recommendations: IRecommendation[] = [];
  state: StoreState = StoreState.done;
  selectedRec: IRecommendation | undefined = undefined; // Recommendation selected for full-page viewing in mobile
  municipality: string | null = 'all';

  setRecommendations = (recommendations: IRecommendation[]): void => {
    runInAction(() => {
      this.recommendations = recommendations;
    });
  };

  get storeState(): StoreState {
    return this.state;
  }

  get isMunicipalityFilterSet(): boolean {
    return this.municipality !== null;
  }

  get wholeRegionSelected(): boolean {
    return this.municipality === 'all';
  }

  get selectedMunicipality(): string | null {
    runInAction(() => {
      const storedMunicipality = sessionStorage.getItem(
        'palveluohjain_municipality',
      );
      if (storedMunicipality && storedMunicipality !== '') {
        this.municipality = storedMunicipality;
      }
    });
    return this.municipality;
  }

  set selectedMunicipality(area: string | null) {
    if (area) {
      sessionStorage.setItem('palveluohjain_municipality', area);
    } else {
      sessionStorage.removeItem('palveluohjain_municipality');
    }
    runInAction(() => {
      this.municipality = area;
    });
  }

  // Alongside a specific municipality, filter can be not active (null)
  // or to the whole region (value 'all')
  get filterIsMunicipality(): boolean {
    return (
      this.selectedMunicipality !== null && this.selectedMunicipality !== 'all'
    );
  }

  async loadRecommendations(
    conversationId: string,
    language: Language,
    area?: string | null,
  ): Promise<void> {
    try {
      const response = await RecommendationsService.getServiceRecommendations(
        conversationId,
        language,
        area || undefined,
      );
      let receivedSameData = false;

      if (response.data && response.data.length > 0) {
        receivedSameData =
          response.data.length === this.recommendations.length &&
          JSON.stringify(response.data) ===
            JSON.stringify(this.recommendations);

        if (!receivedSameData) {
          runInAction(() => {
            this.state = StoreState.pending;
            this.setRecommendations(response.data);
          });
        }
      }
      setTimeout(
        () => {
          runInAction(() => {
            this.state = StoreState.done;
          });
        },
        receivedSameData ? 0 : 1500,
      );
    } catch (e) {
      runInAction(() => {
        this.state = StoreState.error;
      });
    }
  }

  async resetAreaFilter(
    conversationId: string,
    language: Language,
  ): Promise<void> {
    this.state = StoreState.pending;
    try {
      const response =
        await RecommendationsService.getRecommendationsWithoutAreaFilter(
          conversationId,
          language,
        );
      if (response.data && response.data.length > 0) {
        this.setRecommendations(response.data);
      }
      runInAction(() => {
        this.state = StoreState.done;
      });
    } catch (e) {
      runInAction(() => {
        this.state = StoreState.error;
      });
    }
  }

  get confidentRecommendations(): IRecommendation[] {
    return this.recommendations.filter(
      (r: IRecommendation) => r.score === undefined || r.score >= 0.0,
    );
  }

  /**
   * Check if recommendation with service matching to serviceId is currently in store.
   * @param serviceId   Id of the recommended service
   * @returns Recommendation if matching one is found or undefined is such recommendation isn't in store
   */
  findStoredRecommendation(serviceId: string): IRecommendation | undefined {
    return this.recommendations.find(
      (r: IRecommendation) => r.service.id === serviceId,
    );
  }

  setSelectedRecommendation = (rec: IRecommendation | undefined): void => {
    runInAction(() => {
      this.selectedRec = rec;
    });
  };

  loadRecommendation = async (
    serviceId: string,
    language: Language,
  ): Promise<void> => {
    try {
      this.state = StoreState.pending;
      const [serviceRequest, channelsRequest] = await Promise.all([
        RecommendationsService.getService(serviceId, language),
        RecommendationsService.getServiceChannels(serviceId, language),
      ]);
      if (serviceRequest.data && channelsRequest.data) {
        this.setSelectedRecommendation({
          service: serviceRequest.data,
          channels: channelsRequest.data,
        });
      }
      runInAction(() => {
        this.state = StoreState.done;
      });
    } catch (e) {
      runInAction(() => {
        this.state = StoreState.error;
      });
    }
  };
}

export default RecommendationStore;
