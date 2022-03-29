/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { Link as RouterLink } from 'react-router-dom';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import { Theme, useTheme } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

type CustomRouterProps = Omit<RouterLinkProps, 'to'>;

type StyledLinkProps = {
  external?: boolean; // Is link external or internal (Router link)
  content: string;
  url: string;
  title?: string; // title - a11y title
  iconAfter?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  iconBefore?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  inverted?: boolean;
  enhanced?: boolean;
} & CustomRouterProps;

export const StyledLink = ({
  external = false,
  content,
  url,
  title,
  iconAfter, // By default, external links will have faExternalLinkAlt as icon after. To hide that, set iconAfter to null
  iconBefore,
  inverted = false,
  enhanced = false,
  className,
  ...routerProps
}: StyledLinkProps): EmotionJSX.Element => {
  const theme = useTheme();

  if (external) {
    return (
      <ExternalLink
        href={url}
        target="_blank"
        rel="noopener"
        title={title}
        theme={theme}
        enhanced={enhanced || false}
        inverted={inverted || false}
        className={className}
      >
        {iconBefore && (
          <FontAwesomeIcon
            icon={iconBefore}
            className={'fontawesome-icon fontawesome-icon--before'}
          />
        )}
        <span className="link-content">{content}</span>
        {iconAfter !== null && (
          <FontAwesomeIcon
            icon={iconAfter || faExternalLinkAlt}
            className={'fontawesome-icon fontawesome-icon--after'}
          />
        )}
      </ExternalLink>
    );
  }
  return (
    <InternalLink
      {...routerProps}
      to={url}
      title={title}
      theme={theme}
      enhanced={enhanced || false}
      inverted={inverted || false}
      className={className}
    >
      {iconBefore && (
        <FontAwesomeIcon
          icon={iconBefore}
          className={'fontawesome-icon fontawesome-icon--before'}
        />
      )}
      <span className="link-content">{content}</span>
      {iconAfter && (
        <FontAwesomeIcon
          icon={iconAfter}
          className={'fontawesome-icon fontawesome-icon--after'}
        />
      )}
    </InternalLink>
  );
};

type LinkStyleProps = {
  theme: Theme;
  enhanced: boolean;
  inverted: boolean;
};

type InternalLinkStyle = LinkStyleProps & RouterLinkProps;

const ExternalLink = styled.a<LinkStyleProps>`
  ${(theme) => BaseLinkStyle(theme)}
  ${(props: LinkStyleProps) => props.enhanced && Enhanced(props.theme)}
  ${(props: LinkStyleProps) => props.inverted && InvertedColors(props.theme)}

  .fontawesome-icon--after {
    width: 0.75rem;
    height: 0.75rem;
    margin-left: 0.25rem;
    padding: 0;
    margin-right: 0;
  }
`;

const InternalLink = styled(
  ({
    theme, // eslint-disable-line @typescript-eslint/no-unused-vars
    enhanced, // eslint-disable-line @typescript-eslint/no-unused-vars
    inverted, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...props
  }: InternalLinkStyle) => <RouterLink {...props} />,
)<InternalLinkStyle>`
  ${(theme) => BaseLinkStyle(theme)}
  ${({ enhanced, theme }) => enhanced && Enhanced(theme)}
  ${({ inverted, theme }) => inverted && InvertedColors(theme)}
`;

const BaseLinkStyle = ({ theme }: { theme: Theme }) => css`
  font-size: inherit;
  color: ${theme.palette.primary.main};
  text-decoration: underline;
  position: relative;
  transition: box-shadow 0.4s ease-in-out 0s, color 0.3s;

  &:focus,
  &:hover {
    box-shadow: inset 0 -18ex 0 0 ${theme.palette.primary.main};
    color: ${theme.palette.secondary.main};
  }

  display: inline-flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;

  .link-content {
    overflow-wrap: break-all;
    word-wrap: break-all;
    -ms-word-break: break-all;
    word-break: break-all;
    -ms-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }

  .fontawesome-icon--before {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  .fontawesome-icon--after {
    margin-left: 0.25rem;
  }
`;

const InvertedColors = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  &:focus,
  &:hover {
    box-shadow: inset 0 -18ex 0 0 ${theme.palette.secondary.main};
    color: ${theme.palette.primary.main};
  }

  border-color: ${theme.palette.secondary.main};
`;

const Enhanced = (theme: Theme) => css`
  box-shadow: none;
  border-radius: 11px;
  line-height: 1.4;
  padding: 0.67rem 1rem;
  width: fit-content;
  border: 2px solid;
  border-color: ${theme.palette.primary.main};
  font-weight: 700;
  letter-spacing: 0;
  background-color: transparent;

  & .fontawesome-icon--before {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
