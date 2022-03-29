/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useState } from 'react';
import { useTheme } from '@material-ui/core';

export const FixedLink: FC = () => {
  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isClosed) {
      e.preventDefault();
      setIsClosed(false);
    }
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onFocus={handleMouseOver}
      onBlur={handleMouseOut}
      css={css`
        position: fixed;
        z-index: 1000000;
        right: 0;
        bottom: 0;
        padding: 2rem;
        text-align: center;
        color: #fff;
        font-weight: 400;

        a {
          position: relative;
          display: flex;
          cursor: pointer;
          padding: 0.8rem 2rem;
          min-height: 3.1rem;

          border-radius: 1.25rem 1.25rem 0 1.25rem;
          box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.31);
          text-decoration: none;
          color: #fff;
          background-color: ${theme.palette.primary.main};

          max-width: 500px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          -ms-word-break: break-all;
          word-break: break-all;
          word-break: break-word;
          -ms-hyphens: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
        }

        a:hover {
          background-color: #000;
        }

        span {
          display: block;
          margin: auto;
          font-size: 1.1rem;
          color: inherit;
          font-family: arial, sans-serif;
        }

        button {
          z-index: inherit;
          background: #111832;
          color: #fff;
          box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.31);
          border-radius: 100%;
          border: none;
          width: 1.5rem;
          height: 1.5rem;
          font-family: arial, sans-serif;
          position: absolute;
          right: 0.9rem;
          top: 0.9rem;
          font-size: 1.5rem;

          // For cross symbol inside the button
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;

          opacity: 0;
          cursor: pointer;
          pointer-events: all;
          transition: opacity ease-out 350ms;
          transition-delay: 100ms;
        }
      `}
    >
      <button
        style={{
          opacity: isHovering ? 1 : 0,
          display: isClosed ? 'none' : '',
        }}
        onClick={handleClose}
      >
        &times;
      </button>
      <a
        href="https://palveluohjaaja.fi/fi?municipality=Turku"
        onClick={(e) => handleLinkClick(e)}
        target="_blank"
        rel="noreferrer"
      >
        <span
          style={{
            display: isClosed ? 'none' : 'block',
          }}
        >
          Linkki voisi olla vaikka tällaisessa elementissä
        </span>
      </a>
    </div>
  );
};
