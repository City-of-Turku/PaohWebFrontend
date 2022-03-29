/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { FC } from 'react';
import { Box, useTheme, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { IRecommendation } from '../../models/recommendation';
import { RecommendationsList } from './recommendations-list';
import { useIntl } from 'react-intl';

interface IRecommendationsPanel {
  recommendations: IRecommendation[];
  children?: React.ReactNode;
}

export const RecommendationsPanel: FC<IRecommendationsPanel> = observer(
  ({ recommendations, children }) => {
    const theme = useTheme();
    const intl = useIntl();

    return (
      <Box
        css={css`
          height: 100%;
          position: relative;
          overflow-y: hidden;
          display: flex;
          flex-direction: column;
          background-color: white;
          padding: ${theme.spacing(2)}px;
          padding-right: ${theme.spacing(1)}px;
          border-radius: 0.75rem;
        `}
      >
        <Typography variant="h2">
          {intl.formatMessage({
            id: 'RecommendationsPanelTitle',
            defaultMessage: 'Palvelusuosituksia',
            description:
              'Title for a side panel where recommendations are displayed',
          })}
        </Typography>
        {children}
        <RecommendationsList recommendations={recommendations} />
      </Box>
    );
  },
);
