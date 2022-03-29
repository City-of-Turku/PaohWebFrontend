/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useState, useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import releaseNotes from './release-notes.md';

export const ReleasesPage: FC = () => {
  const intl = useIntl();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(releaseNotes)
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <Container
      maxWidth="lg"
      css={css`
        p + h2,
        ul + h2 {
          margin-top: 2.5rem;
        }

        h1 + h2 {
          // h2 titles coming immediately after h1
          margin-block-start: 0.75rem;
        }

        h3 {
          margin-block-end: 0.35rem;
        }

        h3 + ul,
        p + ul {
          margin-block-start: 0;
        }

        p {
          margin-block-start: 0.25rem;
          margin-block-end: 0.25rem;
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
          id: 'PageTitleReleaseNotes',
          defaultMessage: 'Julkaisut',
          description:
            'Title of the page describing changes in each service release',
        })}
      </Typography>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Container>
  );
};
