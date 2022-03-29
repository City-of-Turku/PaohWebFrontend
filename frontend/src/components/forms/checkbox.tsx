/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useTheme, Checkbox, CheckboxProps } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

export const ThemeCheckbox = (props: CheckboxProps): EmotionJSX.Element => {
  const theme = useTheme();

  return (
    <Checkbox
      disableRipple
      checkedIcon={
        <FontAwesomeIcon
          icon={faSquareXmark}
          className="fontawesome-icon icon-checked"
        />
      }
      icon={
        <FontAwesomeIcon
          icon={faSquare}
          className="fontawesome-icon  icon-unchecked"
        />
      }
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
      css={css`
        .icon-checked,
        .icon-unchecked {
          color: ${theme.palette.primary.main};
          font-size: 1.75rem;
        }

        input:disabled ~ .fontawesome-icon {
          color: rgba(0, 0, 0, 0.5);
        }
      `}
    />
  );
};
