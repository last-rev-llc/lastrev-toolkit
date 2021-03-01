# LastRev Content Prefetcher

The purpose of this command line tool is to pre-fetch content for LastRev projects prior to running the next build (or any other build). This saves build time on frequently accessed objects such as global settings. The script also generates some useful files such as the adapter config and component mappings.

## Usage

```bash
npm install --save-dev @last-rev/build-content-prefetcher
npx lr-prefetch
```

or, in an npm script:

```json
{
  //...
  "scripts": {
    "build:pre": "lr-prefetch"
  }
}
```

## Configuration

The project is configured via the JSON syntaxed `.lastrevrc` file in the root of your project.

In order to get schema validation, either add the following property to the .lastrevrc file:

`"$schema":"https://raw.githubusercontent.com/last-rev-llc/lastrev-toolkit/master/packages/lastrev-build-prefetch-content/schemas/v5.json"`

Or make sure you have the following settings in your .vscode file at the root of the project:

```json
{
  "files.associations": {
    ".lastrevrc": "json"
  },
  "json.schemas": [
    {
      "fileMatch": [".lastrevrc"],
      "url": "https://raw.githubusercontent.com/last-rev-llc/lastrev-toolkit/master/packages/lastrev-build-prefetch-content/schemas/v5.json"
    }
  ]
}
```

| Property                                  | Type                                | Description                                                                                                                                                                             | Required                                                                                                                                                                                 | Default Value          |
| ----------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------- |
| useAdapter                                | boolean                             | Whether to use the adapter to transform the data fetched from contentful. If this is true, another property at the root of the file should be configured for the adapter config to use. | No                                                                                                                                                                                       | `false`                |
| writeMappings                             | boolean                             | Whether to write the component mappings file.                                                                                                                                           | No                                                                                                                                                                                       | `false`                |
| writeSettings                             | boolean                             | Whether to write the settings file.                                                                                                                                                     | No                                                                                                                                                                                       | `false`                |
| writeAdapterConfig                        | boolean                             | Whether to write the adapter config file.                                                                                                                                               | No                                                                                                                                                                                       | `false`                |
| writePaths                                | boolean                             | Whether to write the paths file.                                                                                                                                                        | No                                                                                                                                                                                       | `false`                |
| writeContentJson                          | boolen                              | Whether or not to write JSON files for the content to be used to render the pages.                                                                                                      | No                                                                                                                                                                                       | `false`                |
| writeLocaleData                           | boolean                             | Whether to write the i18n.json and locale lookup files.                                                                                                                                 | No                                                                                                                                                                                       | `false`                |
| settings                                  | object                              | the levels of depth to grab in the GlobalSettings object.                                                                                                                               | No                                                                                                                                                                                       |                        |
| mappings                                  | object                              | Configure the component mapper. See below.                                                                                                                                              | No                                                                                                                                                                                       |                        |
| mappings.overrides                        | { [contentTypeId: string]: string } | Key value pair of content type id to component name, overriding the default pascalCase lookup of component.                                                                             | No                                                                                                                                                                                       | `{}`                   |
| mappings.exclude                          | string[]                            | An array of component names to exclude form the mappings. This is useful to avoid circular dependencies, which will break storybook functionality.                                      | No                                                                                                                                                                                       | `[]`                   |
| locales                                   | object                              | Configure the locales data writer. See below.                                                                                                                                           | No                                                                                                                                                                                       |                        |
| locales.localizationLookupFieldName       | string                              | The name of the localizationLookup field in the global settings object .                                                                                                                | No                                                                                                                                                                                       | `'localizationLookup'` |
| contentJson                               | { [contentTypeId: string]: object } | A configuration object keyed by content type.                                                                                                                                           | No                                                                                                                                                                                       | `{}`                   |
| contentJson.{contentType}.slugField       | string                              | the name of the field used for the slug of this content type.                                                                                                                           | No                                                                                                                                                                                       | `'sys.id'`             |
| contentJson.{contentType}.include         | number                              | The depth to which nested referenced entries are expanded.                                                                                                                              | No                                                                                                                                                                                       | `1`                    |
| contentJson.{contentType}.rootOmitFields  | string[]                            | An array of field names to omit from the page object at the root level.                                                                                                                 | No                                                                                                                                                                                       | `[]`                   |
| contentJson.{contentType}.childOmitFields | string[]                            | An array of field names to omit from nested entries at all child levels.                                                                                                                | No                                                                                                                                                                                       | `[]`                   |
| paths                                     | object                              | An object, described below, configuring how to write the paths                                                                                                                          | No                                                                                                                                                                                       | `{}`                   |
| paths.type                                | 'Nested Children'                   | 'Nested Parent'                                                                                                                                                                         | How the nesting is arranged. Nested Children will build an object based on child items of a parent property, nested parent will build a hierarchy based on a parent field of the object. | No                     | `'Nested Children'` |
| paths.config                              | object                              | see examples below for how to configure these obejcts                                                                                                                                   | No                                                                                                                                                                                       | {}                     |

