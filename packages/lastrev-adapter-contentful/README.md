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
  assetRefTypeText = 'Asset reference'
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
