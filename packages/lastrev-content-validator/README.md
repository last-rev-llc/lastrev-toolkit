# LastRev Content Validator

This module provides a set of useful components to catch Content validation errors and provides a DOM API to expose validation errors to extensions.

## Environment variables

This module expects the following environment variables:

- `CONTENTFUL_SPACE_ID` = The spaceId from contentful
- `CONTENTFUL_ENV` - Contentful environment
- `CONTENTFUL_ACCESSTOKEN` - Contentful API access token
- `CONTENTFUL_HOST` - Contentful Host
- `CONTENTFUL_SETTINGS_ID` - The ID of the `settingsGlobal` content item to use

## usage

First you'll need to setup the `ContentValidationProvider` by wrapping your root component with it.

```javascript
import { ContentValidationProvider } from '@last-rev/content-validator';

// This default export is required in a new `pages/_app.js` file for Next.js.
function MyApp({ Component, pageProps }) {
   return (
    <ContentValidationProvider logLevel="ERROR"> // Default is DEBUG which only logs the errors
          <Component {...pageProps} />
    </ContentValidationProvider>
  );
```

You can use this module as a HOC by wrapping the default export with it:

```javascript
//From
export default ElementLink;

//To
export default withContentValidation()(ElementLink);
```

This will parse the propTypes of the component, check for any errors and TRY to render the component.

If the component fails to render it'll just return `null` and you can get the errors from the HTML.

You can also pass options when calling the HOC to configure the usage:

```javascript
export default withContentValidation({
  logLevel: 'ERROR'
})(ElementLink);
// DEBUG: This is the default, it will log the error and inject DOM attributes
// ERROR: will throw the Error to be handled
```

## Documentation

Official documentation can be found [here](https://last-rev-llc.github.io/lastrev-content-validator/index.html).
