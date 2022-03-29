/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import {
  CircularProgress,
  Typography,
  Container,
  useTheme,
} from '@material-ui/core';
import { FC, useEffect, Fragment, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useStore } from 'stores/store-hooks';
import { StoreState } from 'stores/store-state';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { getDescription } from '../../utils/service-utils';
import { PageChannelList } from './page-channel-list';
import { Helmet } from 'react-helmet';
import { ScrollToButton } from '../buttons/scroll-to-button';
import { IDescription } from 'models/service';
import { ServiceName, ServiceDescriptionBox } from 'components/service-atoms';
import { OnOffButton } from 'components/buttons/on-off-button';

export const ServicePage: FC = observer(() => {
  const theme = useTheme();
  const intl = useIntl();
  const settingsStore = useStore('settingsStore');
  const { selectedLanguage } = settingsStore;
  const recommendationsStore = useStore('recommendationsStore');
  const { selectedRec } = recommendationsStore;
  const { id } = useParams();
  const [autoTranslate, setAutoTranslate] = useState(true);
  const pageEndRef = useRef(null);

  useEffect(() => {
    const loadServiceData = async () => {
      if (id) {
        // Sets selectedRec to the loaded value
        await recommendationsStore.loadRecommendation(id, selectedLanguage);
      }
    };
    loadServiceData();
  }, [id, selectedLanguage, recommendationsStore]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleAutoTranslate = (buttonId: string) => {
    setAutoTranslate((prevState) => !prevState);
  };

  if (recommendationsStore.state === StoreState.error) {
    return (
      <LoadingRoot>
        <Typography variant="h1">
          {intl.formatMessage({
            id: 'PageNotFoundErrorTitle',
            defaultMessage: 'Sivua ei löytynyt',
            description: 'Title of page not found (404) error',
          })}
        </Typography>
        <Typography
          variant="body1"
          css={css`
            && {
              margin-top: ${theme.spacing(3)}px;
              text-align: center;
            }
          `}
        >
          {intl.formatMessage({
            id: 'PageNotFoundErrorExplanation',
            defaultMessage:
              'Etsimääsi sivua ei valitettavasti löytynyt. Tätä sivua ei ole suomeksi tai sivun osoite on muuttunut. Tarkistathan, että kirjoittamasi osoite on oikein.',
            description:
              'Longer explanation to be shown when page not found error is encountared',
          })}
        </Typography>
      </LoadingRoot>
    );
  }

  if (
    recommendationsStore.state === StoreState.pending ||
    selectedRec === undefined
  ) {
    return (
      <LoadingRoot>
        <CircularProgress size={50} />
      </LoadingRoot>
    );
  }

  const description: IDescription | undefined = getDescription(
    selectedRec.service.descriptions,
  );

  const hasAutoTranslatedContent =
    description?.autoTranslated || selectedRec.service.name.autoTranslated;

  return (
    <Fragment>
      <Helmet>
        <title>{selectedRec.service.name.value}</title>
        <meta
          property="og:title"
          content={`${selectedRec.service.name.value} | Palveluohjain`}
        />
      </Helmet>
      <Container
        maxWidth="lg"
        css={css`
          padding: 0;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: baseline;
            align-items: center;
            justify-content: space-between;

            .service-name {
              line-height: 1.1;
            }
          `}
        >
          <ServiceName
            service={selectedRec.service}
            autoTranslate={autoTranslate}
            nameIsLink={false}
          />
          {hasAutoTranslatedContent && (
            <OnOffButton
              id="translation-toggle"
              on={autoTranslate}
              onClick={toggleAutoTranslate}
              icon={faLanguage}
              showTooltip
              offTooltipTextId={'AutomaticTranslationIsOff'}
              onTooltipTextId={'AutomaticTranslationIsOn'}
            />
          )}
        </div>
        <ServiceDescriptionBox
          description={description}
          autoTranslate={autoTranslate}
        />
        {selectedRec.channels.length > 0 && (
          <PageChannelList channels={selectedRec.channels} />
        )}
        <PageBottom ref={pageEndRef} />
      </Container>
      <ScrollToButton
        bottomRef={pageEndRef}
        autoSwitchDirections={false}
        showText={true}
        scrollUpText={intl.formatMessage({
          id: 'PageScrollToTop',
          defaultMessage: 'Palaa ylös',
          description:
            'Text shown alongside button that auto-scroll back to top of the page',
        })}
      />
    </Fragment>
  );
});

const PageBottom = styled.div``;

const LoadingRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  max-width: 90%;
  margin: 0 auto;
`;
