/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC } from 'react';
import { languages } from '../../constants';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store-hooks';
import { Link, useLocation, generatePath } from 'react-router-dom';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const LanguageSelect: FC = observer(() => {
  const settingsStore = useStore('settingsStore');
  const theme = useTheme();
  const location = useLocation();

  const preserveSubpath = (pathname: string): string => {
    const subpath = pathname.replace(/(\/(fi|sv|en)(\/|\b))/g, '');
    // newly constructed path
    return subpath.length > 0 ? ':lang/' + subpath : ':lang';
  };

  const isExtraSmall = useMediaQuery(theme.breakpoints.only('xs'));

  return (
    <ul
      className="language-select"
      css={css`
        font-size: 1rem;
        list-style: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0;
        line-height: inherit;

        li {
          padding: 0 0.5rem;
        }

        padding-inline-start: 0.5rem;

        ${theme.breakpoints.down('xs')} {
          padding-inline-start: 0;
          li {
            padding: 0 0.35rem;
          }
        }

        li:last-of-type a {
          padding-right: 0rem;
        }

        a {
          position: relative;
          text-decoration: none;
          font-family: 'Lexend', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding-bottom: 0.5rem;
          text-transform: uppercase;
          background: transparent;
          box-sizing: border-box;
          color: ${theme.palette.text.primary};

          &.selected-language::after,
          &.selected-language::before {
            content: '';
            position: absolute;
            bottom: 0.125rem;
            left: 0;
            right: 0;
            height: 0.1875rem;
            background-color: ${theme.palette.text.primary};
            opacity: 1;
          }

          &:not(.selected-language) {
            &::before,
            &::after {
              content: '';
              position: absolute;
              bottom: 0.125rem;
              left: 0;
              right: 0;
              height: 0.1875rem;
              background-color: ${theme.palette.text.primary};
            }

            &::before {
              opacity: 0;
              transform: translateY(0.25rem);
              transition: transform 0s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                opacity 0s;
            }

            &::after {
              opacity: 0;
              transform: translateY(0.25rem);
              transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                opacity 0.2s;
            }

            &:hover,
            &:focus {
              &::before,
              &::after {
                opacity: 1;
                transform: translateY(0);
              }
              &::before {
                transition: transform 0.2s
                    cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  opacity 0.2s;
              }

              &::after {
                transition: transform 0s 0.2s
                    cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  opacity 0s 0.2s;
              }
            }
          }
        }
      `}
    >
      {languages.map((lang) => (
        <li key={lang.id}>
          <Link
            to={`/${generatePath(preserveSubpath(location.pathname), {
              lang: lang.id,
            })}`}
            lang={lang.id}
            hrefLang={lang.id}
            className={
              settingsStore.selectedLanguage == lang.id
                ? 'selected-language'
                : ''
            }
          >
            {isExtraSmall ? lang.id : lang.textId}
          </Link>
        </li>
      ))}
    </ul>
  );
});
