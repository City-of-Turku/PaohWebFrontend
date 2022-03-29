/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useTheme } from '@material-ui/core';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { IDescription } from 'models/service';

interface IDescriptionContainer {
  description: IDescription | undefined;
  autoTranslate: boolean; // Whether automatically translated content will be displayed
  expanded?: boolean;
  collapseLength?: number; // Character limit for when expanded = false
}

export const ServiceDescriptionBox: FC<IDescriptionContainer> = observer(
  ({ description, autoTranslate, expanded = true, collapseLength = 300 }) => {
    const intl = useIntl();
    const theme = useTheme();

    if (description) {
      return (
        <div
          css={css`
            margin: auto 0;

            .fontawesome-icon {
              height: 2rem;
              color: ${theme.palette.text.primary};
            }

            .overlay-icon {
              position: absolute;
              z-index: 100;
              color: ${theme.palette.error.dark};
              // color: ${theme.palette.text.primary};
              opacity: 1;
            }
          `}
        >
          <div
            lang={
              !autoTranslate && description?.original
                ? description.originalLanguage
                : description?.language
            }
            className="description"
            dangerouslySetInnerHTML={{
              __html: getDescriptionToShow(
                description,
                autoTranslate,
                expanded,
                collapseLength,
              ),
            }}
          />
        </div>
      );
    }

    // If description is not available
    return (
      <div>
        {intl.formatMessage({
          id: 'ErrorServiceDescriptionUnavailable',
          defaultMessage: 'Palvelun kuvaus puuttuu',
          description:
            'Message to be shown in a service card in place of a missing service description',
        })}
      </div>
    );
  },
);

const getDescriptionToShow = (
  description: IDescription,
  autoTranslate: boolean,
  expanded: boolean,
  collapseLength: number,
) => {
  const text =
    !autoTranslate && description?.original
      ? description.original
      : description.value;

  if (!expanded) {
    return shortenDescription(text, collapseLength);
  }

  return text;
};

const shortenDescription = (desc: string, limit: number): string => {
  return desc.length > limit ? desc.substring(0, limit) + '...' + '\n' : desc;
};
