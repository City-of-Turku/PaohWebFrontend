/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Typography, useTheme, Theme } from '@material-ui/core';
import { IChannel } from 'models/channel';
import { StyledLink } from 'components/link/link';
import {
  uniqueFormattedPhoneNumbers,
  getChannelDescription,
} from '../../utils/channel-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faLaptop,
  faAt,
  faGlobe,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { AddressList } from './address-list';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

const isChildNull = (children: EmotionJSX.Element | null) => {
  return children === null || Boolean(children.type === null);
};
interface IChannelCard {
  channel: IChannel;
}

export const ChannelCard: FC<IChannelCard> = observer(({ channel }) => {
  const theme = useTheme();
  const intl = useIntl();
  const sidePanel = SidePanelContentByType({ channel: channel });
  const websiteList =
    channel.type !== 'EChannel' && channel.type !== 'WebPage'
      ? WebsiteList({ channel: channel })
      : null;

  return (
    <ChannelCardContainer theme={theme}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} className="title-container">
          <Typography variant="h4" className="channel-title">
            {channel.name}
          </Typography>
          <Typography variant="body1" className="channel-type">
            {intl.formatMessage({
              id: `ChannelType${channel.type}`,
            })}
          </Typography>
        </Grid>
        <Grid item xs>
          <ChannelDescription channel={channel} />
          <PrimaryContact channel={channel} />
        </Grid>
        {!isChildNull(sidePanel) && (
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1">
              {intl.formatMessage({
                id: 'ChannelContactDetailsTitle',
                defaultMessage: 'Muut yhteystiedot',
              })}
            </Typography>
            {sidePanel}
          </Grid>
        )}
      </Grid>
      {!isChildNull(websiteList) && (
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            css={css`
              margin-top: ${theme.spacing(1)}px;
            `}
          >
            {intl.formatMessage({
              id: 'ChannelWebsiteListTitle',
              defaultMessage: 'Lisätietoa verkossa',
            })}
          </Typography>
          {websiteList}
        </Grid>
      )}
    </ChannelCardContainer>
  );
});

const ChannelCardContainer = styled.div(
  ({ theme }: { theme: Theme }) => `
  margin: 1rem 0;
  border-radius: 0.75rem;
  background: ${theme.palette.background.default};
  padding: ${theme.spacing(2.5)}px;

  .MuiGrid-root.title-container {
    padding-top: 0;
  }

  .channel-title {
    font-size: 1.35rem;
    line-height: 1.25;
  }

  .channel-type {
    text-transform: uppercase;
    font-size: 0.85rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgba(17, 24, 50, 0.75);
  }

  .link-content {
    letter-spacing: 0;
  }
`,
);

const SidePanelContentByType = ({
  channel,
}: {
  channel: IChannel;
}): EmotionJSX.Element | null => {
  const phoneNumberList = PhoneNumberList({ channel: channel });
  const emailList = EmailList({ channel: channel });

  if (channel.type === 'EChannel') {
    return isChildNull(phoneNumberList) && isChildNull(emailList) ? null : (
      <Fragment>
        {phoneNumberList}
        {emailList}
      </Fragment>
    );
  }

  if (channel.type === 'Phone') {
    return isChildNull(emailList) ? null : <Fragment>{emailList}</Fragment>;
  }

  if (channel.type === 'PrintableForm' || channel.type === 'ServiceLocation') {
    return isChildNull(emailList) && isChildNull(phoneNumberList) ? null : (
      <Fragment>
        {emailList}
        {phoneNumberList}
      </Fragment>
    );
  }

  // Type does not have side panel
  return null;
};

const ChannelDescription: FC<{ channel: IChannel }> = observer(
  ({ channel }) => {
    const { description, descLang } = getChannelDescription(channel);
    const theme = useTheme();
    return (
      <div
        css={css`
          margin-bottom: ${theme.spacing(2)}px;
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        `}
        lang={descLang || undefined}
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    );
  },
);

