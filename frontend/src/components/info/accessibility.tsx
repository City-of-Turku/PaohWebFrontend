/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import accessibilityStatement from './accessibility-statement.md';

export const AccessibilityStatementPage: FC = () => {
  const [markdown, setMarkdown] = useState('');
  const intl = useIntl();

  useEffect(() => {
    fetch(accessibilityStatement)
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <Container
      maxWidth="lg"
      css={css`
        address {
          font-style: normal;
          margin-left: 1rem;
        }
      `}
    >
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
          id: 'PageTitleAccessibilityStatement',
          defaultMessage: 'Saavutettavuusseloste',
        })}
      </Typography>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
    </Container>
  );
};
