import beetleSurveyConfig from 'Survey/Ecosystem/Beetle/config';
import mothSurveyConfig from 'Survey/Ecosystem/Moth/config';
import Occurrence from '.';
import Media from '../image';
import identifyImage from './services/indiciaAI';

jest.mock('./services/indiciaAI', () => jest.fn());

const mothSuggestion = {
  warehouseId: 123,
  probability: 0.95,
  commonNames: ['Garden Tiger'],
  scientificName: 'Arctia caja',
  tvk: 'moth-tvk',
};

describe('Occurrence identification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Media.prototype, 'uploadFile').mockResolvedValue(true);
    jest
      .spyOn(Media.prototype, 'getRemoteURL')
      .mockReturnValue('https://example.com/moth.jpg');
    identifyImage.mockResolvedValue({
      classifierVersion: '1',
      suggestions: [mothSuggestion],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('identifies and reidentifies a standalone moth without saving a record', async () => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    const save = jest.spyOn(occurrence, 'save');

    // When
    await occurrence.identify('moth');
    await occurrence.identify('moth');

    // Then
    expect(identifyImage).toHaveBeenCalledTimes(2);
    expect(identifyImage).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'waarneming', taxonGroupId: 114 })
    );
    expect(occurrence.data.taxon).toEqual(
      expect.objectContaining({ scientificName: mothSuggestion.scientificName })
    );
    expect(occurrence.media[0].data.identified).toBe(true);
    expect(occurrence.isIdentifying).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it('identifies and reidentifies a standalone beetle without saving a record', async () => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    const save = jest.spyOn(occurrence, 'save');
    const beetleSuggestion = {
      ...mothSuggestion,
      commonNames: ['Common Shoulderblade'],
      scientificName: 'Abax parallelepipedus',
    };
    identifyImage.mockResolvedValue({
      classifierVersion: '1',
      suggestions: [beetleSuggestion],
    });

    // When
    await occurrence.identify('beetle');
    await occurrence.identify('beetle');

    // Then
    expect(identifyImage).toHaveBeenCalledTimes(2);
    expect(identifyImage).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'waarneming', listId: 280 })
    );
    expect(occurrence.data.taxon).toEqual(
      expect.objectContaining({
        scientificName: beetleSuggestion.scientificName,
      })
    );
    expect(occurrence.media[0].data.identified).toBe(true);
    expect(occurrence.isIdentifying).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it('still defaults standalone identification to plants', async () => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    const identifyPlant = jest
      .spyOn(occurrence, 'identifyPlant')
      .mockResolvedValue();

    // When
    await occurrence.identify();

    // Then
    expect(identifyPlant).toHaveBeenCalledTimes(1);
    expect(identifyImage).not.toHaveBeenCalled();
  });

  it.each([
    ['moth', 'identifyMoth'],
    ['beetle', 'identifyBeetle'],
    ['plant', 'identifyPlant'],
  ])('uses the explicit %s group', async (group, method) => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    occurrence.parent = { data: { surveyId: mothSurveyConfig.id } };
    const identify = jest.spyOn(occurrence, method).mockResolvedValue();

    // When
    await occurrence.identify(group);

    // Then
    expect(identify).toHaveBeenCalledTimes(1);
    expect(occurrence.isIdentifying).toBe(false);
  });

  it.each([
    [beetleSurveyConfig.id, 'identifyBeetle'],
    [mothSurveyConfig.id, 'identifyMoth'],
    [undefined, 'identifyPlant'],
  ])('infers the group from parent survey %s', async (surveyId, method) => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    occurrence.parent = { data: { surveyId } };
    const identify = jest.spyOn(occurrence, method).mockResolvedValue();

    // When
    await occurrence.identify();

    // Then
    expect(identify).toHaveBeenCalledTimes(1);
  });

  it('still identifies and saves moth survey records', async () => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    const parent = {
      data: { surveyId: mothSurveyConfig.id },
      save: jest.fn(),
    };
    occurrence.parent = parent;

    // When
    await occurrence.identify();

    // Then
    expect(identifyImage).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'waarneming', taxonGroupId: 114 })
    );
    expect(parent.save).toHaveBeenCalledTimes(1);
  });

  it('clears the loading state when moth identification fails', async () => {
    // Given
    const occurrence = new Occurrence({ media: [{}] });
    const error = new Error('Identification failed');
    identifyImage.mockRejectedValueOnce(error);

    // When
    const identification = occurrence.identify('moth');

    // Then
    await expect(identification).rejects.toThrow(error);
    expect(occurrence.isIdentifying).toBe(false);
  });
});
