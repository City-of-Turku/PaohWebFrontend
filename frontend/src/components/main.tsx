/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useEffect } from 'react';
import { Grid, Hidden, useTheme, GridSpacing } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store-hooks';
import { ChatWidget } from './chat-widget';
import { RecommendationsPanel } from './recommendations/recommendations-panel';
import { MunicipalityFilter } from './municipality-filter';

export const Main: FC = observer(() => {
  const recommendationsStore = useStore('recommendationsStore');
  const settingsStore = useStore('settingsStore');
  const { selectedLanguage } = settingsStore;

  const updateRecommendations = (sessionId: string) => {
    recommendationsStore.loadRecommendations(
      sessionId,
      selectedLanguage,
      recommendationsStore.selectedMunicipality,
    );
  };

  useEffect(() => {
    if (settingsStore.chatSessionId) {
      recommendationsStore.loadRecommendations(
        settingsStore.chatSessionId,
        selectedLanguage,
        recommendationsStore.selectedMunicipality,
      );
    }
  }, [selectedLanguage, recommendationsStore, settingsStore.chatSessionId]);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.only('md'));

  const getSpacing = (smallOrLess: boolean, medium: boolean): GridSpacing => {
    if (smallOrLess) return 0;
    if (medium) return 2;
    return 3;
  };

  return (
    <Grid
      container
      spacing={getSpacing(isSmall, isMedium)}
      direction="row"
      alignItems="stretch"
      css={css`
        && {
          margin-top: 0;
          height: inherit;
        }
      `}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={7}
        lg={7}
        xl={8}
        css={css`
          && {
            max-height: 100%;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            height: 100%;
            max-height: 100%;
            flex-flow: column;
          `}
        >
          {isSmall && recommendationsStore.isMunicipalityFilterSet && (
            <MunicipalityFilter />
          )}
          <ChatWidget onNewMessage={updateRecommendations} />
        </div>
      </Grid>
      <Hidden smDown>
        <Grid
          item
          md={5}
          lg={5}
          xl={4}
          css={css`
            && {
              height: 100%;
            }
          `}
        >
          <RecommendationsPanel
            recommendations={recommendationsStore.confidentRecommendations}
          >
            {!isSmall && <MunicipalityFilter />}
          </RecommendationsPanel>
        </Grid>
      </Hidden>
    </Grid>
  );
});
