/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
  Typography,
  Box,
  useTheme,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import { channelTypes } from 'models/channel';
import { useIntl } from 'react-intl';
import { ThemeCheckbox } from '../forms/checkbox';

interface IChannelFilter {
  typeFrequencies: Record<string, number>;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterIsActive: (filter: string) => boolean;
}

export const ChannelFilter = ({
  typeFrequencies,
  handleFilterChange,
  filterIsActive,
}: IChannelFilter): EmotionJSX.Element => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box
      css={css`
        background-color: ${theme.palette.background.default};
        margin-top: 3.65rem;

        ${theme.breakpoints.down('sm')} {
          margin-top: 1rem;
        }

        padding: 1rem 1rem 0.75rem 1rem;
        text-transform: uppercase;
        border-radius: 0.75rem;

        .MuiFormControlLabel-label {
          font-weight: 400;

          &.Mui-disabled {
            color: rgba(0, 0, 0, 0.5);
          }
        }
      `}
    >
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Typography variant="h4" color="primary">
            {intl.formatMessage({
              id: 'ChannelFilterTitle',
              defaultMessage: 'Mitä etsit?',
              description:
                'Title for component that allows user to filter service channels by type',
            })}
          </Typography>
        </FormLabel>
        <FormGroup
          css={css`
            padding-left: 0.2rem;
          `}
        >
          {channelTypes.map((ct) => {
            const grouptitle = intl.formatMessage({
              id: `ChannelGroupTitle${ct}`,
              defaultMessage: ct,
            });
            const pieces = intl.formatMessage({
              id: `Pieces`,
              defaultMessage: 'kpl',
            });

            return (
              <FormControlLabel
                key={ct}
                control={
                  <ThemeCheckbox
                    checked={filterIsActive(ct)}
                    onChange={handleFilterChange}
                    disabled={typeFrequencies[ct] === 0 || false}
                    name={ct}
                  />
                }
                label={`${grouptitle} (${typeFrequencies[ct]} ${pieces})`}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </Box>
  );
};
