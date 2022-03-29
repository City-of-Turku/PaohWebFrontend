/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography, useTheme } from '@material-ui/core';
import { useEffect, useState, RefObject } from 'react';

interface IScrollTo {
  scrollRef?: RefObject<HTMLElement>;
  bottomRef?: RefObject<HTMLElement>;
  autoSwitchDirections?: boolean;
  showText?: boolean;
  scrollUpText?: string;
  scrollDownText?: string;
  bottomMargin?: string;
  rightMargin?: string;
}

export const ScrollToButton = ({
  scrollRef,
  bottomRef,
  autoSwitchDirections = true,
  showText = false,
  scrollUpText = 'Back to top',
  scrollDownText = 'Scroll to bottom',
  bottomMargin = '75px',
  rightMargin = '2rem',
}: IScrollTo): EmotionJSX.Element => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollUp, setScrollUp] = useState(true);
  const [scrollTarget, setScrollTarget] = useState<HTMLElement | Window>(
    window,
  );

  const pageScrollHeight = (): number => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
    );
  };

  const scrollToTop = () => {
    if (scrollUp) {
      scrollTarget.scroll({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (bottomRef && bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      // If target for scrolling to bottom was not provided...
      else if (scrollRef && scrollRef.current) {
        scrollTarget.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        scrollTarget.scrollTo({
          top: pageScrollHeight(),
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const contentLeftToScroll = (): boolean => {
      if (scrollTarget instanceof HTMLElement) {
        return scrollTarget.scrollHeight > scrollTarget.clientHeight;
      }
      return pageScrollHeight() > scrollTarget.innerHeight;
    };

    const scrolledDistance = (): number => {
      if (scrollTarget instanceof HTMLElement) {
        return scrollTarget.scrollTop;
      }
      return scrollTarget.scrollY;
    };

    const toggleVisibility = (): void => {
      if (scrolledDistance() > 500) {
        setIsVisible(true);
        setScrollUp(true);
      } else if (autoSwitchDirections && contentLeftToScroll()) {
        setIsVisible(true);
        setScrollUp(false);
      } else {
        setIsVisible(false);
      }
    };

    if (scrollRef && scrollRef.current) {
      setScrollTarget(scrollRef.current);
    }
    scrollTarget.addEventListener('scroll', toggleVisibility, true);

    return () => {
      // Remove event lister when component unmounts
      scrollTarget.removeEventListener('scroll', toggleVisibility);
      setScrollTarget(window);
    };
  }, [scrollRef, scrollTarget, autoSwitchDirections]);

  return (
    <IconButton
      onClick={scrollToTop}
      className={!isVisible ? 'hidden' : ''}
      css={css`
        && {
          visibility: ${isVisible ? 'visible' : 'hidden'};
          opacity: ${isVisible ? '1' : '0'};
          transition: opacity 1s linear, background-color 1s fade-out;

          z-index: 1000;
          position: fixed;
          right: 0;
          margin-right: ${rightMargin};
          bottom: ${bottomMargin};
          display: flex;
          max-width: ${theme.spacing(10)}px;

          .MuiIconButton-label {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          padding: 0;

          &:hover,
          &:focus {
            background: none;
          }

          .fontawesome-icon {
            position: relative;
            height: ${theme.spacing(6)}px;
            width: ${theme.spacing(6)}px;
            margin: 0;
            padding: 0;
            border-radius: ${theme.spacing(6) / 2}px;
            background: ${theme.palette.text.secondary};
            background: radial-gradient(
              ${theme.palette.text.secondary},
              ${theme.palette.text.secondary} 50%,
              transparent 50%
            );
            border-width: 0px;
            color: ${theme.palette.primary.main};
          }
        }
      `}
    >
      <FontAwesomeIcon
        color={'white'}
        icon={
          scrollUp || !autoSwitchDirections
            ? faArrowCircleUp
            : faArrowCircleDown
        }
        className="fontawesome-icon"
      />
      {showText && (
        <Typography
          variant="body1"
          css={css`
            && {
              color: ${theme.palette.text.primary};
              margin-top: 0.25rem;
              font-size: 0.95rem;
              text-decoration: underline;
              font-weight: 700;
              line-height: 1.15rem;
            }
          `}
        >
          {scrollUp || !autoSwitchDirections ? scrollUpText : scrollDownText}
        </Typography>
      )}
    </IconButton>
  );
};
