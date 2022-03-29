/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, useTheme } from '@material-ui/core';
import { StyledLink } from '../link/link';
import { IService } from 'models/service';
import { useIntl } from 'react-intl';
import {
  getLocationSubheader,
  getOrganizationName,
} from '../../utils/service-utils';

interface IServiceName {
  service: IService;
  autoTranslate: boolean;
  nameIsLink?: boolean; // Whether name will link to the service itself
}

export const ServiceName: FC<IServiceName> = observer(
  ({ service, autoTranslate, nameIsLink = false }) => {
    const theme = useTheme();
    const intl = useIntl();

    const displayName = autoTranslate
      ? service.name.value
      : service.name.original || service.name.value;

    const displayLang = autoTranslate
      ? service.name.language
      : service.name.originalLanguage || undefined;

    return (
      <div
        css={css`
          .organization-name {
            font-weight: 300;
            font-size: 0.9rem;
            line-height: 1.25;
          }

          .service-area {
            line-height: 1.25;
            text-transform: uppercase;
            color: ${theme.palette.text.primary};
            font-size: 0.9rem;
            font-weight: 400;
          }

          .service-name {
            word-break: break-word;
          }
        `}
      >
        <Typography
          variant="body1"
          component="h3"
          className="organization-name"
        >
          {getOrganizationName(service.organizations)}
        </Typography>
        <Typography
          className="service-name"
          variant="h1"
          component="h2"
          lang={displayLang}
        >
          {nameIsLink ? (
            <StyledLink url={service.id} content={displayName} />
          ) : (
            displayName
          )}
        </Typography>
        <Typography variant="body1" component="h3" className="service-area">
          {getLocationSubheader(
            service.areas,
            intl.formatMessage({
              id: 'RelatedMunicipalitiesCount',
              defaultMessage: 'kuntaa',
            }),
          )}
        </Typography>
      </div>
    );
  },
);
