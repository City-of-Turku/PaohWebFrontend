import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { ILinkConfig } from './index';

interface ILinkProps {
  background?: string;
  color?: string;
  position: string;
}

interface IContainerProps {
  zIndex?: number;
  position: string;
}

interface IButtonProps {
  background?: string;
  color?: string;
}

const Container = styled.div<IContainerProps>`
  position: fixed;
  z-index: 1000000;
  z-index: ${(props) => props.zIndex || 1000000};
  ${(props) => (props.position === 'left' ? 'left: 0' : 'right: 0')};

  bottom: 0;
  padding: 2rem;
  text-align: center;
  font-weight: 400;
`;

const Link = styled.a<ILinkProps>`
  position: relative;
  display: flex;
  cursor: pointer;
  padding: 0.8rem 2rem;
  min-height: 2rem;

  // Changes which corner is straight angle depending on whether
  // widget is position left or right
  border-radius: ${(props) =>
    props.position === 'left'
      ? '1.25rem 1.25rem 1.25rem 0'
      : '1.25rem 1.25rem 0 1.25rem'};
  box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.31);
  text-decoration: none;
  background: ${(props) => props.background || '#111832'};
  color: ${(props) => props.color || '#fff'};

  max-width: 500px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
`;

const Text = styled.span`
  margin: auto;
  font-size: 1.1rem;
  color: inherit;
  font-family: arial, sans-serif;
`;

// Close button
const Button = styled.button<IButtonProps>`
  z-index: inherit;
  font-family: arial, sans-serif;
  box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.31);
  border-radius: 100%;
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  font-family: monospace;
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

  background: ${(props) => props.background || '#111832'};
  color: ${(props) => props.color || '#fff'};
`;

const buildParameterLink = (
  lang: string,
  municipality: string,
  topic: string,
): string => {
  const base = 'https://palveluohjaaja.fi';
  const langPath = lang ? `/${lang}` : '';
  const params = [
    municipality ? `municipality=${municipality}` : '',
    topic ? `topic=${topic}` : '',
  ]
    .filter((e) => e.length > 0)
    .join('&');
  return base + langPath + (params ? '?' + params : '');
};

const PalveluohjainLink = ({
  background = '#111832',
  color = '#fff',
  text = 'Mitä etsit? Autan sinua löytämään oikean palvelun.​',
  municipality = '',
  language = '',
  position = 'right',
  topic = '',
  zIndex = 100000,
}: ILinkConfig) => {
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

  const handleLinkClick = (e: any) => {
    if (isClosed) {
      e.preventDefault();
      setIsClosed(false);
    }
  };

  return (
    <Container
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onFocus={handleMouseOver}
      onBlur={handleMouseOut}
      zIndex={zIndex}
      position={position}
    >
      <Button
        style={{
          opacity: isHovering ? 1 : 0,
          display: isClosed ? 'none' : '',
        }}
        onClick={handleClose}
        color={color}
        background={background}
      >
        &times;
      </Button>
      <Link
        href={buildParameterLink(language, municipality, topic)}
        target={'_blank'}
        rel="noreferrer"
        onClick={(e) => handleLinkClick(e)}
        color={color}
        background={background}
        position={position}
      >
        <Text
          style={{ display: isClosed ? 'none' : 'block' }}
          id="palveluohjain-link-text"
        >
          {text || 'Etsi palveluita Palveluohjaista'}
        </Text>
      </Link>
    </Container>
  );
};

export default PalveluohjainLink;
