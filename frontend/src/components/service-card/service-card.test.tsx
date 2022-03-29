import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { IRecommendation } from '../../models/recommendation';
import { IService } from '../../models/service';
import { ServiceCard } from './service-card';
import { MemoryRouter } from 'react-router-dom';

const testRec: IRecommendation = {
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
};

test('renders a recommendation that does not have any channels', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ServiceCard service={testRec.service} channels={testRec.channels} />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

describe('Extracting description from a service', () => {
  const serviceWithoutDescription: IService = {
    id: '404',
    name: {
      value: 'Esimerkkipalvelu',
      language: 'fi',
      autoTranslated: false,
    },
    organizations: [],
    descriptions: [],
    areas: [],
  };

  test('renders a service that does not have any description available', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ServiceCard service={serviceWithoutDescription} channels={[]} />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  const serviceWithSummary: IService = {
    id: '404',
    name: {
      value: 'Esimerkkipalvelu',
      language: 'fi',
      autoTranslated: false,
    },
    organizations: [],
    descriptions: [
      {
        value: 'Tämä on palvelun GD_Description.',
        type: 'GD_Description',
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
  };

  const allDescAvailable: IService = {
    id: '100',

    name: {
      value: 'Esimerkkipalvelu kaikilla kuvauksilla',
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
      {
        value: 'Tämä on palvelun GD_Description.',
        type: 'GD_Description',
        language: 'fi',
        autoTranslated: false,
      },
      {
        value: 'Tämä on palvelun GD_Summary.',
        type: 'GD_Summary',
        language: 'fi',
        autoTranslated: false,
      },
    ],
    areas: [],
  };

  it('Show service description despite other descriptions being available', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={allDescAvailable} channels={[]} />
      </MemoryRouter>,
    );

    const description = screen.getByText('Tämä on palvelun kuvaus.');
    expect(description).toBeInTheDocument();

    expect(
      screen.queryByText('Tämä on tiivistelmä palvelun kuvauksesta.'),
    ).toBeNull();
  });

  it('Shows a placeholder/error message when description missing', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithoutDescription} channels={[]} />
      </MemoryRouter>,
    );
    const errorMsg = screen.getByText(
      'Virhe: Palvelulle ei ole saatavilla kuvausta.',
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it('Shows the summary if description not available', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithSummary} channels={[]} />
      </MemoryRouter>,
    );
    const summaryText = screen.getByText(
      'Tämä on tiivistelmä palvelun kuvauksesta.',
    );
    expect(summaryText).toBeInTheDocument();
  });

  const serviceWithGD: IService = {
    id: '404',
    name: {
      value: 'Esimerkkipalvelu',
      language: 'fi',
      autoTranslated: false,
    },
    organizations: [],
    descriptions: [
      {
        value: 'Tämä on palvelun GD_Description.',
        type: 'GD_Description',
        language: 'fi',
        autoTranslated: false,
      },
      {
        value: 'Tämä on palvelun GD_Summary.',
        type: 'GD_Summary',
        language: 'fi',
        autoTranslated: false,
      },
    ],
    areas: [],
  };

  it('Shows general description if summary or description is not available', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithGD} channels={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/GD_Description/)).toBeInTheDocument();
  });

  const serviceWithGDSummary: IService = {
    id: '404',
    name: {
      value: 'Esimerkkipalvelu',
      language: 'fi',
      autoTranslated: false,
    },
    organizations: [],
    descriptions: [
      {
        value: 'Tämä on palvelun GD_Summary.',
        type: 'GD_Summary',
        language: 'fi',
        autoTranslated: false,
      },
    ],
    areas: [],
  };

  it('Shows general summary if nothing else is available', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithGDSummary} channels={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/GD_Summary/)).toBeInTheDocument();
  });
});
