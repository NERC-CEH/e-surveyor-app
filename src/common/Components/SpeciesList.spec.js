import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { MachineInvolvement } from 'Survey/common/config';
import SpeciesCard from './SpeciesCard';
import SpeciesList from './SpeciesList';

jest.mock('./SpeciesCard', () => jest.fn(() => null));
jest.mock('models/image', () => jest.fn());
jest.mock('models/occurrence', () => jest.fn());
jest.mock('models/sample', () => jest.fn());

jest.mock('@flumens', () => ({
  ...jest.requireActual('@flumens'),
  useLoader: () => null,
}));

describe('SpeciesList confidence indicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [MachineInvolvement.MACHINE, undefined, false],
    [MachineInvolvement.MACHINE, [], false],
    [MachineInvolvement.HUMAN, undefined, true],
    [MachineInvolvement.HUMAN_ACCEPTED_PREFERRED, [], true],
    [undefined, undefined, true],
  ])('handles %s', (machineInvolvement, images, expectedTick) => {
    // Given
    const taxon = {
      warehouseId: 123,
      scientificName: 'Arctia caja',
      commonName: 'Garden Tiger',
      probability: 0.95,
      machineInvolvement,
      images,
    };

    // When
    renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(SpeciesList, { taxon }))
    );

    // Then
    expect(SpeciesCard.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        species: taxon,
        selectedSpeciesByUser: expectedTick,
      })
    );
  });
});
