/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC } from 'react';
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  useTheme,
  GridSpacing,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { LanguageSelect } from './language-select';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface IAppBar {
  isHomepage: boolean;
}

export const AppBarComponent: FC<IAppBar> = observer(({ isHomepage }) => {
  const theme = useTheme();
  const intl = useIntl();
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.only('xs'));

  const getSpacing = (smallOrLess: boolean, medium: boolean): GridSpacing => {
    if (smallOrLess) return 0;
    if (medium) return 2;
    return 3;
  };

  if (isHomepage) {
    return (
      <AppBar
        position="fixed"
        elevation={0}
        css={css`
          && {
            background-color: ${theme.palette.background.default};
            color: ${theme.palette.text.primary};

            a {
              text-decoration: none;
            }

            .return-link {
              display: flex;
              flex-direction: row;
              color: ${theme.palette.text.primary};
              align-items: center;

              .svg-inline--fa {
                margin-right: ${theme.spacing(1)}px;
                font-size: ${theme.typography.subtitle1.fontSize};
              }
            }
          }
        `}
      >
        <Toolbar
          disableGutters={false}
          css={css`
            && {
              justify-content: space-between;

              .header-title,
              .return-link {
                margin-left: ${theme.spacing(1)}px;

                ${theme.breakpoints.down('sm')} {
                  margin-left: -${theme.spacing(1)}px;
                }

                ${theme.breakpoints.down('xs')} {
                  margin-left: -${theme.spacing(0.5)}px;
                }
              }
            }
          `}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={getSpacing(isSmall, isMedium)}
          >
            <Grid item xs sm={4} md={6} lg={7} xl={8}>
              <Link to="/">
                <Typography
                  variant="subtitle1"
                  color="primary"
                  className="header-title"
                >
                  {intl.formatMessage({
                    id: 'WebsiteName',
                    defaultMessage: 'Palveluohjain',
                  })}
                </Typography>
              </Link>
            </Grid>
            <Grid
              item
              xs
              sm={8}
              md={6}
              lg={5}
              xl={4}
              css={css`
                && {
                  display: flex;
                  align-items: center;

                  .language-select {
                    margin-left: auto;
                  }
                }
              `}
            >
              <LanguageSelect />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="static" // Header hidden on scroll (except on chat page)
      elevation={0}
      css={css`
        && {
          background-color: ${theme.palette.background.default};
        }
      `}
    >
      <Toolbar
        disableGutters={false}
        css={css`
          && {
            justify-content: space-between;
            color: ${theme.palette.text.primary};

            a {
              text-decoration: none;
            }

            .return-link {
              display: flex;
              flex-direction: row;
              color: ${theme.palette.text.primary};
              align-items: center;

              .svg-inline--fa {
                margin-right: ${theme.spacing(1)}px;
                font-size: ${theme.typography.subtitle1.fontSize};
              }
            }
          }
        `}
      >
        <Link to="/">
          <span className="return-link">
            <FontAwesomeIcon icon={faChevronLeft} />
            <Typography variant="subtitle1" color="primary">
              {intl.formatMessage({
                id: isExtraSmall ? 'ReturnHomeLinkShorter' : 'ReturnHomeLink',
                defaultMessage: 'Palaa keskusteluun',
              })}
            </Typography>
          </span>
        </Link>
        <LanguageSelect />
      </Toolbar>
    </AppBar>
  );
});
