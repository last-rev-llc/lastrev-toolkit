/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import mockEntry from '../entryParser/entryParser.mock';
import mockAsset from '../assetParser/assetParser.mock';

export default {
  linkText: 'hello',
  action: 'Open in the same window',
  destinationType: 'Asset reference',
  assetReference: mockAsset(true),
  contentReference: mockEntry,
  manualUrl: 'http://ww.google.com'
};
