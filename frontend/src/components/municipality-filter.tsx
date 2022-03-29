/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, useEffect, useState } from 'react';
import {
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Theme,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import validMunicipalities from './municipalities.json';

const municipalities: Record<string, string> = validMunicipalities;

export const MunicipalityFilter: FC = observer(() => {
  const theme = useTheme();
  const intl = useIntl();
  const settingsStore = useStore('settingsStore');
  const recommendationsStore = useStore('recommendationsStore');
  const { selectedMunicipality } = recommendationsStore;
  const { chatSessionId } = settingsStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterInUrl, setFilterInUrl] = useState(false);

  useEffect(() => {
    const municipalityInUrl: string | null = searchParams.get('municipality');
    if (municipalityInUrl) {
      const validatedMunicipality: string | undefined =
        municipalities[municipalityInUrl.toLowerCase()];

      if (validatedMunicipality) {
        recommendationsStore.selectedMunicipality = validatedMunicipality;
        setFilterInUrl(true);
      } else {
        searchParams.delete('municipality');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, recommendationsStore, setSearchParams]);

  const resetMunicipalityFilter = () => {
    recommendationsStore.selectedMunicipality = null;
    if (chatSessionId) {
      searchParams.delete('municipality');
      setSearchParams(searchParams);
      recommendationsStore.resetAreaFilter(
        settingsStore.chatSessionId,
        settingsStore.selectedLanguage,
      );
    }
  };

  // If no services are shown, municipality filter is not displayed - except if it
  // was set via url parameters
  if (
    recommendationsStore.confidentRecommendations.length === 0 &&
    !filterInUrl
  ) {
    return null;
  }

  if (selectedMunicipality === null) {
    return (
      <FilterContainer theme={theme}>
        <Typography
          variant="body2"
          component="span"
          color="textPrimary"
          css={css`
            && {
              line-height: 1.1rem;
              padding: 0;
              margin: 0;
              display: inline;
            }
          `}
        >
          {intl.formatMessage({
            id: 'AreaFilterNotSet',
            defaultMessage:
              'Ei valittuna sijaintia, näytetään koko maakunnan palvelut',
          })}
        </Typography>
      </FilterContainer>
    );
  }

  return (
    <FilterContainer theme={theme}>
      <Typography
        variant="body2"
        component="span"
        color="textPrimary"
        css={css`
          && {
            line-height: 1.1rem;
            padding: 0;
            margin: 0;
            display: inline;
          }
        `}
      >
        {intl.formatMessage({
          id: recommendationsStore.wholeRegionSelected
            ? 'AreaFilterSetToRegion'
            : 'AreaFilterSetToMunicipality',
          defaultMessage: 'Palveluita alueelta',
        })}
      </Typography>
      <Tooltip
        title={intl.formatMessage({
          id: recommendationsStore.wholeRegionSelected
            ? 'AreaFilterResetRegion'
            : 'AreaFilterResetMunicipality',
          defaultMessage: 'Poista aluerajaus',
        })}
        arrow
        css={css`
          && {
            font-size: ${theme.typography.body1.fontSize};
          }
        `}
      >
        <IconButton
          onClick={resetMunicipalityFilter}
          aria-label={'reset municipality'}
          css={css`
            && {
              margin-left: 0.5rem;
              font-size: 0.8rem;
              padding: ${theme.spacing(0.25)}px ${theme.spacing(0.75)}px;
              border: 1px solid ${theme.palette.text.primary};
              background-color: ${theme.palette.secondary.dark};
              border-radius: 11px;
              display: flex;
              flex-direction: row;
              align-items: center;

              &:hover,
              &:focus {
                background-color: ${theme.palette.secondary.dark};
              }

              .fontawesome-icon {
                color: ${theme.palette.text.primary};
                height: 1.2rem;
                width: 1.2rem;
                margin-left: ${theme.spacing(0.25)}px;
              }
            }
          `}
        >
          <Typography variant="body2" color="textPrimary" component="span">
            {intl.formatMessage({
              id: recommendationsStore.wholeRegionSelected
                ? 'RegionSouthwestFinland'
                : selectedMunicipality,
              defaultMessage: selectedMunicipality,
            })}
          </Typography>
          <FontAwesomeIcon
            icon={faTimes}
            fontSize={'4rem'}
            className="fontawesome-icon"
          />
        </IconButton>
      </Tooltip>
    </FilterContainer>
  );
});

const FilterContainer = styled.div(
  ({ theme }: { theme: Theme }) => `
  background-color: ${theme.palette.bg.main};
  border-radius: 11px;
  height: auto;
  box-sizing: border-box;
  position: relative;
  padding-top: ${theme.spacing(0.5)}px;
  padding-bottom: ${theme.spacing(0.5)}px;
  margin-right: ${theme.spacing(1)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  height: ${theme.spacing(5)}px;

  ${theme.breakpoints.down('sm')} {
    margin-bottom: ${theme.spacing(1)}px;
    padding-top: ${theme.spacing(0.75)}px;
    padding-bottom: ${theme.spacing(0.75)}px;
    padding-left: 10px;
    margin-left: 0;
    margin-right: 0;
  }
`,
);
