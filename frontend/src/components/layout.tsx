/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FC, Fragment, useEffect } from 'react';
import { useTheme, Container, CssBaseline, Theme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store-hooks';
import { AppBar } from './appbar';
import { SiteFooter } from './footer';
import { useParams, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isSupportedLanguage } from 'types';
import { checkIfValidUUID } from 'utils/service-utils';

interface ILayout {
  lang: string;
}

export const Layout: FC<ILayout> = observer(({ lang }) => {
  const theme = useTheme();
  const settingsStore = useStore('settingsStore');
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const languagePathRegex = /(^\/(fi|sv|en)(\/)*$)/g;
  const isHomepageRoute: boolean = languagePathRegex.test(pathname);

  useEffect(() => {
    if (lang && isSupportedLanguage(lang)) {
      settingsStore.selectedLanguage = lang;
    }

    if (id) {
      if (checkIfValidUUID(id)) {
        navigate(`/${settingsStore.selectedLanguage}/${id}` + search);
      } else {
        // Go back to front page
        navigate(`/${settingsStore.selectedLanguage}`);
      }
    }
  }, [id, lang, navigate, settingsStore, search]);

  return (
    <Fragment>
      <CssBaseline />
      <Container
        maxWidth={false}
        css={css`
          && {
            height: ${isHomepageRoute ? '100vh' : 'auto'};
            ${!isHomepageRoute && 'min-height: 100vh;'}
            overflow-y: ${isHomepageRoute ? 'hidden' : 'auto'};
            padding: 0;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            background-color: ${theme.palette.section.dark};

            ${theme.breakpoints.down('xs')} {
              overflow-y: auto;
            }
          }
        `}
      >
        <AppBar isHomepage={isHomepageRoute} />
        <Container
          maxWidth={false}
          component="main"
          css={css`
            && {
              overflow-y: auto;
              position: relative;
              padding: ${theme.spacing(1.5)}px ${theme.spacing(3)}px;

              ${theme.breakpoints.down('sm')} {
                padding: ${theme.spacing(2)}px ${theme.spacing(2)}px;
              }

              ${theme.breakpoints.down('xs')} {
                padding: ${theme.spacing(1.5)}px ${theme.spacing(1.5)}px;
              }

              ${isHomepageRoute && homepageMainCompStyle(theme)}
            }
          `}
        >
          <Outlet />
        </Container>
        <SiteFooter isHomepage={isHomepageRoute} />
      </Container>
    </Fragment>
  );
});

const homepageMainCompStyle = (theme: Theme) => css`
  overflow-y: hidden;
  height: 100%;
  overflow: hidden;
  margin-top: 64px; // Because of header / app bar
  margin-bottom: 64px; // for footer

  ${theme.breakpoints.down('xs')} {
    margin-top: 56px;
    margin-bottom: 0px;
  }
`;
