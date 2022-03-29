import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { RecommendationsList } from './recommendations-list';
import { IRecommendation } from '../../models/recommendation';
import { MemoryRouter } from 'react-router-dom';

const testRecs: IRecommendation[] = [
  {
    service: {
      id: '1',
      name: {
        value: 'Esimerkkipalvelu',
        language: 'fi',
        autoTranslated: false,
      },
      organizations: [],
      descriptions: [
        {
          value: 'Tämä on palvelun kuvaus.',
          type: 'Description',
          language: 'fi',
          autoTranslated: false,
        },
        {
          value: 'Tämä on tiivistelmä palvelun kuvauksesta.',
          type: 'Summary',
          language: 'fi',
          autoTranslated: false,
        },
      ],
      areas: [],
    },
    channels: [],
  },
];

it('renders empty list correctly', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <RecommendationsList recommendations={[]} />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it('renders non-empty list correctly', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <RecommendationsList recommendations={testRecs} />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it('shows placeholder text when there are no recommendations', () => {
  render(
    <MemoryRouter>
      <RecommendationsList recommendations={[]} />
    </MemoryRouter>,
  );
  const placeholder = screen.getByText(
    'Kerro jotain tilanteestasi saadaksesi suosituksia.',
  );
  expect(placeholder).toBeInTheDocument();
});

it('does not show placeholder text when recommendations are available', () => {
  render(
    <MemoryRouter>
      <RecommendationsList recommendations={testRecs} />
    </MemoryRouter>,
  );
  const placeholder = screen.queryByText(
    'Kerro jotain tilanteestasi saadaksesi suosituksia.',
  );
  expect(placeholder).toBeNull();
});