example

```json
{
  "build": {
    "useAdapter": true,
    "writeSettings": true,
    "writeAdapterConfig": true,
    "writePaths": true,
    "writeLocaleData": true,
    "writeMappings": true,
    "settingsInclude": 10,
    "writeContentJson": true,
    "paths": {
      "type": "Nested Children",
      // shorthand, describing single level paths and which field to use
      "pageGeneral": "slug",
      "pageRecipe": "slug",
      // a nested child configuration.
      // The top level represents the parent, in this example an object of type "recipe", the param represents the param to use,
      // the children object has a param represening the slug name for this level, and the fieldName for which field represents the children.
      // outputs the following structure:
      //{
      // "params": {
      //   "topicslug": "what-does-it-mean-to-be-an-admin-for-dropbox",
      //   "slug": "business-admin-course"
      // }
      "nestedPageRecipeStep": {
        "param": "slug",
        "contentType": "recipe",
        "children": {
          "param": "stepslug",
          "fieldName": "steps"
        }
      }
    },
    // alternatively:
    // this is the suggested approach.
    // this will generate path objects for next.js as well as the href and as
    // properties of the content item, which will be used in the adapter
    // outputs the following structure:
    // {
    //   "params": {
    //     "slug": [
    //       "test-post-column-type",
    //       "test-page-post"
    //     ]
    //   }
    // }
    "paths": {
      "type": "Nested Parent",
      "config": {
        "pageIngredient": {
          // which field to use. defaults to "slug"
          "fieldName": "slug",
          // the param name to use in the path object
          // defaults to "slug"
          "paramName": "slug",
          // The maxDepth to go in the hierarchy
          // defaults to 10
          "maxDepth": 3,
          // the root for the  URLs
          "root": "/recipes",
          "parentField": "parentRecipe"
        },
        "pageRecipe": {
          "fieldName": "slug",
          "paramName": "slug",
          "maxDepth": 1,
          "root": "/recipes"
        }
      }
    },
    "mappings": {
      "exclude": ["PageGeneral"],
      "overrides": {
        "settingsGlobal": "Layout",
        "globalFooter": "Footer"
      }
    },
    "contentJson": {
      "pageCourseTopic": {
        "slugField": "slug",
        "include": 5,
        "rootOmitFields": ["internalTitle"],
        "childOmitFields": ["tags", "contentSections", "content", "internalTitle", "seo"]
      }
    }
  },
  "adapter": {
    "urlMap": {
      "pageGeneral": {
        "url": "/[key]",
        "key": "slug"
      },
      "pageRecipe": {
        "url": "recipes/[key]",
        "key": "slug"
      }
    }
  }
}
```

### Configuring paths (Nested Children)

Paths can either be a mapping of contentType to parameter:

```json
{
  "config": {
    "pageRecipe": "slug"
  }
}
```

or a more complex object where children parameters can be defined:

```json
{
  "config": {
    "nestedPageRecipeStep": {
      "param": "slug",
      "contentType": "recipe",
      "children": {
        "param": "stepslug",
        "fieldName": "steps",
        "children": {
          // param:...
          // fieldName:...
        }
      }
    }
  }
}
```

## Output

The following files will be generated into the `src/buildArtifacts` directory, which will allow them to be built along with other project resources. Please remember to add this directory toyour `.gitignore` file.

```
src
├── buildArtifacts
│   ├── contentJson
│   │   ├── en-US
│   │   │   ├── slug-1.js
│   │   │   └── slug-2.js
│   │   └── sp
│   │       ├── slug-1.js
│   │       └── slug-2.js
│   ├── adapterConfig.js
│   ├── mapping.js
│   ├── paths.js
│   └── settings.js
```
