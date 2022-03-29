/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Box } from '@material-ui/core';
import { IChannel, IChannelUrl, ChannelType } from 'models/channel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faFileAlt,
  faGlobe,
  faMapMarkedAlt,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import {
  formatAddressOneliner,
  formatPhoneNumber,
  generateMapsLocationLink,
  uniqueFormattedLocationAddresses,
  IFormmattedLocation,
} from '../../utils/channel-utils';
import { StyledLink } from '../link/link';
import { useIntl } from 'react-intl';

interface IServiceChannel {
  channel: IChannel;
  type: ChannelType;
}

export const ServiceChannel: FC<IServiceChannel> = observer(
  ({ channel, type }) => {
    if (type === 'EChannel' || type === 'WebPage') {
      if (channel.webPages.length === 0) {
        return null;
      } else {
        return (
          <li>
            <StyledLink
              url={channel.webPages[0]}
              external
              content={channel.name}
              iconBefore={faGlobe}
              iconAfter={faExternalLinkAlt}
            />
          </li>
        );
      }
    }

    if (type === 'Phone') {
      if (channel.phoneNumbers.length > 0) {
        return (
          <li>
            <StyledLink
              url={`tel:${formatPhoneNumber(channel.phoneNumbers[0])}`}
              external
              content={formatPhoneNumber(channel.phoneNumbers[0])}
              iconBefore={faPhone}
            />{' '}
            {channel.name}
          </li>
        );
      } else {
        return null;
      }
    }

    if (type === 'PrintableForm') {
      if (channel.channelUrls.length > 0) {
        return (
          <Fragment>
            {channel.channelUrls.map((form: IChannelUrl) => (
              <li key={form.url}>
                <StyledLink
                  external
                  url={form.url}
                  content={`${channel.name} (${form.type})`}
                  iconBefore={faFileAlt}
                />
              </li>
            ))}
          </Fragment>
        );
      }
      return null;
    }

    if (type === 'ServiceLocation') {
      return (
        <li
          className="service-location"
          css={css`
            .service-location-name {
              font-weight: 600;
            }
          `}
        >
          <ServiceLocationName channel={channel} />
          <LocationAddress channel={channel} />
        </li>
      );
    }

    return null;
  },
);

const LocationAddress: FC<{ channel: IChannel }> = observer(({ channel }) => {
  const intl = useIntl();

  if (channel.addresses.length == 0) return null;
  const addresses = uniqueFormattedLocationAddresses(
    channel.addresses,
    formatAddressOneliner,
  );

  if (addresses.length == 0) return null;

  return (
    <Fragment>
      {addresses.map((add: IFormmattedLocation) => (
        <Box key={add.address} className="channel-address">
          <Typography variant="body1">{add.address}</Typography>
          {add.latitude && add.longitude && (
            <StyledLink
              url={generateMapsLocationLink(add.longitude, add.latitude)}
              external
              content={intl.formatMessage({
                id: 'ShowLocationOnMap',
                defaultMessage: 'Sijainti kartalla',
                description:
                  "Text on a link that opens map service showing service's location",
              })}
              iconBefore={faMapMarkedAlt}
            />
          )}
        </Box>
      ))}
    </Fragment>
  );
});

/**
 * Format name of a service as a link if such information is available.
 * Otherwise return just a typography element
 * @param ch  Service channel
 * @returns
 */
const ServiceLocationName: FC<{ channel: IChannel }> = observer(
  ({ channel }) => {
    if (channel.webPages.length > 0) {
      return (
        <StyledLink
          className="service-location-name"
          external
          url={channel.webPages[0]}
          content={channel.name}
          iconBefore={faMapMarkerAlt}
          css={{ fontWeight: 700 }}
        />
      );
    }

    return (
      <div
        css={css`
          display: inline-flex;
          align-items: center;

          .fontawesome-icon {
            margin-right: 0.5rem;
            height: 1rem;
            width: 1rem;
          }
        `}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} className="fontawesome-icon" />
        <Typography className="service-location-name" variant="body1">
          {channel.name}
        </Typography>
      </div>
    );
  },
);
