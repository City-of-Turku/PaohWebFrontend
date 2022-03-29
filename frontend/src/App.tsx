import React, { FC } from 'react';
import { theme } from 'theme/theme';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { StoresProvider, stores } from './stores/stores';
import { useStore } from 'stores/store-hooks';
import { IntlProvider, useIntl } from 'react-intl';
import { getLocale, getTranslations } from 'translations/locales';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Layout } from 'components/layout';
import { Main } from 'components/main';
import { ServicePage } from 'components/service-page/service-page';
import DocumentationPage from 'components/info/developers';
import { AccessibilityStatementPage } from 'components/info/accessibility';
import PrivacyPolicyPage from 'components/info/privacy';
import { ReleasesPage } from 'components/info/releases';

const App: FC = observer(() => {
  const settingsStore = useStore('settingsStore');
  const { selectedLanguage } = settingsStore;

  return (
    <IntlProvider
      locale={selectedLanguage}
      messages={getTranslations(selectedLanguage)}
      onError={(err) => {
        if (
          err.code === 'MISSING_TRANSLATION' &&
          process.env.NODE_ENV === 'development'
        ) {
          console.warn('Missing translation', err.message);
          return;
        }
        throw err;
      }}
    >
      <MuiThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>
          <StoresProvider value={stores}>
            <WebsiteHead />
            <BrowserRouter>
              <Routes>
                <Route path="/fi" element={<Layout lang={'fi'} />}>
                  <Route index element={<Main />} />
                  <Route path="kehittajille" element={<DocumentationPage />} />
                  <Route path="tietosuoja" element={<PrivacyPolicyPage />} />
                  <Route path="julkaisut" element={<ReleasesPage />} />
                  <Route
                    path="saavutettavuus"
                    element={<AccessibilityStatementPage />}
                  />
                  <Route path=":id" element={<ServicePage />} />
                </Route>
                <Route path="/en" element={<Layout lang={'en'} />}>
                  <Route index element={<Main />} />
                  <Route path="kehittajille" element={<DocumentationPage />} />
                  <Route path="tietosuoja" element={<PrivacyPolicyPage />} />
                  <Route path="julkaisut" element={<ReleasesPage />} />
                  <Route
                    path="saavutettavuus"
                    element={<AccessibilityStatementPage />}
                  />
                  <Route path=":id" element={<ServicePage />} />
                </Route>
                <Route path="/sv" element={<Layout lang={'sv'} />}>
                  <Route index element={<Main />} />
                  <Route path="kehittajille" element={<DocumentationPage />} />
                  <Route path="tietosuoja" element={<PrivacyPolicyPage />} />
                  <Route path="julkaisut" element={<ReleasesPage />} />
                  <Route
                    path="saavutettavuus"
                    element={<AccessibilityStatementPage />}
                  />
                  <Route path=":id" element={<ServicePage />} />
                </Route>
                <Route
                  path="/julkaisut"
                  element={
                    <NavigateWithQuery
                      to={`/${settingsStore.selectedLanguage}/julkaisut`}
                    />
                  }
                />
                <Route
                  path="/kehittajille"
                  element={
                    <NavigateWithQuery
                      to={`/${settingsStore.selectedLanguage}/kehittajille`}
                    />
                  }
                />
                <Route
                  path="/tietosuoja"
                  element={
                    <NavigateWithQuery
                      to={`/${settingsStore.selectedLanguage}/tietosuoja`}
                    />
                  }
                />
                <Route
                  path="/saavutettavuus"
                  element={
                    <NavigateWithQuery
                      to={`/${settingsStore.selectedLanguage}/saavutettavuus`}
                    />
                  }
                />
                <Route
                  path=":id"
                  element={<Layout lang={settingsStore.selectedLanguage} />}
                />
                <Route
                  path="*"
                  element={
                    <NavigateWithQuery
                      // Preserve query params while redirecting to saved or default language
                      to={`/${settingsStore.selectedLanguage}`}
                    />
                  }
                />
              </Routes>
            </BrowserRouter>
          </StoresProvider>
        </EmotionThemeProvider>
      </MuiThemeProvider>
    </IntlProvider>
  );
});

const NavigateWithQuery = ({ to }: { to: string }) => {
  const { search } = useLocation();
  return <Navigate to={to + search} />;
};

const WebsiteHead = observer(() => {
  const settingsStore = useStore('settingsStore');
  const { selectedLanguage } = settingsStore;
  const intl = useIntl();

  return (
    <Helmet defaultTitle="Palveluohjain" titleTemplate="%s | Palveluohjain">
      <html lang={selectedLanguage} />
      <meta property="og:locale" content={getLocale(selectedLanguage)} />
      <meta
        name="twitter:image"
        content={`${window.location.origin}/palveluohjain-preview-square.png`}
      />

      {/* Localize page descriptions */}
      <meta
        property="description"
        content={intl.formatMessage({
          id: 'WebsiteDescription',
          defaultMessage: 'Varsinais-Suomen palvelubotti',
          description: 'Website description',
        })}
      />
      <meta
        property="og:description"
        content={intl.formatMessage({
          id: 'WebsiteDescription',
          defaultMessage: 'Varsinais-Suomen palvelubotti',
          description:
            'Description shown in previews when link to the website is shared for example on social media',
        })}
      />
      <meta
        property="twitter:description"
        content={intl.formatMessage({
          id: 'WebsiteDescription',
          defaultMessage: 'Varsinais-Suomen palvelubotti',
          description: 'Description shown on link previews on Twitter',
        })}
      />
    </Helmet>
  );
});

export default App;
