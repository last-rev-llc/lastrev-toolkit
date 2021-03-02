# LastRev Contentful Adapter

Converts contentful data shape to one that is expected by LastRev components.

## usage

```javascript
import Adapter from '@last-rev/adapter-contentful';
import config from './adapter-config';
import contentful from './contentfulApi';

const transform = Adapter(config);

export default async () => {
  return transform(contentful.getGlobalSettings());
};
```

## config

Confifg allows one to override specific field names for parsing URLs:

```javascript
// defaults
{
  urlMap = {},
  linkContentType = 'elementLink',
  sameWindowActionText = 'Open in the same window',
  newWindowActionText = 'Open in a new window',
  modalActionText = 'Open in a modal',
  downloadActionText = 'Download',
  manualEntryTypeText = 'Manual text entry',
  contentRefTypeText = 'Content reference',
  assetRefTypeText = 'Asset reference',
  contentUrlLookup = {}
  skipContentTypes = []
}

// example:

{
  "urlMap": {
    "pageGeneral": {
      "url": "/[key]", // alweays use "key" for the slug here
      "key": "slug" // this is what the next.js dynamic routing framework
      // expects the param to be called
    },
    "pageRecipe": {
      "url": "/recipes/[key]",
      "key": "slug"
    }
  },
  "linkContentType": "ElementCta"
}
```

## URL lookup

The preferred method to generate the correct `_href` and `_as` properties for the content items is to pass in a contentUrlLookup property which maps a contentID to an object like this `{ href: '...whatever', as: '...whatever' }`. If this cannot be done, the old urlMap method is still supported.

## skipping types

If for whatever reason we do not want to traverse items of a specific content type, just pass those content type IDs into the `skipContentTypes` array.
