import assetParser from './assetParser';
import mockContent from './assetParser.mock';

describe('assetParser.js', () => {
  test('correctly parsers asset', () => {
    const parsed = assetParser(mockContent);
    expect(parsed).toMatchSnapshot();
  });
  test('removes undefined values', () => {
    const {
      fields: { title, file },
      sys
    } = mockContent;
    const parsed = assetParser({
      fields: {
        title,
        file
      },
      sys
    });
    expect(parsed).toMatchSnapshot();
  });
});
