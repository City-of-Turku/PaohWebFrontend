/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Box, Grid, useTheme } from '@material-ui/core';
import {
  IChannel,
  ChannelType,
  channelTypes,
  isChannelType,
} from 'models/channel';
import { useIntl } from 'react-intl';
import { ChannelCard } from './channel-card';
import { ChannelFilter } from './channel-filter';
import { useSearchParams } from 'react-router-dom';

interface IChannelList {
  channels: IChannel[];
}

interface IChannelGroup {
  group: ChannelType;
  channels: IChannel[];
}

export const PageChannelList: FC<IChannelList> = observer(({ channels }) => {
  const theme = useTheme();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Set filters via search params
  useEffect(() => {
    const getFiltersFromUrl = () => {
      const urlFilters = searchParams.getAll('ct');
      const frequencies = channelTypeFrequencies(channels);
      const validFilters = urlFilters.filter(
        (val) => isChannelType(val) && frequencies[val] && frequencies[val] > 0,
      );
      setActiveFilters([...activeFilters, ...validFilters]);
      // Delete search params as those are only used when directing to page and not updated afterwards
      // -> having inconsistencies in them does not look great
      setSearchParams([]);
    };

    getFiltersFromUrl();
  }, []);

  const channelTypeFrequencies = (chs: IChannel[]) => {
    const counts: Record<string, number> = {};

    for (const type of channelTypes) {
      counts[type] = 0;
    }

    for (const ch of chs) {
      counts[ch.type] = counts[ch.type] + 1;
    }

    return counts;
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setActiveFilters([...activeFilters, event.target.name]);
    } else {
      setActiveFilters(activeFilters.filter((s) => s !== event.target.name));
    }
  };

  const filterIsActive = (filter: string): boolean => {
    return activeFilters.indexOf(filter) !== -1;
  };

  return (
    <div
      css={css`
        margin-top: 3rem;

        ${theme.breakpoints.down('sm')} {
          margin-top: 2rem;
        }
      `}
    >
      <Typography variant="h2">Asiointikanavat</Typography>
      <Grid container direction="row-reverse" spacing={2}>
        {/* Filtering */}
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ChannelFilter
            typeFrequencies={channelTypeFrequencies(channels)}
            handleFilterChange={handleFilterChange}
            filterIsActive={filterIsActive}
          />
        </Grid>
        {/* Service channel list */}
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Box
            css={css`
              > div {
                padding-bottom: 0.5rem;
              }

              > div:last-of-type {
                padding-bottom: 1rem;
              }
            `}
          >
            {channelTypes.map((type) => {
              if (
                activeFilters.length === 0 ||
                activeFilters.indexOf(type) !== -1
              )
                return (
                  <ChannelGroup key={type} group={type} channels={channels} />
                );
            })}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
});

export const ChannelGroup: FC<IChannelGroup> = observer(
  ({ group, channels }) => {
    const intl = useIntl();

    const channelsByType = channels.filter((c) => c.type === group);

    // Don't render a section if there are no channels of this type
    if (!channels || channelsByType.length == 0) {
      return null;
    }

    return (
      <Box
        css={css`
          && {
            .title-channel-group {
              font-size: 1.125rem;
              text-transform: uppercase;
              margin-top: 1rem;
            }
          }
        `}
      >
        <Typography variant="h3" className="title-channel-group">
          {intl.formatMessage({
            id: `ChannelGroupTitle${group}`,
            defaultMessage: group,
          })}
          {` (${channelsByType.length} ${intl.formatMessage({
            id: 'Pieces',
            defaultMessage: group,
          })})`}
        </Typography>
        <div>
          {channelsByType.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      </Box>
    );
  },
);
