/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { Container, useTheme, IconButton, Collapse } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { StyledLink } from 'components/link/link';
import { LAST_UPDATED } from '../../constants';

interface FooterProps {
  isHomepage: boolean;
}

export function FooterComponent({
  isHomepage,
}: FooterProps): EmotionJSX.Element {
  const theme = useTheme();
  const intl = useIntl();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('xs'));
  const [footerOpen, setFooterOpen] = useState(false);

  const handleFooterExpand = () => {
    setFooterOpen(!footerOpen);
  };

  const homepageFooterStyles = `
    position: absolute;
    bottom: 0;
  `;

  return (
    <Container
      id="footer"
      maxWidth={false}
      component="footer"
      css={css`
        && {
          min-height: 64px;
          overflow: hidden;
          height: 64px;
          font-size: 0.95rem;
          background-color: ${theme.palette.bg.dark};
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          margin-top: auto;

          ${isHomepage && homepageFooterStyles}

          // To expand footer content to full width (when its not in collapsiple mode)
          // but to keep links from expanding to full width in collapse mode
          ${theme.breakpoints.up('sm')} {
            .MuiCollapse-root {
              width: 100%;
            }
          }

          padding-left: 2rem;
          padding-right: 2rem;

          ${theme.breakpoints.down('sm')} {
            font-size: 0.85rem;
            padding-left: ${theme.spacing(2)}px;
            padding-right: ${theme.spacing(2)}px;
          }

          .footer__links {
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .flex-filler {
            flex-grow: 1;
          }

          .footer__links a {
            font-weight: 700;

            &:first-of-type {
              margin-left: ${theme.spacing(0)}px;
            }

            &:last-of-type {
              margin-right: ${theme.spacing(0)}px;
            }

            margin-right: ${theme.spacing(2)}px;
            margin-left: ${theme.spacing(2)}px;
          }

          .footer-control-button {
            color: ${theme.palette.text.secondary};
            height: 42px;
            width: auto;
            position: absolute;
            top: 0px;
            right: 4px;
            border-radius: 0;

            .fontawesome-icon {
              height: 32px;
              width: auto;
            }
          }

          ${theme.breakpoints.down('md')} {
            .footer__links a {
              margin-right: ${theme.spacing(1)}px;
              margin-left: ${theme.spacing(1.5)}px;
            }
          }

          ${theme.breakpoints.down('xs')} {
            padding-left: ${theme.spacing(1.5)}px; // Match main content padding
            padding-right: ${theme.spacing(1.5)}px;
            font-size: 0.9rem;
            height: max-content; // this works on the front page

            position: relative;
            min-height: ${isHomepage ? '42px' : 'fit-content'};
            padding-bottom: ${isHomepage
              ? theme.spacing(4)
              : theme.spacing(1)}px;

            .footer__links {
              margin-top: ${isHomepage ? '42' : theme.spacing(1)}px;
              display: block;
            }

            .footer__links a {
              display: block;
              padding-bottom: ${theme.spacing(2)}px;
              margin-left: 0;

              &:first-of-type {
                padding-top: ${theme.spacing(2)}px;
              }
            }
          }
        }
      `}
    >
      {isSmallDevice && isHomepage && (
        <IconButton
          aria-label={footerOpen ? 'open footer' : 'close footer'}
          className="footer-control-button"
          onClick={handleFooterExpand}
        >
          <FontAwesomeIcon
            icon={footerOpen ? faAngleUp : faAngleDown}
            className="fontawesome-icon"
          />
        </IconButton>
      )}
      <Collapse in={isSmallDevice && isHomepage ? footerOpen : true}>
        <div className="footer__links">
          <StyledLink
            url="saavutettavuus"
            inverted
            content={intl.formatMessage({
              id: 'AccessibilityStatementLink',
              defaultMessage: 'Saavutettavuusseloste',
              description: 'Text for the link to the accessibility statement',
            })}
          />
          <StyledLink
            url="tietosuoja"
            inverted
            content={intl.formatMessage({
              id: 'PrivacyPolicyLink',
              defaultMessage: 'Tietosuojaseloste',
              description: 'Text for the link to the privacy policy',
            })}
          />
          <StyledLink
            url="https://opaskartta.turku.fi/eFeedback/"
            external
            inverted
            content={intl.formatMessage({
              id: 'FeedbackPageLink',
              defaultMessage: 'Anna palautetta',
              description: 'Text for the link to the feedback page',
            })}
          />
          <StyledLink
            url="kehittajille"
            inverted
            content={intl.formatMessage({
              id: 'PageTitleForDevelopers',
              defaultMessage: 'Kehittäjille',
              description:
                'Text for the link to the developer documentation page',
            })}
          />
          <div className="flex-filler"></div>
          <StyledLink
            url="julkaisut"
            inverted
            content={`${intl.formatMessage({
              id: 'LatestUpdateLinkTitle',
              defaultMessage: 'Päivitetty',
              description:
                'Text for the link to the developer documentation page',
            })} ${LAST_UPDATED}`}
          />
        </div>
      </Collapse>
      <div id="footer_bottom_target"></div>
    </Container>
  );
}
