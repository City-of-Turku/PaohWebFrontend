/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  faMapMarkedAlt,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FC, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  formatAddressMultiline,
  generateMapsLocationLink,
  IFormmattedLocation,
  uniqueFormattedLocationAddresses,
} from '../../utils/channel-utils';
import { IChannel } from 'models/channel';
import { observer } from 'mobx-react-lite';
import { StyledLink } from 'components/link/link';
import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { IconList, ListItemWithIcon } from './channel-card';

interface IAddressList {
  channel: IChannel;
}

export const AddressList: FC<IAddressList> = observer(({ channel }) => {
  const intl = useIntl();
  const uniqueAddresses = uniqueFormattedLocationAddresses(
    channel.addresses,
    formatAddressMultiline,
  );

  if (uniqueAddresses.length == 0) return null;

  return (
    <div
      css={css`
        white-space: pre-line;

        p {
          line-height: 1.25rem;
        }
      `}
    >
      <Typography variant="subtitle1">
        {uniqueAddresses.length > 1
          ? intl.formatMessage({
              id: 'AddressListTitle',
              defaultMessage: 'Osoitteet',
            })
          : intl.formatMessage({
              id: 'AddressTitle',
              defaultMessage: 'Osoite',
            })}
      </Typography>
      <IconList>
        {uniqueAddresses.map((add: IFormmattedLocation) => (
          <Fragment key={add.address}>
            <ListItemWithIcon>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="list-icon" />
              <Typography variant="body1">{add.address}</Typography>
            </ListItemWithIcon>
            <MapLink address={add} />
          </Fragment>
        ))}
      </IconList>
    </div>
  );
});

const MapLink: FC<{ address: IFormmattedLocation }> = observer(
  ({ address }) => {
    const intl = useIntl();

    if (address.latitude && address.longitude) {
      return (
        <ListItemWithIcon>
          <FontAwesomeIcon icon={faMapMarkedAlt} className="list-icon" />
          <StyledLink
            url={generateMapsLocationLink(address.longitude, address.latitude)}
            external
            content={intl.formatMessage({
              id: 'ShowLocationOnMap',
              defaultMessage: 'Sijainti kartalla',
              description:
                "Text on a link that opens map service showing service's location",
            })}
          />
        </ListItemWithIcon>
      );
    }

    return null;
  },
);
