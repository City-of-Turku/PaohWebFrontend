/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Box } from '@material-ui/core';
import { ChannelType, channelTypes, IChannel } from 'models/channel';
import { useIntl } from 'react-intl';
import { ServiceChannel } from './service-channel';
import { StyledLink } from '../link/link';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const MAX_CHANNELS_TO_SHOW = 3;
interface IServiceChannelList {
  serviceId: string;
  channels: IChannel[];
}

interface IServiceChannelGroup {
  serviceId: string;
  group: ChannelType;
  channels: IChannel[];
}

export const ServiceChannelList: FC<IServiceChannelList> = observer(
  ({ serviceId, channels }) => {
    return (
      <Box
        css={css`
          > div {
            padding-bottom: 0.5rem;
          }

          > div:last-of-type {
            padding-bottom: 0;
          }
        `}
      >
        {channelTypes.map((ct: ChannelType) => (
          <ServiceChannelGroup
            key={ct}
            group={ct}
            channels={channels}
            serviceId={serviceId}
          />
        ))}
      </Box>
    );
  },
);

export const ServiceChannelGroup: FC<IServiceChannelGroup> = observer(
  ({ group, channels, serviceId }) => {
    const intl = useIntl();
    const channelsByType: IChannel[] = channels.filter((c) => c.type === group);

    // Don't render a section if there are no channels of this type
    if (!channels || channelsByType.length === 0) {
      return null;
    }

    return (
      <Box
        css={css`
          && {
            &:last-of-type {
              padding-bottom: 1rem;
            }

            ul {
              margin-top: 0rem;
              list-style: none;
              padding-inline-start: 0;
              margin-block-end: 0;
            }

            h6 {
              margin-top: 0.75rem;
              text-transform: uppercase;
              margin-bottom: 0.25rem;
            }

            .channel-address {
              margin-left: 1.5rem;
            }

            li.service-location {
              padding-bottom: 1.2rem;

              p {
                line-height: inherit;
              }
            }

            li.service-location:last-of-type {
              padding-bottom: 0.5rem;
            }
          }
        `}
      >
        <Typography variant="h6">
          {intl.formatMessage({
            id: `ChannelGroupTitle${group}`,
            defaultMessage: group,
          })}
          {` (${channelsByType.length} ${intl.formatMessage({
            id: 'Pieces',
            defaultMessage: group,
          })})`}
        </Typography>
        <ul>
          {channelsByType.slice(0, MAX_CHANNELS_TO_SHOW).map((c) => (
            <ServiceChannel key={c.id} channel={c} type={group} />
          ))}
          {channelsByType.length > MAX_CHANNELS_TO_SHOW && (
            <StyledLink
              url={`${serviceId}?ct=${group}`}
              content={intl.formatMessage({
                id: `ShowAll${group}`,
                defaultMessage: 'Näytä kaikki',
              })}
              iconBefore={faArrowRight}
              css={css`
                font-weight: 700;
                margin: 0.5rem;
                margin-left: 1.5rem;
              `}
            />
          )}
        </ul>
      </Box>
    );
  },
);
