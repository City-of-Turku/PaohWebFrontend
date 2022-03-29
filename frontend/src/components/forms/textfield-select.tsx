/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { TextField, useTheme } from '@material-ui/core';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

interface ITextFieldSelect {
  id: string;
  label: string;
  options: { id: string; textId: string }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextFieldSelect = ({
  id,
  label,
  options,
  value,
  onChange,
}: ITextFieldSelect): EmotionJSX.Element => {
  const theme = useTheme();

  return (
    <TextField
      id={id}
      select // The select prop makes the text field use the Select component internally.
      label={label}
      value={value}
      onChange={onChange}
      color="primary"
      InputLabelProps={{ shrink: true }}
      InputProps={{ disableUnderline: true }}
      SelectProps={{
        native: true,
      }}
      css={css`
        && {
          .MuiInputLabel-shrink {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 1.15rem;
            color: ${theme.palette.text.primary};
          }

          .MuiInput-root {
            font-size: 1.1rem;
            background: ${theme.palette.secondary.light};
            padding: 8px;
            border: 1px solid ${theme.palette.primary.main};
            border-radius: 12px;
            margin-top: 20px;
            font-weight: 400;

            &.Mui-focused {
              border-color: transparent; /* remove the border's colour */
              /* emulate the border */
              box-shadow: 0 0 0 2px ${theme.palette.primary.main};
            }
          }
        }
      `}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.textId}
        </option>
      ))}
    </TextField>
  );
};
