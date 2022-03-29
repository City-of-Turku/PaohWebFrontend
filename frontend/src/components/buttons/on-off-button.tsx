/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { IconButton, Tooltip, useTheme } from '@material-ui/core';
import { faSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

interface IOnOffButton {
  id: string;
  on: boolean;
  isDisabled?: boolean;
  onClick?: (buttonId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // FontAwesomeIcon to display (and it will be 'slashed' over when button is set of "off")
  showTooltip?: boolean; // false by default
  disabledTooltipTextId?: string;
  offTooltipTextId?: string;
  onTooltipTextId?: string;
  // iconColor?
  // crossOffColor?
}

export const OnOffButton = ({
  id,
  on,
  isDisabled = false,
  onClick,
  icon,
  showTooltip = false,
  disabledTooltipTextId,
  offTooltipTextId,
  onTooltipTextId,
}: IOnOffButton): EmotionJSX.Element => {
  const theme = useTheme();
  const intl = useIntl();

  const handleClick = () => {
    if (!isDisabled) {
      onClick && onClick(id);
    }
  };

  const getTooltipText = (): string | undefined => {
    if (!showTooltip) return undefined;
    if (isDisabled) {
      return intl.formatMessage({ id: disabledTooltipTextId });
    }
    return intl.formatMessage({ id: on ? onTooltipTextId : offTooltipTextId });
  };

  return (
    <div
      css={css`
        margin-left: 0.5rem;

        .MuiIconButton-root {
          padding: 0;
        }

        .fontawesome-icon {
          height: 2rem;
          color: ${theme.palette.text.primary};
        }

        .overlay-icon {
          position: absolute;
          z-index: 100;
          color: ${theme.palette.error.dark};
          opacity: 1;
        }
      `}
    >
      <WithTooltip tooltip={getTooltipText()} arrow>
        <IconButton onClick={handleClick}>
          {!on && (
            <FontAwesomeIcon
              icon={faSlash}
              className="fontawesome-icon overlay-icon"
            />
          )}
          <FontAwesomeIcon
            icon={icon}
            className="fontawesome-icon"
            style={{
              opacity: on ? '1' : '0.5',
            }}
          />
        </IconButton>
      </WithTooltip>
    </div>
  );
};

interface IWithTooltip {
  tooltip?: string; // tooltip title. If not set, tooltip is not displayed
  children: JSX.Element;
  arrow?: boolean;
}

const WithTooltip = ({ tooltip, children, arrow = true }: IWithTooltip) =>
  tooltip ? (
    <Tooltip title={tooltip} aria-label={tooltip} arrow={arrow}>
      {children}
    </Tooltip>
  ) : (
    children
  );
