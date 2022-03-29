import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { theme } from '../theme/theme';
import { getTranslations } from 'translations/locales';

interface ProviderProps {
  children?: React.ReactNode;
}

function AllTheProviders({ children }: ProviderProps) {
  return (
    <IntlProvider locale="fi" messages={getTranslations('fi')}>
      <MuiThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
      </MuiThemeProvider>
    </IntlProvider>
  );
}

// eslint-disable-next-line
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };

/**
 * According to the React docs, Hooks cannot be called from anywhere like regular javascript functions.
 * They can only be called from a functional component or from other hooks.
 *
 * The component below can be used to call hooks in tests. Using a callback, we can pass
 * the result of our custom hook in the outside scope where we want to test it.
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */
const TestHook = ({ callback }: any): null => {
  callback();
  return null;
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const testHook = (callback: any): void => {
  render(<TestHook callback={callback} />);
};