/* Primary contact info for channel type 
  - ServiceLocation: Address
  - EChannel: website(s)
  - WebPage: website(s)
  - Phone: phone number(s)
  - PrintableForm: Form(s) (channelUrls)
*/
export const PrimaryContact: FC<{ channel: IChannel }> = observer(
  ({ channel }) => {
    switch (channel.type) {
      case 'EChannel':
        return (
          <LinkList>
            {channel.webPages.map((web) => (
              <li key={web}>
                <StyledLink
                  url={web}
                  external
                  enhanced
                  content={'Siirry verkkoasiointiin'}
                  iconBefore={faLaptop}
                />
              </li>
            ))}
          </LinkList>
        );
      case 'Phone':
        return (
          <LinkList>
            {uniqueFormattedPhoneNumbers(channel.phoneNumbers).map(
              (number: string) => (
                <li key={number}>
                  <StyledLink
                    url={`tel:${number}`}
                    external
                    enhanced
                    content={number}
                    iconBefore={faPhone}
                    iconAfter={null}
                  />
                </li>
              ),
            )}
          </LinkList>
        );
      case 'PrintableForm':
        return (
          <LinkList>
            {channel.channelUrls.map((form) => (
              <li key={form.url}>
                <StyledLink
                  url={form.url}
                  content={`${channel.name} (${form.type})`}
                  external
                  enhanced
                  iconBefore={faFileAlt}
                />
              </li>
            ))}
          </LinkList>
        );
      case 'ServiceLocation':
        return <AddressList channel={channel} />;
      case 'WebPage':
        return (
          <LinkList>
            {channel.webPages.map((web) => (
              <li key={web}>
                <StyledLink
                  url={web}
                  external
                  enhanced
                  content={channel.name}
                  iconBefore={faGlobe}
                />
              </li>
            ))}
          </LinkList>
        );
      default:
        return null;
    }
  },
);

const PhoneNumberList = ({ channel }: { channel: IChannel }) => {
  const uniqueNumbers = uniqueFormattedPhoneNumbers(channel.phoneNumbers);
  if (uniqueNumbers.length > 0) {
    return (
      <IconList>
        {uniqueNumbers.map((number: string) => (
          <ListItemWithIcon key={number}>
            <FontAwesomeIcon icon={faPhone} className="list-icon" />
            <StyledLink
              url={`tel:${number}`}
              external
              content={number}
              iconAfter={null}
            />
          </ListItemWithIcon>
        ))}
      </IconList>
    );
  }
  return null;
};

const EmailList = ({ channel }: { channel: IChannel }) => {
  if (channel.emails.length > 0) {
    return (
      <IconList>
        {channel.emails.map((email: string) => (
          <ListItemWithIcon key={email}>
            <FontAwesomeIcon icon={faAt} className="list-icon" />
            <StyledLink
              url={`mailto:${email}`}
              external
              content={email}
              iconAfter={null}
            />
          </ListItemWithIcon>
        ))}
      </IconList>
    );
  }

  return null;
};

const WebsiteList = ({ channel }: { channel: IChannel }) => {
  if (channel.webPages.length > 0) {
    return (
      <IconList>
        {channel.webPages.map((website: string) => (
          <ListItemWithIcon key={website}>
            <FontAwesomeIcon icon={faGlobe} className="list-icon" />
            <StyledLink url={website} external content={website} />
          </ListItemWithIcon>
        ))}
      </IconList>
    );
  }

  return null;
};

export const IconList = styled.ul`
  margin-top: 0rem;
  list-style: none;
  padding-inline-start: 0;
  margin-block-end: 0;
`;

export const ListItemWithIcon = styled.li`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;
  align-items: center;

  .link-content {
    font-weight: 500;
  }

  .list-icon {
    margin-right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const LinkList = styled.ul`
  margin-top: 0rem;
  list-style: none;
  padding-inline-start: 0;
  margin-block-end: 0;

  li {
    margin-bottom: 0.5rem;
  }

  li:last-of-type {
    margin-bottom: 0;
  }
`;
