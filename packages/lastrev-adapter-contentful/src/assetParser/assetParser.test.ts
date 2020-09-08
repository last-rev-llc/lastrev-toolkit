import { has } from 'lodash';
import assetParser from './assetParser';
import mockContent from './assetParser.mock';

describe('assetParser.js', () => {
  test('correctly parsers image asset', () => {
    const mock = mockContent(true);
    const parsed = assetParser(mock);
    expect(parsed).toMatchObject({
      title: mock.fields.title,
      description: mock.fields.description,
      url: mock.fields.file.url,
      size: mock.fields.file.details.size,
      width: mock.fields.file.details.image.width,
      height: mock.fields.file.details.image.height,
      filename: mock.fields.file.fileName,
      contentType: mock.fields.file.contentType
    });
  });
  test('correctly parsers non-image asset', () => {
    const mock = mockContent(false);
    const parsed = assetParser(mock);
    expect(parsed).toMatchObject({
      title: mock.fields.title,
      description: mock.fields.description,
      url: mock.fields.file.url,
      size: mock.fields.file.details.size,
      filename: mock.fields.file.fileName,
      contentType: mock.fields.file.contentType
    });
    expect(has(parsed, 'width')).toBe(false);
    expect(has(parsed, 'height')).toBe(false);
  });
});
