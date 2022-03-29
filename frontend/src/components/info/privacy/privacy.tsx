/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useStore } from 'stores/store-hooks';
import { useIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';

import privacyPolicy from './privacy-policy.md';
import privacyPolicySV from './privacy-policy-sv.md';
import privacyPolicyEN from './privacy-policy-en.md';
import { StyledLink } from 'components/link/link';
import { Language } from 'types';

export const PrivacyPolicyPage: FC = observer(() => {
  const [markdown, setMarkdown] = useState('');
  const settingsStore = useStore('settingsStore');
  const { selectedLanguage } = settingsStore;
  const intl = useIntl();

  useEffect(() => {
    const getPolicyToFetch = (lang: Language) => {
      switch (lang) {
        case 'sv':
          return privacyPolicySV;
        case 'en':
          return privacyPolicyEN;
        default:
          return privacyPolicy;
      }
    };

    fetch(getPolicyToFetch(selectedLanguage))
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, [selectedLanguage]);

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h1"
        color="primary"
        css={css`
          && {
            word-break: break-word;
          }
        `}
      >
        {intl.formatMessage({
          id: 'PageTitlePrivacyPolicy',
          defaultMessage: 'Tietosuojaseloste',
          description: 'Title of the page describing privacy policy',
        })}
      </Typography>
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <Typography
        variant="h4"
        component="h2"
        css={css`
          margin-top: 1.25rem;
        `}
      >
        {intl.formatMessage({
          id: 'PrivacyContactTitle',
          defaultMessage: 'Yhteydenotot tietosuoja-asioissa:',
          description:
            'Title for contact information on privacy policy officer or other relevant contact on privacy issues.',
        })}
      </Typography>
      <address
        css={css`
          font-style: normal;
        `}
      >
        <StyledLink
          external
          url="mailto:tietosuoja@turku.fi"
          content="tietosuoja@turku.fi"
        />
        <Typography
          variant="body1"
          css={css`
            margin-top: 0.25rem;
            line-height: 1.25;
          `}
        >
          Konsernihallinto/tietosuojavastaava
          <br /> PL 355, 20101 Turku
        </Typography>
      </address>
    </Container>
  );
});
