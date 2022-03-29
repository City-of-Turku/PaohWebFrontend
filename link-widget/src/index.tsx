import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PalveluohjainLink from './link';

export interface ILinkConfig {
  debug: boolean;
  background: string;
  color: string;
  language?: string; // No default value, the website itself will either use the language the user used on previous visit or default to Finnish.
  municipality: string;
  position: string;
  text: string;
  topic?: string;
  zIndex: number;
}

/**
 * Component is expecting page to contain a HTML element (such as div) with id 'palveluohjain-link'.
 * However, if such element is not present, the an element with id 'palveluohjain-link-widget' will
 * be created an
 * @param config ILinkConfig - Parameters used to customize widget appearance and behavior
 */
export const init = (config: ILinkConfig) => {
  const { debug } = config;

  const load = () => {
    const element = document.getElementById('palveluohjain-link');

    if (!element) {
      const node = document.createElement('div');
      node.setAttribute('id', 'palveluohjain-link-widget');
      document.body.appendChild(node);
    }

    const mountElement =
      element || document.getElementById('palveluohjain-link-widget');

    if (debug) {
      console.log(config);
    }
    const linkElement = React.createElement(PalveluohjainLink, config);
    ReactDOM.render(linkElement, mountElement);
  };

  // Wait for document load to complete before attempting to inject the component onto the page
  if (document.readyState === 'complete') {
    load();
  } else {
    window.addEventListener('load', () => {
      load();
    });
  }
};
