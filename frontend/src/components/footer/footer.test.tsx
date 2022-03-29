import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { FooterComponent } from './footer';
import { MemoryRouter } from 'react-router-dom';

test('renders link to data protection document', () => {
  render(
    <MemoryRouter>
      <FooterComponent isHomepage={true} />
    </MemoryRouter>,
  );
  const linkElement = screen.getByText(/Tietosuojaseloste/i);
  expect(linkElement).toBeInTheDocument();
});
