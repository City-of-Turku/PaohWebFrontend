/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, Fragment, useRef } from 'react';
import { CircularProgress, Typography, useTheme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { IRecommendation } from 'models/recommendation';
import { ServiceCard } from '../service-card/service-card';
import { useStore } from 'stores/store-hooks';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import { StoreState } from 'stores/store-state';
import { ScrollToButton } from '../buttons/scroll-to-button';

interface IRecommendationsList {
  recommendations: IRecommendation[];
}

export const RecommendationsList: FC<IRecommendationsList> = observer(
  ({ recommendations }) => {
    const intl = useIntl();
    const theme = useTheme();
    const recommendationsStore = useStore('recommendationsStore');

    const scrollRef = useRef(null);
    const bottomRef = useRef(null);

    if (recommendationsStore.state == StoreState.pending) {
      return (
        <LoadingRoot>
          <CircularProgress size={50} />
        </LoadingRoot>
      );
    }

    return (
      <Fragment>
        {/* Display error message at the top of the recommendations card list  */}
        {recommendationsStore.state == StoreState.error && (
          <Typography
            variant="body1"
            css={css`
              && {
                font-weight: 500;
                color: ${theme.palette.error.dark};
                background-color: ${theme.palette.secondary.main};
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
                text-align: center;
                margin-top: ${theme.spacing(1)}px;
                margin-bottom: ${theme.spacing(1)}px;
              }
            `}
          >
            {intl.formatMessage({
              id: 'ErrorInRecommendationRetrieval',
              defaultMessage:
                'Valitettavasti suositusten hakeminen epäonnistui.',
              description:
                'An explanation to be shown in the recommendations panel if retrieving recommendations from the server failed, for example because connection to the server failed',
            })}
          </Typography>
        )}
        <div
          ref={scrollRef}
          css={css`
            position: relative;
            margin-top: ${theme.spacing(1)}px;
            height: 100%;
            padding-right: ${theme.spacing(1)}px;
            overflow-y: auto;
            > .MuiCard-root {
              margin-bottom: ${theme.spacing(2)}px;
            }

            > div:nth-last-of-type(2) {
              // Last child is the bottom target element
              margin-bottom: ${theme.spacing(0)}px;
            }
          `}
        >
          <div />
          {recommendations.length > 0 ? (
            recommendations.map((rec: IRecommendation) => (
              <ServiceCard
                key={rec.service.id}
                service={rec.service}
                channels={rec.channels}
              />
            ))
          ) : (
            <Typography variant="body1">
              {intl.formatMessage({
                id: 'RecommendationsListEmptyGuidance',
                defaultMessage:
                  'Kerro jotain tilanteestasi saadaksesi suosituksia.',
                description: 'Guidance shown in empty recommendations panel',
              })}
            </Typography>
          )}
          <BottomTarget ref={bottomRef} />
        </div>
        {recommendations.length > 0 && (
          <ScrollToButton
            scrollRef={scrollRef}
            bottomRef={bottomRef}
            autoSwitchDirections={true}
            showText={false}
            bottomMargin={'100px'}
            rightMargin={'3rem'}
          />
        )}
      </Fragment>
    );
  },
);

const BottomTarget = styled.div``;

const LoadingRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
