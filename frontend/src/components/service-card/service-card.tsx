/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  useTheme,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';
import { IDescription, IService } from 'models/service';
import { IChannel } from 'models/channel';
import { ServiceChannelList } from './channel-list';
import { useIntl } from 'react-intl';
import { getDescription } from '../../utils/service-utils';
import { ServiceName, ServiceDescriptionBox } from '../service-atoms';
import { OnOffButton } from 'components/buttons/on-off-button';

const DESCRIPTION_PREVIEW_LIMIT = 300;

interface IServiceCard {
  service: IService;
  channels: IChannel[];
}

export const ServiceCard: FC<IServiceCard> = observer(
  ({ service, channels }) => {
    const theme = useTheme();
    const intl = useIntl();
    const [expanded, setExpanded] = useState(false);
    const [autoTranslate, setAutoTranslate] = useState(true);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toggleAutoTranslate = (id: string) => {
      setAutoTranslate((prevState) => !prevState);
    };

    const descObject: IDescription | undefined = getDescription(
      service.descriptions,
    );

    const hasAutoTranslatedContent =
      descObject?.autoTranslated || service.name.autoTranslated;

    const description = autoTranslate
      ? descObject?.value || ''
      : descObject?.original || '';

    // Show action buttons only if there is more content to show
    const moreDetailsToShow: boolean =
      description.length > DESCRIPTION_PREVIEW_LIMIT || channels.length > 0;

    return (
      <Card
        css={css`
          && {
            border-radius: 1rem;
            background-color: ${theme.palette.section.main};
            box-shadow: none;
            padding: ${theme.spacing(2)}px;

            .MuiCardContent-root,
            .MuiCardActions-root,
            .MuiCardHeader-root {
              padding: 0;
            }

            .MuiCardContent-root {
              padding-top: ${theme.spacing(0)}px;
              padding-bottom: ${theme.spacing(0)}px;
            }

            .MuiCardHeader-root {
              padding-bottom: ${theme.spacing(1)}px;
            }

            .MuiCardHeader-title {
              & a {
                padding: 0.25rem 0;
              }

              .service-name {
                font-size: 1.35rem;
                line-height: 1.35rem;
              }
            }

            .MuiCardActions-root {
              padding-top: ${theme.spacing(1)}px;
            }

            .MuiCardActions-root .MuiIconButton-root {
              border-radius: 1rem;
              padding: 0;
              background: inherit;
              display: flex;
              flex-direction: row;
              align-items: center;
              line-height: 1.75rem;
              font-size: 1rem;

              .MuiTypography-root {
                font-weight: 700;
              }

              .fontawesome-icon {
                color: ${theme.palette.text.primary};
                height: 1.4rem;
                width: 1.4rem;
                margin-left: 0.15rem;
              }
            }

            .MuiButton-root {
              color: ${theme.palette.primary.main};
            }

            .description h3 {
              font-size: 1.025rem;
              line-height: 1.25rem;
              font-weight: 500;
              margin-block-start: 0.75rem; // Space above title
              margin-block-end: 0rem; // Space below title

              &:first-of-type {
                margin-block-start: 0rem;
                margin-block-end: 0.5rem;
              }
            }

            .description p {
              padding-top: 0.75rem;
              margin-block-start: 0;
              margin-block-end: 0;
            }

            // Tighter spacing if paragrahs comes after title
            .description h3 + p {
              padding-top: 0.5rem;
            }

            .description p:first-of-type {
              padding-top: 0;
            }

            .description ul,
            .description ol {
              margin-block-start: 0;
              margin-block-end: 0;
              margin-top: 0;
              padding-inline-start: 2rem;
            }
          }
        `}
      >
        <CardHeader
          title={
            <div
              css={css`
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
              `}
            >
              <ServiceName
                service={service}
                autoTranslate={autoTranslate}
                nameIsLink={true}
              />
              {hasAutoTranslatedContent && (
                <OnOffButton
                  id="toggle-autotranslate"
                  on={autoTranslate}
                  onClick={toggleAutoTranslate}
                  icon={faLanguage}
                  showTooltip
                  offTooltipTextId={'AutomaticTranslationIsOff'}
                  onTooltipTextId={'AutomaticTranslationIsOn'}
                />
              )}
            </div>
          }
        />
        <CardContent>
          <ServiceDescriptionBox
            description={descObject}
            autoTranslate={autoTranslate}
            expanded={expanded}
            collapseLength={DESCRIPTION_PREVIEW_LIMIT}
          />
        </CardContent>
        <CardContent>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <ServiceChannelList serviceId={service.id} channels={channels} />
          </Collapse>
        </CardContent>
        {moreDetailsToShow && (
          <CardActions>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label={expanded ? 'show less' : 'show more'}
            >
              <Typography variant="body2" color="textPrimary" component="span">
                {expanded
                  ? intl.formatMessage({
                      id: 'CardShowLess',
                      defaultMessage: 'Lue vähemmän',
                    })
                  : intl.formatMessage({
                      id: 'CardShowMore',
                      defaultMessage: 'Lue lisää',
                    })}
              </Typography>
              {expanded ? (
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="fontawesome-icon"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="fontawesome-icon"
                />
              )}
            </IconButton>
          </CardActions>
        )}
      </Card>
    );
  },
);
